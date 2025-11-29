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
} from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";

// Config
const API_URL = "http://localhost:5000";

// Types
interface Event { event_id: number; title: string; description: string; event_date: string; location: string; creator_name: string; status: string; upvote_count: number; }
interface Post { post_id: number; content: string; image_url?: string; username: string; status: string; like_count: number; comment_count: number; }
interface User { user_id: number; username: string; email: string; eco_level: number; is_admin: boolean; post_count: number; event_count: number; created_at: string; }
interface Badge { badge_id: number; badge_name: string; description: string; required_level: number; }
interface DashboardStats { totalUsers: number; totalEvents: number; totalPosts: number; pendingApprovals: number; }

type TabType = "events" | "posts" | "users";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>("events");
  const [pendingEvents, setPendingEvents] = useState<Event[]>([]);
  const [pendingPosts, setPendingPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [showBadgeModal, setShowBadgeModal] = useState(false);

  // Stats dihitung dari data (lebih akurat & efisien)
  const stats = useMemo<DashboardStats>(() => ({
    totalUsers: users.length,
    totalEvents: pendingEvents.length,
    totalPosts: pendingPosts.length,
    pendingApprovals: pendingEvents.length + pendingPosts.length,
  }), [users.length, pendingEvents.length, pendingPosts.length]);

  const token = localStorage.getItem("token");

  // Fetch all data
  const loadAllData = useCallback(async () => {
    if (!token) {
      alert("Silakan login sebagai admin");
      return;
    }

    setLoading(true);
    try {
      const [eventsRes, postsRes, usersRes, badgesRes] = await Promise.all([
        fetch(`${API_URL}/events?status=PENDING`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/posts?status=PENDING`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/badges`),
      ]);

      if (!eventsRes.ok || !postsRes.ok || !usersRes.ok) throw new Error("Failed to fetch data");

      const [eventsData, postsData, usersData, badgesData] = await Promise.all([
        eventsRes.json(),
        postsRes.json(),
        usersRes.json(),
        badgesRes.json(),
      ]);

      setPendingEvents(eventsData);
      setPendingPosts(postsData);
      setUsers(usersData);
      setBadges(badgesData);
    } catch (err) {
      console.error(err);
      alert("Gagal memuat data dashboard");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Moderation handlers
  const moderate = useCallback(async (type: "events" | "posts", id: number, status: "ACCEPTED" | "REJECTED") => {
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/admin/${type}/${id}/moderate`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error(await res.text());
      alert(`Berhasil ${status === "ACCEPTED" ? "menyetujui" : "menolak"} ${type === "events" ? "event" : "post"}`);
      loadAllData();
    } catch (err: any) {
      alert(err.message || "Gagal memoderasi");
    }
  }, [token, loadAllData]);

  const awardBadge = async (badgeId: number) => {
    if (!selectedUser || !token) return;

    try {
      const res = await fetch(`${API_URL}/admin/users/${selectedUser}/badge`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ badge_id: badgeId }),
      });

      if (!res.ok) throw new Error(await res.text());
      alert("Badge berhasil diberikan!");
      setShowBadgeModal(false);
      setSelectedUser(null);
      loadAllData();
    } catch (err: any) {
      alert(err.message || "Gagal memberikan badge");
    }
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

  // Render
  if (!token) return <div className="p-8 text-center">Harap login sebagai admin</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-sky-50">
      {/* Header */}
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

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: "Total Users", value: stats.totalUsers, icon: Users, color: "from-blue-500 to-blue-600" },
              { label: "Pending Events", value: stats.totalEvents, icon: Calendar, color: "from-green-500 to-green-600" },
              { label: "Pending Posts", value: stats.totalPosts, icon: MessageSquare, color: "from-purple-500 to-purple-600" },
              { label: "Total Pending", value: stats.pendingApprovals, icon: Clock, color: "from-orange-500 to-orange-600" },
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

      {/* Tabs */}
      <nav className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            {([
              { key: "events", icon: Calendar, label: "Events", count: pendingEvents.length },
              { key: "posts", icon: MessageSquare, label: "Posts", count: pendingPosts.length },
              { key: "users", icon: Users, label: "Users", count: users.length },
            ] as const).map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
          </div>
        ) : (
          <>
            {/* Events Tab */}
            {activeTab === "events" && (
              <Section title={`Pending Events (${pendingEvents.length})`}>
                {pendingEvents.length === 0 ? <EmptyState message="Tidak ada event yang perlu direview" /> : (
                  pendingEvents.map(event => (
                    <EventCard key={event.event_id} event={event} onModerate={(status) => moderate("events", event.event_id, status)} formatDate={formatDate} />
                  ))
                )}
              </Section>
            )}

            {/* Posts Tab */}
            {activeTab === "posts" && (
              <Section title={`Pending Posts (${pendingPosts.length})`}>
                {pendingPosts.length === 0 ? <EmptyState message="Tidak ada post yang perlu direview" /> : (
                  pendingPosts.map(post => (
                    <PostCard key={post.post_id} post={post} onModerate={(status) => moderate("posts", post.post_id, status)} />
                  ))
                )}
              </Section>
            )}

            {/* Users Tab */}
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

      {/* Badge Modal */}
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

// Reusable Components
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

const EventCard: React.FC<{ event: Event; onModerate: (status: "ACCEPTED" | "REJECTED") => void; formatDate: (d: string) => string }> = ({ event, onModerate, formatDate }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-md p-6">
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
        <p className="text-gray-600 mb-3 line-clamp-2">{event.description}</p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <span>Calendar {formatDate(event.event_date)}</span>
          <span>Location {event.location}</span>
          <span>User {event.creator_name}</span>
          <span>Up {event.upvote_count} upvotes</span>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onModerate("ACCEPTED")} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-semibold">
          <CheckCircle className="w-4 h-4" /> Accept
        </button>
        <button onClick={() => onModerate("REJECTED")} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-semibold">
          <XCircle className="w-4 h-4" /> Reject
        </button>
      </div>
    </div>
  </motion.div>
);

const PostCard: React.FC<{ post: Post; onModerate: (status: "ACCEPTED" | "REJECTED") => void }> = ({ post, onModerate }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-md p-6">
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
        {post.username[0].toUpperCase()}
      </div>
      <div className="flex-1">
        <div className="font-semibold text-gray-900 mb-2">{post.username}</div>
        <p className="text-gray-800 whitespace-pre-wrap mb-3">{post.content}</p>
        {post.image_url && (
          <img src={post.image_url} alt="Post" className="w-full max-w-md rounded-lg mb-3 object-cover max-h-96" onError={e => (e.currentTarget.style.display = "none")} />
        )}
        <div className="flex gap-4 text-sm text-gray-500">
          <span>Heart {post.like_count} likes</span>
          <span>Speech Bubble {post.comment_count} comments</span>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onModerate("ACCEPTED")} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-semibold">
          <CheckCircle className="w-4 h-4" /> Accept
        </button>
        <button onClick={() => onModerate("REJECTED")} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-semibold">
          <XCircle className="w-4 h-4" /> Reject
        </button>
      </div>
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