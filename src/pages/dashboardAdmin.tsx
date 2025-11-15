import { motion } from 'framer-motion';
import { 
  Shield, Users, Calendar, MessageSquare, Award, 
  CheckCircle, XCircle, Clock, TrendingUp, Eye 
} from 'lucide-react';
import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000';

interface Event {
  event_id: number;
  title: string;
  description: string;
  event_date: string;
  location: string;
  creator_name: string;
  status: string;
  upvote_count: number;
}

interface Post {
  post_id: number;
  content: string;
  image_url?: string;
  username: string;
  status: string;
  like_count: number;
  comment_count: number;
}

interface User {
  user_id: number;
  username: string;
  email: string;
  eco_level: number;
  is_admin: boolean;
  post_count: number;
  event_count: number;
  created_at: string;
}

interface Badge {
  badge_id: number;
  badge_name: string;
  description: string;
  required_level: number;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'events' | 'posts' | 'users'>('events');
  const [pendingEvents, setPendingEvents] = useState<Event[]>([]);
  const [pendingPosts, setPendingPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalPosts: 0,
    pendingApprovals: 0,
  });

  // Selected user for badge assignment
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [showBadgeModal, setShowBadgeModal] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('Silakan login sebagai admin');
      return;
    }

    try {
      if (activeTab === 'events') {
        const response = await fetch(`${API_URL}/events?status=PENDING`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setPendingEvents(data);
        }
      } else if (activeTab === 'posts') {
        const response = await fetch(`${API_URL}/posts?status=PENDING`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setPendingPosts(data);
        }
      } else if (activeTab === 'users') {
        const [usersRes, badgesRes] = await Promise.all([
          fetch(`${API_URL}/admin/users`, {
            headers: { 'Authorization': `Bearer ${token}` },
          }),
          fetch(`${API_URL}/badges`),
        ]);
        
        if (usersRes.ok) {
          const userData = await usersRes.json();
          setUsers(userData);
        }
        if (badgesRes.ok) {
          const badgeData = await badgesRes.json();
          setBadges(badgeData);
        }
      }

      // Load stats (simplified)
      setStats({
        totalUsers: users.length,
        totalEvents: pendingEvents.length,
        totalPosts: pendingPosts.length,
        pendingApprovals: pendingEvents.length + pendingPosts.length,
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const moderateEvent = async (eventId: number, status: 'ACCEPTED' | 'REJECTED') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/admin/events/${eventId}/moderate`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        alert(`Event berhasil di-${status.toLowerCase()}`);
        loadData();
      }
    } catch (error) {
      console.error('Error moderating event:', error);
      alert('Terjadi kesalahan');
    }
  };

  const moderatePost = async (postId: number, status: 'ACCEPTED' | 'REJECTED') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/admin/posts/${postId}/moderate`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        alert(`Post berhasil di-${status.toLowerCase()}`);
        loadData();
      }
    } catch (error) {
      console.error('Error moderating post:', error);
      alert('Terjadi kesalahan');
    }
  };

  const awardBadge = async (badgeId: number) => {
    if (!selectedUser) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/admin/users/${selectedUser}/badge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ badge_id: badgeId }),
      });

      if (response.ok) {
        alert('Badge berhasil diberikan!');
        setShowBadgeModal(false);
        setSelectedUser(null);
        loadData();
      } else {
        const error = await response.json();
        alert(error.error || 'Gagal memberikan badge');
      }
    } catch (error) {
      console.error('Error awarding badge:', error);
      alert('Terjadi kesalahan');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-sky-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Shield className="w-7 h-7 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Kelola konten dan pengguna Eco Heroes</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Users</p>
                  <p className="text-3xl font-bold mt-1">{stats.totalUsers}</p>
                </div>
                <Users className="w-10 h-10 opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Total Events</p>
                  <p className="text-3xl font-bold mt-1">{stats.totalEvents}</p>
                </div>
                <Calendar className="w-10 h-10 opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Total Posts</p>
                  <p className="text-3xl font-bold mt-1">{stats.totalPosts}</p>
                </div>
                <MessageSquare className="w-10 h-10 opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Pending</p>
                  <p className="text-3xl font-bold mt-1">{stats.pendingApprovals}</p>
                </div>
                <Clock className="w-10 h-10 opacity-80" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('events')}
              className={`px-6 py-4 font-semibold transition-all ${
                activeTab === 'events'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>Events</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('posts')}
              className={`px-6 py-4 font-semibold transition-all ${
                activeTab === 'posts'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                <span>Posts</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-4 font-semibold transition-all ${
                activeTab === 'users'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>Users</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <>
            {/* Events Tab */}
            {activeTab === 'events' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Pending Events ({pendingEvents.length})
                </h2>
                
                {pendingEvents.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-xl">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <p className="text-gray-600">Tidak ada event yang perlu direview</p>
                  </div>
                ) : (
                  pendingEvents.map((event) => (
                    <motion.div
                      key={event.event_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-xl shadow-md p-6"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
                          <p className="text-gray-600 mb-3">{event.description}</p>
                          
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            <span>📅 {formatDate(event.event_date)}</span>
                            <span>📍 {event.location}</span>
                            <span>👤 {event.creator_name}</span>
                            <span>⬆️ {event.upvote_count} upvotes</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => moderateEvent(event.event_id, 'ACCEPTED')}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Accept
                          </button>
                          <button
                            onClick={() => moderateEvent(event.event_id, 'REJECTED')}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}

            {/* Posts Tab */}
            {activeTab === 'posts' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Pending Posts ({pendingPosts.length})
                </h2>
                
                {pendingPosts.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-xl">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <p className="text-gray-600">Tidak ada post yang perlu direview</p>
                  </div>
                ) : (
                  pendingPosts.map((post) => (
                    <motion.div
                      key={post.post_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-xl shadow-md p-6"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                          {post.username[0].toUpperCase()}
                        </div>

                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 mb-2">{post.username}</div>
                          <p className="text-gray-800 whitespace-pre-wrap mb-3">{post.content}</p>
                          
                          {post.image_url && (
                            <img
                              src={post.image_url}
                              alt="Post"
                              className="w-full max-w-md rounded-lg mb-3"
                            />
                          )}

                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>❤️ {post.like_count} likes</span>
                            <span>💬 {post.comment_count} comments</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => moderatePost(post.post_id, 'ACCEPTED')}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Accept
                          </button>
                          <button
                            onClick={() => moderatePost(post.post_id, 'REJECTED')}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  User Management ({users.length})
                </h2>
                
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">User</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Level</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Stats</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Joined</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {users.map((user) => (
                        <tr key={user.user_id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-semibold text-gray-900">{user.username}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                              <Award className="w-4 h-4" />
                              Level {user.eco_level}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {user.post_count} posts · {user.event_count} events
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {formatDate(user.created_at)}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => {
                                setSelectedUser(user.user_id);
                                setShowBadgeModal(true);
                              }}
                              className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-all"
                            >
                              Award Badge
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Badge Award Modal */}
      {showBadgeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full"
          >
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Pilih Badge</h2>
              <p className="text-gray-600 mt-1">Berikan badge kepada user</p>
            </div>

            <div className="p-6 space-y-3">
              {badges.map((badge) => (
                <button
                  key={badge.badge_id}
                  onClick={() => awardBadge(badge.badge_id)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Award className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{badge.badge_name}</div>
                      <div className="text-sm text-gray-600">{badge.description}</div>
                      <div className="text-xs text-green-600 mt-1">Level {badge.required_level}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="p-6 border-t">
              <button
                onClick={() => {
                  setShowBadgeModal(false);
                  setSelectedUser(null);
                }}
                className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-semibold"
              >
                Batal
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;