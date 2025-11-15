import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, TrendingUp, Plus, Clock, Search, Filter } from 'lucide-react';
import { useState, useEffect } from 'react';

// Mock API URL - ganti dengan URL backend Anda
const API_URL = 'http://localhost:5000';

interface Event {
  event_id: number;
  title: string;
  description: string;
  event_date: string;
  location: string;
  creator_name: string;
  upvote_count: number;
  created_at: string;
}

const CommunityEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // Form state untuk create event
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
  });

  // Load events
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/events`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Silakan login terlebih dahulu');
        return;
      }

      const response = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Event berhasil dibuat! Menunggu persetujuan admin.');
        setShowCreateModal(false);
        setFormData({ title: '', description: '', event_date: '', location: '' });
        loadEvents();
      } else {
        const error = await response.json();
        alert(error.error || 'Gagal membuat event');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Terjadi kesalahan');
    }
  };

  const handleUpvote = async (eventId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Silakan login untuk upvote');
        return;
      }

      const response = await fetch(`${API_URL}/events/${eventId}/upvote`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        loadEvents(); // Reload untuk update count
      }
    } catch (error) {
      console.error('Error upvoting:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calendar helper - get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Empty cells before first day
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const getEventsForDay = (day: number) => {
    if (!day) return [];
    
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    
    return events.filter(event => {
      const eventDate = new Date(event.event_date);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === month &&
        eventDate.getFullYear() === year
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-sky-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Community Events</h1>
              <p className="text-gray-600 mt-1">Temukan dan ikuti event lingkungan di sekitar Anda</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span className="font-semibold">Buat Event</span>
            </button>
          </div>

          {/* Search & Filter */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari event atau lokasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  viewMode === 'list'
                    ? 'bg-green-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  viewMode === 'calendar'
                    ? 'bg-green-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Calendar className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : viewMode === 'list' ? (
          /* List View */
          <div className="grid grid-cols-1 gap-6">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">Belum ada event yang tersedia</p>
              </div>
            ) : (
              filteredEvents.map((event, index) => (
                <motion.div
                  key={event.event_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                        <p className="text-gray-600 mb-4">{event.description}</p>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{formatDate(event.event_date)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>Dibuat oleh {event.creator_name}</span>
                          </div>
                        </div>
                      </div>

                      {/* Upvote Button */}
                      <button
                        onClick={() => handleUpvote(event.event_id)}
                        className="flex flex-col items-center gap-1 px-4 py-3 bg-green-50 hover:bg-green-100 rounded-lg transition-all duration-300 ml-4"
                      >
                        <TrendingUp className="w-6 h-6 text-green-600" />
                        <span className="text-sm font-bold text-green-600">{event.upvote_count}</span>
                        <span className="text-xs text-gray-600">Upvote</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        ) : (
          /* Calendar View */
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
              >
                ← Prev
              </button>
              
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
              </h2>
              
              <button
                onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
              >
                Next →
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
                <div key={day} className="text-center font-semibold text-gray-600 py-2">
                  {day}
                </div>
              ))}
              
              {getDaysInMonth(selectedDate).map((day, index) => {
                const dayEvents = day ? getEventsForDay(day) : [];
                
                return (
                  <div
                    key={index}
                    className={`min-h-24 p-2 border rounded-lg ${
                      day ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
                    } ${dayEvents.length > 0 ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
                  >
                    {day && (
                      <>
                        <div className="font-semibold text-gray-900 mb-1">{day}</div>
                        {dayEvents.map(event => (
                          <div
                            key={event.event_id}
                            className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded mb-1 truncate"
                            title={event.title}
                          >
                            {event.title}
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Buat Event Baru</h2>
              <p className="text-gray-600 mt-1">Event akan direview oleh admin sebelum dipublikasikan</p>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Judul Event *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Contoh: Beach Cleanup Pantai Indah"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Deskripsikan event Anda..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal & Waktu *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lokasi
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Contoh: Pantai Indah, Jakarta"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex gap-4">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleCreateEvent}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 font-semibold"
              >
                Buat Event
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CommunityEvents;