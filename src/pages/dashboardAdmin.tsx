import { motion } from "framer-motion";
import {
  Shield,
  Users,
  Calendar,
  MessageSquare,
  Award,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Trash2, 
  Heart,
} from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";
import Swal from 'sweetalert2';

// Config
const API_URL = "http://localhost:5000";

// Types
interface Event { event_id: number; title: string; description: string; event_date: string; location: string; creator_name: string; status: string; upvote_count: number; }
interface Post { post_id: number; content: string; image_url?: string; username: string; status: string; like_count: number; comment_count: number; }
interface User { user_id: number; username: string; email: string; eco_level: number; is_admin: boolean; post_count: number; event_count: number; created_at: string; }
interface Badge { badge_id: number; badge_name: string; description: string; required_level: number; }
interface DashboardStats { totalUsers: number; totalEventsPending: number; totalEvents: number; totalPosts: number; }

type TabType = "events_pending" | "events_all" | "posts_all" | "users";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>("events_pending");
  const [pendingEvents, setPendingEvents] = useState<Event[]>([]);
  const [hasLoadedAllEvents, setHasLoadedAllEvents] = useState(false);
  const [allEvents, setAllEvents] = useState<Event[]>([]); 
  const [allPosts, setAllPosts] = useState<Post[]>([]); 
  const [users, setUsers] = useState<User[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingContent, setLoadingContent] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null); 
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [showBadgeModal, setShowBadgeModal] = useState(false);

  const token = localStorage.getItem("token");

  const stats = useMemo<DashboardStats>(() => ({
    totalUsers: users.length,
    totalEventsPending: pendingEvents.length,
    totalEvents: hasLoadedAllEvents ? allEvents.length : 0,
    totalPosts: allPosts.length || 0,
  }), [users.length, pendingEvents.length, allEvents.length, allPosts.length, hasLoadedAllEvents]);

  const formatDate = (date: string) => new Date(date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

  const loadInitialData = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    try {
      const [allEventsRes, usersRes, badgesRes] = await Promise.all([
        fetch(`${API_URL}/admin/events`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/badges`),
      ]);

      if (!allEventsRes.ok || !usersRes.ok) throw new Error("Failed to fetch initial data");

      const [allEventsData, usersData, badgesData] = await Promise.all([
        allEventsRes.json(),
        usersRes.json(),
        badgesRes.json(),
      ]);

      setPendingEvents(allEventsData.filter((e: Event) => e.status === 'PENDING'));
      
      setUsers(usersData);
      setBadges(badgesData);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Gagal memuat data awal dashboard.', 'error');
    } finally {
      setLoading(false);
    }
  }, [token]);
  
  const loadAllEvents = useCallback(async () => {
    if (loadingContent || hasLoadedAllEvents) return; 
    
    setLoadingContent(true);
    try {
      const res = await fetch(`${API_URL}/admin/events`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setAllEvents(data);
      setHasLoadedAllEvents(true);
    } catch (err) {
      console.error('Error fetching all events:', err);
    } finally {
      setLoadingContent(false);
    }
  }, [token, loadingContent, hasLoadedAllEvents]);
  
  const loadAllPosts = useCallback(async () => {
    if (loadingContent || allPosts.length > 0) return;
    
    setLoadingContent(true);
    try {
      const res = await fetch(`${API_URL}/admin/posts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setAllPosts(data);
    } catch (err) {
      console.error('Error fetching all posts:', err);
    } finally {
      setLoadingContent(false);
    }
  }, [token, allPosts.length, loadingContent]);


  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    if (activeTab === 'events_all' && !hasLoadedAllEvents) {
      loadAllEvents();
    } else if (activeTab === 'posts_all' && allPosts.length === 0) {
      loadAllPosts();
    }
  }, [activeTab, loadAllEvents, loadAllPosts, hasLoadedAllEvents, allPosts.length]);

  const deleteItem = useCallback(async (type: "events" | "posts", id: number) => {
    if (!token || deletingId) return;

    const confirmation = await Swal.fire({
        title: `Yakin ingin menghapus ${type === "events" ? "event" : "post"} ini?`,
        text: "Tindakan ini tidak dapat dibatalkan!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, hapus permanen!',
        cancelButtonText: 'Batal'
    });

    if (!confirmation.isConfirmed) return;

    setDeletingId(id);

    try {
      const res = await fetch(`${API_URL}/admin/${type}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error((await res.json()).error || "Gagal menghapus");
      
      if (type === "events") {
          setPendingEvents(prev => prev.filter(e => e.event_id !== id));
          setAllEvents(prev => prev.filter(e => e.event_id !== id));
      } else {
          setAllPosts(prev => prev.filter(p => p.post_id !== id));
      }
      
      Swal.fire('Berhasil!', `${type === "events" ? "Event" : "Post"} berhasil dihapus.`, 'success');

    } catch (err: any) {
      console.error(err);
      Swal.fire('Error', err.message || "Gagal menghapus", 'error');
    } finally {
      setDeletingId(null);
    }
  }, [token, deletingId]); 


  const moderate = useCallback(async (type: "events", id: number, status: "ACCEPTED" | "REJECTED") => {
    if (!token) return;
    
    const statusText = status === "ACCEPTED" ? "menyetujui" : "menolak";
    const confirmation = await Swal.fire({
        title: `Konfirmasi ${statusText} event?`,
        text: `Anda akan ${statusText} event ini.`,
        icon: status === "ACCEPTED" ? 'question' : 'warning',
        showCancelButton: true,
        confirmButtonColor: status === "ACCEPTED" ? '#28a745' : '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: `Ya, ${statusText}!`,
        cancelButtonText: 'Batal'
    });

    if (!confirmation.isConfirmed) return;

    try {
      const res = await fetch(`${API_URL}/admin/${type}/${id}/moderate`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error((await res.json()).error || "Gagal memoderasi");

      Swal.fire('Sukses!', `Berhasil ${statusText} event.`, 'success');
      
      setPendingEvents(prev => prev.filter(e => e.event_id !== id));
      
      if (hasLoadedAllEvents) {
          setAllEvents(prev => prev.map(e => 
              e.event_id === id ? { ...e, status } : e
          ));
      }

    } catch (err: any) {
      console.error(err);
      Swal.fire('Error', err.message || "Gagal memoderasi", 'error');
    }
  }, [token, hasLoadedAllEvents]);

  const awardBadge = async (badgeId: number) => {
    if (!selectedUser || !token) return;

    try {
      const res = await fetch(`${API_URL}/admin/users/${selectedUser}/badge`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ badge_id: badgeId }),
      });

      if (!res.ok) throw new Error((await res.json()).error || "Gagal memberikan badge");
      
      Swal.fire('Berhasil!', "Badge berhasil diberikan!", 'success');

      setShowBadgeModal(false);
      setSelectedUser(null);
      loadInitialData();
    } catch (err: any) {
      console.error(err);
      // 💡 Notifikasi Error
      Swal.fire('Error', err.message || "Gagal memberikan badge", 'error');
    }
  };

  if (!token) return <div className="p-8 text-center">Harap login sebagai admin</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-sky-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Shield className="w-7 h-7 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Kelola konten dan pengguna Eco Heroes</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: "Total Users", value: stats.totalUsers, icon: Users, color: "from-blue-500 to-blue-600" },
              { label: "Pending Events", value: stats.totalEventsPending, icon: Clock, color: "from-orange-500 to-orange-600" },
              { label: "Total Events", value: hasLoadedAllEvents ? stats.totalEvents : '...', icon: Calendar, color: "from-green-500 to-green-600" },
              { label: "Total Posts", value: allPosts.length || (activeTab === 'posts_all' ? 0 : '...'), icon: MessageSquare, color: "from-purple-500 to-purple-600" },
            ].map((stat, i) => (
              <div key={i} className={`bg-gradient-to-br ${stat.color} rounded-xl p-4 text-white`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <stat.icon className="w-10 h-10 opacity-80" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <nav className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            {([
              { key: "events_pending", icon: Clock, label: "Pending Events", count: pendingEvents.length },
              { key: "events_all", icon: Calendar, label: "All Events", count: hasLoadedAllEvents ? allEvents.length : '...' },
              { key: "posts_all", icon: MessageSquare, label: "All Posts", count: allPosts.length || '...' },
              { key: "users", icon: Users, label: "Users", count: users.length },
            ] as const).map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as TabType)}
                className={`px-6 py-4 font-semibold transition-all flex items-center gap-2 ${
                  activeTab === tab.key
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label} ({tab.count})</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {(loading && activeTab === 'events_pending' || loadingContent) ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
          </div>
        ) : (
          <>
            {activeTab === "events_pending" && (
              <Section title={`Events Membutuhkan Persetujuan (${pendingEvents.length})`}>
                {pendingEvents.length === 0 ? <EmptyState message="Tidak ada event yang perlu direview" /> : (
                  pendingEvents.map(event => (
                    <EventCard 
                      key={event.event_id} 
                      event={event} 
                      onModerate={(status) => moderate("events", event.event_id, status)} 
                      onDelete={() => deleteItem("events", event.event_id)}
                      formatDate={formatDate} 
                      showStatus={true}
                      isDeleting={deletingId === event.event_id} 
                    />
                  ))
                )}
              </Section>
            )}
            
            {activeTab === "events_all" && (
              <Section title={`Semua Events (${allEvents.length})`}>
                <div className="space-y-4">
                  {allEvents.length === 0 ? <EmptyState message="Tidak ada event di database" /> : (
                    allEvents.map(event => (
                      <EventCard 
                        key={event.event_id} 
                        event={event} 
                        onModerate={(status) => moderate("events", event.event_id, status)} 
                        onDelete={() => deleteItem("events", event.event_id)}
                        formatDate={formatDate} 
                        showStatus={true} 
                        isDeleting={deletingId === event.event_id} 
                      />
                    ))
                  )}
                </div>
              </Section>
            )}

            {activeTab === "posts_all" && (
              <Section title={`Semua Posts (${allPosts.length})`}>
                <div className="space-y-4">
                  {allPosts.length === 0 ? <EmptyState message="Tidak ada post di database" /> : (
                    allPosts.map(post => (
                      <PostCard 
                        key={post.post_id} 
                        post={post} 
                        onDelete={() => deleteItem("posts", post.post_id)}
                        showStatus={false} 
                        isDeleting={deletingId === post.post_id} 
                      />
                    ))
                  )}
                </div>
              </Section>
            )}

            {activeTab === "users" && (
              <Section title={`User Management (${users.length})`}>
                 <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">User</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Level</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Stats</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Joined</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {users.map(user => (
                        <motion.tr key={user.user_id} className="hover:bg-gray-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-semibold text-gray-900">
                                {user.username} {user.is_admin && <span className="text-xs text-blue-500 font-bold">(Admin)</span>}
                              </div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                              <TrendingUp className="w-4 h-4" /> Level {user.eco_level}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{user.post_count} posts · {user.event_count} events</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{formatDate(user.created_at)}</td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => { setSelectedUser(user.user_id); setShowBadgeModal(true); }}
                              className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition font-semibold"
                            >
                              Award Badge
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>
            )}
          </>
        )}
      </main>

      {showBadgeModal && (
        <Modal onClose={() => { setShowBadgeModal(false); setSelectedUser(null); }}>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pilih Badge</h2>
          <p className="text-gray-600 mb-6">Berikan badge kepada user</p>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {badges.length === 0 ? (
              <p className="text-center text-gray-500">Tidak ada badge tersedia</p>
            ) : (
              badges.map(badge => (
                <button
                  key={badge.badge_id}
                  onClick={() => awardBadge(badge.badge_id)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Award className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{badge.badge_name}</div>
                      <div className="text-sm text-gray-600">{badge.description}</div>
                      <div className="text-xs text-green-600 mt-1">Level {badge.required_level}+</div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="space-y-4">
    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
    {children}
  </section>
);

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="text-center py-12 bg-white rounded-xl">
    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
    <p className="text-gray-600">{message}</p>
  </div>
);

const EventCard: React.FC<{ event: Event; onModerate: (status: "ACCEPTED" | "REJECTED") => void; onDelete: () => void; formatDate: (d: string) => string; showStatus?: boolean; isDeleting: boolean }> = ({ event, onModerate, onDelete, formatDate, showStatus = false, isDeleting }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`bg-white rounded-xl shadow-md p-6 relative ${isDeleting ? 'opacity-70' : ''}`}>
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
        <p className="text-gray-600 mb-3 line-clamp-2">{event.description}</p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <span><Calendar className="w-4 h-4 inline-block mr-1" /> {formatDate(event.event_date)}</span>
          <span>Location {event.location}</span>
          <span>User {event.creator_name}</span>
          <span>Up {event.upvote_count} upvotes</span>
          {showStatus && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                event.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                event.status === 'PENDING' ? 'bg-orange-100 text-orange-800' :
                'bg-red-100 text-red-800'
            } ml-2`}>
                {event.status}
            </span>
          )}
        </div>
      </div>
      <div className="flex gap-2 items-start">
        {event.status === 'PENDING' && (
          <>
            <button onClick={() => onModerate("ACCEPTED")} disabled={isDeleting} className={`flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-semibold ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <CheckCircle className="w-4 h-4" /> Accept
            </button>
            <button onClick={() => onModerate("REJECTED")} disabled={isDeleting} className={`flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-semibold ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <XCircle className="w-4 h-4" /> Reject
            </button>
          </>
        )}
        
        {event.status !== 'PENDING' && (
            <button onClick={onDelete} disabled={isDeleting} className={`flex items-center gap-2 px-4 py-2 bg-gray-200 text-red-600 rounded-lg hover:bg-gray-300 text-sm font-semibold transition-colors flex-shrink-0 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {isDeleting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600" />
                ) : (
                <Trash2 className="w-4 h-4" />
                )}
            </button>
        )}
      </div>
    </div>
  </motion.div>
);

const PostCard: React.FC<{ post: Post; onDelete: () => void; showStatus?: boolean; isDeleting: boolean }> = ({ post, onDelete, isDeleting }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`bg-white rounded-xl shadow-md p-6 relative ${isDeleting ? 'opacity-70' : ''}`}>
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
        {post.username[0]?.toUpperCase() || 'U'}
      </div>
      <div className="flex-1">
        <div className="font-semibold text-gray-900 mb-2">{post.username}</div>
        <p className="text-gray-800 whitespace-pre-wrap mb-3">{post.content}</p>
        {post.image_url && (
          <img src={post.image_url} alt="Post" className="w-full max-w-md rounded-lg mb-3 object-cover max-h-96" onError={e => (e.currentTarget.style.display = "none")} />
        )}
        <div className="flex gap-4 text-sm text-gray-500">
          <span><Heart className="w-4 h-4 inline-block mr-1" /> {post.like_count} likes</span>
          <span><MessageSquare className="w-4 h-4 inline-block mr-1" /> {post.comment_count} comments</span>
        </div>
      </div>
      <button onClick={onDelete} disabled={isDeleting} className={`flex items-center gap-2 px-4 py-2 bg-gray-200 text-red-600 rounded-lg hover:bg-gray-300 text-sm font-semibold transition-colors flex-shrink-0 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}>
        {isDeleting ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600" />
        ) : (
          <Trash2 className="w-4 h-4" />
        )}
        {isDeleting ? 'Menghapus...' : 'Hapus'}
      </button>
    </div>
  </motion.div>
);

const Modal: React.FC<{ onClose: () => void; children: React.ReactNode }> = ({ onClose, children }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
      onClick={e => e.stopPropagation()}
    >
      {children}
      <button onClick={onClose} className="mt-6 w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold">
        Batal
      </button>
    </motion.div>
  </div>
);

export default AdminDashboard;