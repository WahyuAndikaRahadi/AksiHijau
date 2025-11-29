// SocialCommunity.tsx (FINAL FIXES)
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Send, Image as ImageIcon, Leaf, Award, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000';

interface Post {
  post_id: number;
  content: string;
  image_url?: string;
  username: string;
  eco_level: number;
  like_count: number;
  comment_count: number;
  created_at: string;
}

interface Comment {
  comment_id: number;
  username: string;
  eco_level: number;
  content: string;
  created_at: string;
}

const SocialCommunity = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [comments, setComments] = useState<{ [key: number]: Comment[] }>({});
  const [commentText, setCommentText] = useState('');
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

  // Form state
  const [postContent, setPostContent] = useState('');
  const [postImage, setPostImage] = useState('');

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = !!localStorage.getItem('token'); 

  useEffect(() => {
    loadPosts();
    const savedLiked = localStorage.getItem('likedPosts');
    if (savedLiked) {
      setLikedPosts(new Set(JSON.parse(savedLiked)));
    }
  }, []);

  const loadPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/posts`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!postContent.trim() || isPosting) return;

    const token = localStorage.getItem('token');
    if (!token) {
        alert('Silakan login terlebih dahulu untuk membuat post.');
        return;
    }

    setIsPosting(true);
    
    try {
      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: postContent,
          image_url: postImage || null,
        }),
      });

      if (response.ok) {
        const newPost: Post = await response.json(); 

        // FIX for Invalid Date on immediate display: 
        // Ensure the created_at timestamp is valid for the optimistic update.
        // If the backend returns an incomplete/unparseable date string, 
        // use the current time (ISO string) as a fallback.
        const postToAdd: Post = {
            ...newPost,
            // Check if created_at exists AND is a parseable date. If not, use current time.
            created_at: newPost.created_at && !isNaN(new Date(newPost.created_at).getTime()) 
                        ? newPost.created_at 
                        : new Date().toISOString(),
            // Safety check for like/comment count if backend doesn't return them immediately
            like_count: newPost.like_count ?? 0, 
            comment_count: newPost.comment_count ?? 0,
        };

        setPosts(prev => [postToAdd, ...prev]);
        
        setShowCreateModal(false);
        setPostContent('');
        setPostImage('');
      } else {
        const error = await response.json();
        alert(error.error || 'Gagal membuat post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Terjadi kesalahan');
    } finally {
      setIsPosting(false);
    }
  };

  const handleLike = async (postId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Silakan login untuk like');
        return;
      }

      const response = await fetch(`${API_URL}/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Optimistic UI Update untuk Like
        setPosts(prevPosts =>
            prevPosts.map(post => {
                if (post.post_id === postId) {
                    const isCurrentlyLiked = likedPosts.has(postId);
                    return {
                        ...post,
                        like_count: isCurrentlyLiked ? post.like_count - 1 : post.like_count + 1,
                    };
                }
                return post;
            })
        );
        
        setLikedPosts(prev => {
          const newSet = new Set(prev);
          if (newSet.has(postId)) {
            newSet.delete(postId);
          } else {
            newSet.add(postId);
          }
          localStorage.setItem('likedPosts', JSON.stringify([...newSet]));
          return newSet;
        });
      }
    } catch (error) {
      console.error('Error liking post:', error);
      loadPosts(); 
    }
  };

  const loadComments = async (postId: number) => {
    try {
      const response = await fetch(`${API_URL}/posts/${postId}/comments`);
      
      if (response.ok) {
        const data = await response.json();
        setComments(prev => ({ ...prev, [postId]: data }));
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handleAddComment = async (postId: number) => {
    if (!commentText.trim()) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Silakan login untuk komentar');
        return;
      }

      const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content: commentText }),
      });

      if (response.ok) {
        const newComment: Comment = await response.json(); 
        
        setComments(prev => ({
            ...prev,
            [postId]: [newComment, ...(prev[postId] || [])],
        }));

        setPosts(prevPosts => 
            prevPosts.map(post => 
                post.post_id === postId ? { ...post, comment_count: post.comment_count + 1 } : post
            )
        );

        setCommentText('');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const toggleComments = (postId: number) => {
    if (selectedPost === postId) {
      setSelectedPost(null);
    } else {
      setSelectedPost(postId);
      if (!comments[postId]) {
        loadComments(postId);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    
    // Robustness check for Invalid Date
    if (isNaN(date.getTime())) {
        return 'Invalid Date'; 
    }
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit yang lalu`;
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    if (diffDays < 7) return `${diffDays} hari yang lalu`;
    
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getLevelBadge = (level: number) => {
    const badges: { [key: number]: { name: string; color: string } } = {
      1: { name: 'Eco Seed', color: 'bg-green-400' },
      2: { name: 'Leaflet Hero', color: 'bg-green-500' },
      3: { name: 'Green Guardian', color: 'bg-green-600' },
      4: { name: 'Eco Warrior', color: 'bg-green-700' },
      5: { name: 'Planetary Champion', color: 'bg-green-800' },
    };
    return badges[level] || badges[1];
  };

  const ImagePreview: React.FC<{ url: string, onRemove: () => void }> = ({ url, onRemove }) => {
    const [imgError, setImgError] = useState(false);
    useEffect(() => { setImgError(false); }, [url]);

    if (!url || imgError) return null;

    return (
        <div className="relative mt-3">
            <img
                src={url}
                alt="Preview"
                className="w-full rounded-lg object-cover max-h-64 border border-gray-200"
                onError={() => {
                    setImgError(true);
                    onRemove(); 
                    alert('Gagal memuat gambar dari link tersebut.');
                }}
            />
            <button
                onClick={onRemove}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700 transition"
            >
                <XCircle className="w-4 h-4" />
            </button>
        </div>
    );
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-sky-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Leaf className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Social Feed</h1>
                <p className="text-sm text-gray-600">Bagikan aksi hijau Anda</p>
              </div>
            </div>
            
            <button
              onClick={() => {
                if (isLoggedIn) setShowCreateModal(true);
                else alert('Harap login untuk membuat Post.');
              }}
              disabled={!isLoggedIn}
              className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-all shadow-md ${
                isLoggedIn ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
              <span className="font-semibold hidden sm:inline">Post</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pesan Login */}
      {!isLoggedIn && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="text-center py-4 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg shadow-sm">
            <p className="font-semibold">Anda belum login.</p>
            <p className="text-sm mt-1">Silakan login untuk membuat post, memberi like, dan berkomentar.</p>
          </div>
        </div>
      )}

      {/* Main Feed */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-md">
                <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">Belum ada post</p>
                <p className="text-gray-500 text-sm mt-2">Jadilah yang pertama berbagi!</p>
              </div>
            ) : (
              posts.map((post, index) => {
                const badge = getLevelBadge(post.eco_level);
                const isLiked = likedPosts.has(post.post_id);
                
                return (
                  <motion.div
                    key={post.post_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                  >
                    {/* Post Header */}
                    <div className="p-4 flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {/* Safely access username initial */}
                        {(post.username?.[0] || 'U').toUpperCase()} 
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">{post.username}</span>
                          <div className={`${badge.color} text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1`}>
                            <Award className="w-3 h-3" />
                            <span>{badge.name}</span>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{formatDate(post.created_at)}</span>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="px-4 pb-3">
                      <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
                    </div>

                    {/* Post Image */}
                    {post.image_url && (
                      <div className="px-4 pb-3">
                        <img
                          src={post.image_url}
                          alt="Post"
                          className="w-full rounded-lg object-cover max-h-96"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }} 
                        />
                      </div>
                    )}

                    {/* Post Actions */}
                    <div className="px-4 py-3 border-t flex items-center gap-6">
                      <button
                        onClick={() => handleLike(post.post_id)}
                        disabled={!isLoggedIn} 
                        className={`flex items-center gap-2 transition-colors ${
                          isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                        } ${!isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500' : ''}`} />
                        <span className="font-semibold">{post.like_count}</span>
                      </button>
                      
                      <button
                        onClick={() => toggleComments(post.post_id)}
                        className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span className="font-semibold">{post.comment_count}</span>
                      </button>
                    </div>

                    {/* Comments Section */}
                    {selectedPost === post.post_id && (
                      <div className="border-t bg-gray-50">
                        {/* Comment Input */}
                        <div className="p-4 flex gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                            {currentUser.username?.[0]?.toUpperCase() || 'A'}
                          </div>
                          <div className="flex-1 flex gap-2">
                            <input
                              type="text"
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              placeholder={isLoggedIn ? "Tulis komentar..." : "Login untuk berkomentar"}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter' && isLoggedIn) {
                                  handleAddComment(post.post_id);
                                }
                              }}
                              disabled={!isLoggedIn} 
                            />
                            <button
                              onClick={() => handleAddComment(post.post_id)}
                              disabled={!isLoggedIn || !commentText.trim()}
                              className={`px-4 py-2 text-white rounded-full transition-all ${
                                isLoggedIn ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
                              }`}
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Comments List */}
                        <div className="px-4 pb-4 space-y-3">
                          {comments[post.post_id]?.map((comment) => {
                            const commentBadge = getLevelBadge(comment.eco_level);
                            
                            return (
                              <div key={comment.comment_id} className="flex gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                  {/* Safely access comment username initial */}
                                  {(comment.username?.[0] || 'U').toUpperCase()} 
                                </div>
                                <div className="flex-1 bg-white rounded-lg p-3">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-sm text-gray-900">{comment.username}</span>
                                    <div className={`${commentBadge.color} text-white text-xs px-2 py-0.5 rounded-full`}>
                                      {commentBadge.name}
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-800">{comment.content}</p>
                                  <span className="text-xs text-gray-500 mt-1 inline-block">
                                    {formatDate(comment.created_at)}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      {showCreateModal && isLoggedIn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full"
          >
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Buat Post Baru</h2>
              <p className="text-gray-600 mt-1">Bagikan aksi hijau Anda dengan komunitas</p>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apa yang ingin Anda bagikan? *
                  </label>
                  <textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ceritakan aksi hijau Anda, tips lingkungan, atau pengalaman menarik..."
                    disabled={isPosting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      <span>URL Gambar (opsional)</span>
                    </div>
                  </label>
                  <input
                    type="url"
                    value={postImage}
                    onChange={(e) => setPostImage(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                    disabled={isPosting}
                  />
                  {/* ImagePreview component handles error and removal */}
                  <ImagePreview url={postImage} onRemove={() => setPostImage('')} /> 
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex gap-4">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setPostContent('');
                  setPostImage('');
                }}
                disabled={isPosting}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleCreatePost}
                disabled={!postContent.trim() || isPosting}
                className={`flex-1 px-6 py-3 text-white rounded-lg transition-all font-semibold ${
                  !postContent.trim() || isPosting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isPosting ? (
                    <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                        <span>Memposting...</span>
                    </div>
                ) : (
                    'Posting'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SocialCommunity;