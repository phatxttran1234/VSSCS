import React, { useState } from 'react'
import { Search, Video, Clock, Tag, Play, Heart, Trash2, X, ExternalLink, Edit3, Save } from 'lucide-react'
import { VideoDrill, deleteVideoDrill, updateVideoDrill } from '../lib/storage'
import { useAuth } from '../contexts/AuthContext'

interface VideoListProps {
  videos: VideoDrill[]
  onDataChange: () => void
}

export default function VideoList({ videos, onDataChange }: VideoListProps) {
  const { isAdmin } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [playingVideo, setPlayingVideo] = useState<VideoDrill | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<VideoDrill | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const filteredVideos = videos.filter(video => 
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (video.tags && video.tags.toLowerCase().includes(searchTerm.toLowerCase()))
  )
  .filter(video => {
    if (selectedTag === 'all') return true
    return video.tags && video.tags.toLowerCase().includes(selectedTag.toLowerCase())
  })

  const handleDelete = async (id: string, title: string) => {
    if (!isAdmin) {
      alert('Only admins can delete video drills! 👑')
      return
    }

    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return
    }

    setDeletingId(id)
    try {
      await deleteVideoDrill(id)
      await onDataChange()
    } catch (error) {
      console.error('Error deleting video:', error)
      alert('Failed to delete the drill. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  const startEditing = (video: VideoDrill) => {
    if (!isAdmin) {
      alert('Only admins can edit video drills! 👑')
      return
    }
    setEditingId(video.id)
    setEditForm({ ...video })
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditForm(null)
  }

  const saveEdit = async () => {
    if (!editForm || !editingId) return

    setIsUpdating(true)
    try {
      await updateVideoDrill(editingId, {
        title: editForm.title,
        description: editForm.description,
        video_url: editForm.video_url,
        tags: editForm.tags
      })
      
      cancelEditing()
      await onDataChange()
    } catch (error) {
      console.error('Error updating video drill:', error)
      alert('Failed to update video drill. Please try again.')
    } finally {
      setIsUpdating(false)
    }
  }

  const getVideoThumbnail = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1]
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    }
    return 'https://images.pexels.com/photos/1709003/pexels-photo-1709003.jpeg?auto=compress&cs=tinysrgb&w=800'
  }

  const isYouTubeVideo = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be')
  }

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1]
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url
  }

  const getTagColor = (tag: string) => {
    const tagLower = tag.toLowerCase().trim()
    switch (tagLower) {
      case 'serving': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'passing': return 'bg-green-100 text-green-700 border-green-200'
      case 'setting': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'spiking': return 'bg-red-100 text-red-700 border-red-200'
      case 'blocking': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'agility': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'beginner': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      case 'intermediate': return 'bg-indigo-100 text-indigo-700 border-indigo-200'
      case 'advanced': return 'bg-pink-100 text-pink-700 border-pink-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getTagEmoji = (tag: string) => {
    const tagLower = tag.toLowerCase().trim()
    switch (tagLower) {
      case 'serving': return '🏐'
      case 'passing': return '🤝'
      case 'setting': return '🎯'
      case 'spiking': return '⚡'
      case 'blocking': return '🛡️'
      case 'agility': return '🏃'
      case 'beginner': return '🌱'
      case 'intermediate': return '⭐'
      case 'advanced': return '🔥'
      default: return '🏷️'
    }
  }

  const isVideoFile = (url: string) => {
    return url.startsWith('blob:') || url.match(/\.(mp4|mov|avi|webm|mkv)$/i)
  }

  const handlePlayVideo = (video: VideoDrill) => {
    setPlayingVideo(video)
  }

  const closeVideoPlayer = () => {
    setPlayingVideo(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Compact Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mb-3 sm:mb-4 lg:mb-6 shadow-lg">
            <Video className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-800 mb-2 sm:mb-3 lg:mb-4">
            🏐 Volleyball Training Drills!
          </h1>
          <p className="text-sm sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-2">
            Get ready for some amazing volleyball training! These drills will make you smile while you improve your skills! 🌟
          </p>
        </div>

        {/* Compact Search */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 lg:p-8 border-2 border-purple-200">
            <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:gap-4 lg:gap-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-purple-400" />
                  <input
                    type="text"
                    placeholder="🏐 Find your perfect volleyball drill..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 sm:pl-12 lg:pl-14 pr-4 sm:pr-6 py-3 sm:py-4 border-2 border-purple-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-purple-300 focus:border-purple-400 outline-none transition-all text-sm sm:text-base lg:text-lg bg-white/70"
                  />
                </div>
              </div>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="px-4 sm:px-6 py-3 sm:py-4 border-2 border-purple-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-purple-300 focus:border-purple-400 outline-none transition-all text-sm sm:text-base lg:text-lg bg-white/70 font-medium"
              >
                <option value="all">🌈 All Drills</option>
                <option value="serving">🏐 Serving</option>
                <option value="passing">🤝 Passing</option>
                <option value="setting">🎯 Setting</option>
                <option value="spiking">⚡ Spiking</option>
                <option value="blocking">🛡️ Blocking</option>
                <option value="agility">🏃 Agility</option>
                <option value="beginner">🌱 Beginner</option>
                <option value="intermediate">⭐ Intermediate</option>
                <option value="advanced">🔥 Advanced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Compact Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {filteredVideos.map((video, index) => (
            <div
              key={video.id}
              className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 overflow-hidden group hover:scale-105 transform relative"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Edit Button - Only show for admins */}
              {isAdmin && editingId !== video.id && (
                <button
                  onClick={() => startEditing(video)}
                  className="absolute top-2 sm:top-3 lg:top-4 left-2 sm:left-3 lg:left-4 z-10 bg-green-500 hover:bg-green-600 text-white p-1.5 sm:p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110"
                  title={`Edit "${video.title}"`}
                >
                  <Edit3 className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              )}

              {/* Delete Button - Only show for admins */}
              {isAdmin && editingId !== video.id && (
                <button
                  onClick={() => handleDelete(video.id, video.title)}
                  disabled={deletingId === video.id}
                  className="absolute top-2 sm:top-3 lg:top-4 right-2 sm:right-3 lg:right-4 z-10 bg-red-500 hover:bg-red-600 text-white p-1.5 sm:p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                  title={`Delete "${video.title}"`}
                >
                  {deletingId === video.id ? (
                    <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>
                  ) : (
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  )}
                </button>
              )}

              {editingId === video.id ? (
                // Edit Mode - Compact
                <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <input
                    type="text"
                    value={editForm?.title || ''}
                    onChange={(e) => setEditForm(prev => prev ? { ...prev, title: e.target.value } : null)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-purple-300 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-purple-300 focus:border-purple-400 outline-none font-bold text-sm sm:text-base lg:text-lg"
                    placeholder="Drill title"
                  />
                  <textarea
                    value={editForm?.description || ''}
                    onChange={(e) => setEditForm(prev => prev ? { ...prev, description: e.target.value } : null)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-purple-300 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-purple-300 focus:border-purple-400 outline-none text-sm sm:text-base"
                    rows={3}
                    placeholder="Description"
                  />
                  <input
                    type="url"
                    value={editForm?.video_url || ''}
                    onChange={(e) => setEditForm(prev => prev ? { ...prev, video_url: e.target.value } : null)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-purple-300 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-purple-300 focus:border-purple-400 outline-none text-sm sm:text-base"
                    placeholder="Video URL"
                  />
                  <input
                    type="text"
                    value={editForm?.tags || ''}
                    onChange={(e) => setEditForm(prev => prev ? { ...prev, tags: e.target.value } : null)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-green-300 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-green-300 focus:border-green-400 outline-none text-sm sm:text-base"
                    placeholder="Tags (comma separated)"
                  />
                  <div className="flex space-x-2 sm:space-x-3">
                    <button
                      onClick={saveEdit}
                      disabled={isUpdating}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl transition-colors flex items-center justify-center font-medium text-sm sm:text-base"
                    >
                      {isUpdating ? (
                        <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white mr-1 sm:mr-2"></div>
                      ) : (
                        <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      )}
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl transition-colors flex items-center justify-center font-medium text-sm sm:text-base"
                    >
                      <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // Display Mode - Compact
                <>
                  <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 relative overflow-hidden">
                    <img
                      src={getVideoThumbnail(video.video_url)}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                      <button
                        onClick={() => handlePlayVideo(video)}
                        className="bg-white/95 hover:bg-white text-purple-600 p-3 sm:p-4 lg:p-6 rounded-full transform scale-0 group-hover:scale-100 transition-all duration-300 shadow-2xl hover:shadow-purple-300/50"
                      >
                        <Play className="h-4 w-4 sm:h-6 sm:w-6 lg:h-8 lg:w-8 ml-1" />
                      </button>
                    </div>
                    <div className="absolute top-2 sm:top-3 lg:top-4 left-2 sm:left-3 lg:left-4 bg-white/90 backdrop-blur-sm rounded-full p-1.5 sm:p-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <Heart className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-pink-500" />
                    </div>
                  </div>
                  
                  <div className="p-4 sm:p-6 lg:p-8">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors mb-2 sm:mb-3 lg:mb-4 pr-4 sm:pr-6 lg:pr-8">
                      {video.title}
                    </h3>
                    
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 mb-3 sm:mb-4 lg:mb-6 border border-purple-100">
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        {video.description}
                      </p>
                    </div>
                    
                    {video.tags && (
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4 lg:mb-6">
                        {video.tags.split(',').map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className={`inline-flex items-center px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-semibold rounded-full border-2 ${getTagColor(tag)}`}
                          >
                            <span className="mr-1">{getTagEmoji(tag)}</span>
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-xs sm:text-sm text-gray-500">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        {new Date(video.created_at).toLocaleDateString()}
                      </div>
                      
                      <button
                        onClick={() => handlePlayVideo(video)}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 text-xs sm:text-sm font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        🏐 Watch Now!
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-8 sm:py-12 lg:py-16">
            <div className="text-4xl sm:text-6xl lg:text-8xl mb-3 sm:mb-4 lg:mb-6">🏐</div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-600 mb-2 sm:mb-3 lg:mb-4">No volleyball drills found yet!</h3>
            <p className="text-sm sm:text-lg lg:text-xl text-gray-500 mb-4 sm:mb-6 lg:mb-8 px-2">
              {searchTerm ? 'Try different search terms - your perfect volleyball drill is waiting! 🔍' : 'Ready to add your first amazing volleyball drill? Let\'s create something awesome! 🚀'}
            </p>
            <div className="flex justify-center space-x-2 sm:space-x-3 lg:space-x-4">
              <span className="text-lg sm:text-xl lg:text-2xl">🏐</span>
              <span className="text-lg sm:text-xl lg:text-2xl">🌟</span>
              <span className="text-lg sm:text-xl lg:text-2xl">🎉</span>
            </div>
          </div>
        )}

        {/* Video Player Modal - Mobile Optimized */}
        {playingVideo && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-6xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
              {/* Modal Header - Compact */}
              <div className="flex items-center justify-between p-3 sm:p-4 lg:p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex-1 pr-2 sm:pr-4">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-1">{playingVideo.title}</h2>
                  <p className="text-gray-600 text-sm sm:text-base">🏐 Volleyball Training Drill</p>
                </div>
                <button
                  onClick={closeVideoPlayer}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 sm:p-3 rounded-full transition-all duration-300 transform hover:scale-110"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                </button>
              </div>

              {/* Video Player - Mobile Optimized */}
              <div className="p-3 sm:p-4 lg:p-6">
                <div className="aspect-video bg-black rounded-xl sm:rounded-2xl overflow-hidden mb-3 sm:mb-4 lg:mb-6">
                  {isYouTubeVideo(playingVideo.video_url) ? (
                    <iframe
                      src={getYouTubeEmbedUrl(playingVideo.video_url)}
                      title={playingVideo.title}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : isVideoFile(playingVideo.video_url) ? (
                    <video
                      src={playingVideo.video_url}
                      controls
                      className="w-full h-full"
                      preload="metadata"
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <div className="text-center">
                        <Video className="h-8 w-8 sm:h-12 sm:w-12 lg:h-16 lg:w-16 text-gray-400 mx-auto mb-2 sm:mb-4" />
                        <p className="text-gray-600 mb-2 sm:mb-4 text-sm sm:text-base">Video format not supported for inline playback</p>
                        <a
                          href={playingVideo.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center bg-purple-500 hover:bg-purple-600 text-white px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-full transition-all duration-300 text-sm sm:text-base"
                        >
                          <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 mr-1 sm:mr-2" />
                          Open Video Link
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Video Details - Compact */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 mb-2 sm:mb-3 lg:mb-4">
                  <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2 sm:mb-3">📖 About This Drill</h3>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{playingVideo.description}</p>
                </div>

                {/* Tags - Compact */}
                {playingVideo.tags && (
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3 lg:mb-4">
                    {playingVideo.tags.split(',').map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className={`inline-flex items-center px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-semibold rounded-full border-2 ${getTagColor(tag)}`}
                      >
                        <span className="mr-1">{getTagEmoji(tag)}</span>
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer - Compact */}
                <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 pt-2 sm:pt-3 lg:pt-4 border-t border-gray-200">
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Added {new Date(playingVideo.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-pink-500 mr-1" />
                    <span>Volleyball Training</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}