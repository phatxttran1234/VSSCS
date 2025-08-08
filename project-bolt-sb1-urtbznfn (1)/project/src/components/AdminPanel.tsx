import React, { useState } from 'react'
import { Plus, BookOpen, Video, Save, X, Sparkles, Heart, Upload, Smartphone, Laptop, Link, FileVideo, AlertTriangle } from 'lucide-react'
import { addVocabulary, addVideoDrill } from '../lib/storage'

interface AdminPanelProps {
  onDataChange: () => void
}

export default function AdminPanel({ onDataChange }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'vocabulary' | 'video'>('video') // Default to video for drill posting
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [videoInputType, setVideoInputType] = useState<'link' | 'file'>('link')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Vocabulary form state
  const [vocabForm, setVocabForm] = useState({
    word: '',
    definition: '',
    example: '',
    difficulty: 'medium'
  })

  // Video form state
  const [videoForm, setVideoForm] = useState({
    title: '',
    description: '',
    video_url: '',
    tags: ''
  })

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check if it's a video file
      if (file.type.startsWith('video/')) {
        setSelectedFile(file)
        // Create a temporary URL for the video file
        const fileUrl = URL.createObjectURL(file)
        setVideoForm({ ...videoForm, video_url: fileUrl })
      } else {
        showMessage('error', 'Please select a video file (MP4, MOV, AVI, etc.)')
      }
    }
  }

  const handleVocabSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await addVocabulary(vocabForm)
      setVocabForm({ word: '', definition: '', example: '', difficulty: 'medium' })
      showMessage('success', '🎉 Amazing! Your volleyball vocabulary has been added successfully!')
      await onDataChange()
    } catch (error) {
      showMessage('error', '😅 Oops! Something went wrong. Let\'s try that again!')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Check if using file upload
      if (videoInputType === 'file' && selectedFile) {
        showMessage('error', '⚠️ Video files can only be watched on your device! Use YouTube/Vimeo links so your friends can watch too! 📱')
        setIsSubmitting(false)
        return
      }

      await addVideoDrill(videoForm)
      setVideoForm({ title: '', description: '', video_url: '', tags: '' })
      setSelectedFile(null)
      showMessage('success', '🏐 Fantastic! Your volleyball drill has been posted successfully!')
      await onDataChange()
    } catch (error) {
      showMessage('error', '😅 Oops! Something went wrong. Let\'s try that again!')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetVideoInput = () => {
    setVideoForm({ ...videoForm, video_url: '' })
    setSelectedFile(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Mobile-Friendly Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mb-4 sm:mb-6 shadow-lg">
            <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 sm:mb-4">
            📱 Post Your Volleyball Content!
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Share amazing volleyball drills and vocabulary from your iPhone, laptop, or any device! 🏐
          </p>
          
          {/* Device Icons */}
          <div className="flex justify-center items-center space-x-6 mt-4">
            <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
              <Smartphone className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">iPhone Ready</span>
            </div>
            <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
              <Laptop className="h-5 w-5 text-purple-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Laptop Ready</span>
            </div>
          </div>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className={`mb-6 sm:mb-8 p-4 sm:p-6 rounded-2xl sm:rounded-3xl flex items-center justify-between shadow-lg border-2 ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-800 border-green-200' 
              : 'bg-red-100 text-red-800 border-red-200'
          }`}>
            <div className="flex items-center">
              {message.type === 'success' ? (
                <Heart className="h-5 w-5 sm:h-6 sm:w-6 mr-3" />
              ) : (
                <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 mr-3" />
              )}
              <span className="text-base sm:text-lg font-medium">{message.text}</span>
            </div>
            <button onClick={() => setMessage(null)} className="ml-4 hover:scale-110 transition-transform">
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        )}

        {/* Mobile-Optimized Tabs */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-gray-100 overflow-hidden">
          <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('video')}
                className={`flex-1 py-4 sm:py-6 px-4 sm:px-8 text-center font-bold transition-all duration-300 text-sm sm:text-base ${
                  activeTab === 'video'
                    ? 'bg-white text-purple-600 border-b-4 border-purple-500 shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-white/50'
                }`}
              >
                <Video className="h-5 w-5 sm:h-6 sm:w-6 inline mr-2 sm:mr-3" />
                🏐 Post Drill
              </button>
              <button
                onClick={() => setActiveTab('vocabulary')}
                className={`flex-1 py-4 sm:py-6 px-4 sm:px-8 text-center font-bold transition-all duration-300 text-sm sm:text-base ${
                  activeTab === 'vocabulary'
                    ? 'bg-white text-blue-600 border-b-4 border-blue-500 shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-white/50'
                }`}
              >
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 inline mr-2 sm:mr-3" />
                🏐 Add Vocab
              </button>
            </nav>
          </div>

          <div className="p-6 sm:p-10">
            {activeTab === 'video' && (
              <form onSubmit={handleVideoSubmit} className="space-y-6 sm:space-y-8">
                <div className="text-center mb-6 sm:mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">🏐 Share Your Volleyball Drill!</h2>
                  <p className="text-gray-600 text-base sm:text-lg">Post from your phone or laptop - use video links so your friends can watch too! 📱💻</p>
                </div>

                <div>
                  <label className="block text-base sm:text-lg font-bold text-gray-700 mb-3">
                    🏐 Drill Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={videoForm.title}
                    onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-purple-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-purple-300 focus:border-purple-400 outline-none transition-all text-base sm:text-lg bg-white/70"
                    placeholder="What's your drill called?"
                  />
                </div>

                <div>
                  <label className="block text-base sm:text-lg font-bold text-gray-700 mb-3">
                    📖 Drill Description *
                  </label>
                  <textarea
                    required
                    value={videoForm.description}
                    onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-purple-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-purple-300 focus:border-purple-400 outline-none transition-all text-base sm:text-lg bg-white/70"
                    rows={4}
                    placeholder="What will players learn from this drill?"
                  />
                </div>

                {/* Video Input Type Selector */}
                <div>
                  <label className="block text-base sm:text-lg font-bold text-gray-700 mb-4">
                    🎥 How do you want to add your video? *
                  </label>
                  
                  {/* Important Notice */}
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-blue-800 mb-2">📱 Important: For Friends to Watch</h4>
                        <p className="text-blue-700 text-sm leading-relaxed">
                          <strong>Use video links (YouTube, Vimeo)</strong> so your friends can watch from their devices! 
                          Video files uploaded from your device can only be watched on your device.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <button
                      type="button"
                      onClick={() => {
                        setVideoInputType('link')
                        resetVideoInput()
                      }}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        videoInputType === 'link'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white hover:border-blue-300'
                      }`}
                    >
                      <Link className="h-6 w-6 mx-auto mb-2" />
                      <div className="font-semibold">📱 Video Link (Recommended)</div>
                      <div className="text-sm text-gray-600">YouTube, Vimeo - Friends can watch!</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setVideoInputType('file')
                        resetVideoInput()
                      }}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        videoInputType === 'file'
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-gray-200 bg-white hover:border-orange-300'
                      }`}
                    >
                      <FileVideo className="h-6 w-6 mx-auto mb-2" />
                      <div className="font-semibold">💻 Upload File (Local Only)</div>
                      <div className="text-sm text-gray-600">Only you can watch</div>
                    </button>
                  </div>

                  {/* Video Link Input */}
                  {videoInputType === 'link' && (
                    <div>
                      <input
                        type="url"
                        required
                        value={videoForm.video_url}
                        onChange={(e) => setVideoForm({ ...videoForm, video_url: e.target.value })}
                        className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-blue-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 outline-none transition-all text-base sm:text-lg bg-white/70"
                        placeholder="Paste your video link here..."
                      />
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-700">
                          <strong>✅ Perfect!</strong> Your friends will be able to watch this video from any device!
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Video File Upload */}
                  {videoInputType === 'file' && (
                    <div>
                      <div className="relative">
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleFileSelect}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className={`w-full px-4 sm:px-6 py-6 sm:py-8 border-2 border-dashed rounded-xl sm:rounded-2xl transition-all text-center ${
                          selectedFile 
                            ? 'border-green-400 bg-green-50' 
                            : 'border-orange-300 bg-orange-50 hover:border-orange-400 hover:bg-orange-100'
                        }`}>
                          {selectedFile ? (
                            <div>
                              <FileVideo className="h-8 w-8 text-green-600 mx-auto mb-2" />
                              <p className="text-green-700 font-semibold">{selectedFile.name}</p>
                              <p className="text-sm text-green-600">File selected!</p>
                            </div>
                          ) : (
                            <div>
                              <Upload className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                              <p className="text-orange-700 font-semibold">Tap to select video file</p>
                              <p className="text-sm text-orange-600">MP4, MOV, AVI, and more</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <p className="text-sm text-orange-700">
                          <strong>⚠️ Note:</strong> Video files can only be watched on your device. Your friends won't be able to see this video.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-base sm:text-lg font-bold text-gray-700 mb-3">
                    🏷️ Drill Tags (Optional)
                  </label>
                  <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700 mb-2">
                      <strong>💡 Suggested tags:</strong> serving, passing, setting, spiking, blocking, agility, beginner, intermediate, advanced
                    </p>
                    <p className="text-xs text-blue-600">
                      Separate multiple tags with commas (e.g., "serving, beginner, agility")
                    </p>
                  </div>
                  <input
                    type="text"
                    value={videoForm.tags}
                    onChange={(e) => setVideoForm({ ...videoForm, tags: e.target.value })}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-green-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-green-300 focus:border-green-400 outline-none transition-all text-base sm:text-lg bg-white/70"
                    placeholder="serving, beginner, agility..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !videoForm.video_url}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-4 sm:py-5 px-6 sm:px-8 rounded-xl sm:rounded-2xl hover:from-purple-600 hover:to-pink-700 focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-white mr-3"></div>
                      Posting your drill...
                    </span>
                  ) : (
                    <>
                      <Upload className="h-5 w-5 sm:h-6 sm:w-6 inline mr-3" />
                      🎉 Post This Drill!
                    </>
                  )}
                </button>
              </form>
            )}

            {activeTab === 'vocabulary' && (
              <form onSubmit={handleVocabSubmit} className="space-y-6 sm:space-y-8">
                <div className="text-center mb-6 sm:mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">🏐 Add Volleyball Vocabulary!</h2>
                  <p className="text-gray-600 text-base sm:text-lg">Share volleyball knowledge from anywhere! 📚</p>
                </div>

                <div>
                  <label className="block text-base sm:text-lg font-bold text-gray-700 mb-3">
                    ✨ Volleyball Term *
                  </label>
                  <input
                    type="text"
                    required
                    value={vocabForm.word}
                    onChange={(e) => setVocabForm({ ...vocabForm, word: e.target.value })}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-blue-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 outline-none transition-all text-base sm:text-lg bg-white/70"
                    placeholder="Enter the volleyball term..."
                  />
                </div>

                <div>
                  <label className="block text-base sm:text-lg font-bold text-gray-700 mb-3">
                    💡 Definition *
                  </label>
                  <textarea
                    required
                    value={vocabForm.definition}
                    onChange={(e) => setVocabForm({ ...vocabForm, definition: e.target.value })}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-blue-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 outline-none transition-all text-base sm:text-lg bg-white/70"
                    rows={4}
                    placeholder="Explain what this volleyball term means..."
                  />
                </div>

                <div>
                  <label className="block text-base sm:text-lg font-bold text-gray-700 mb-3">
                    🏐 Example (Optional)
                  </label>
                  <textarea
                    value={vocabForm.example}
                    onChange={(e) => setVocabForm({ ...vocabForm, example: e.target.value })}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-green-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-green-300 focus:border-green-400 outline-none transition-all text-base sm:text-lg bg-white/70"
                    rows={3}
                    placeholder="Show how it's used in volleyball..."
                  />
                </div>

                <div>
                  <label className="block text-base sm:text-lg font-bold text-gray-700 mb-3">
                    🎯 Difficulty Level
                  </label>
                  <select
                    value={vocabForm.difficulty}
                    onChange={(e) => setVocabForm({ ...vocabForm, difficulty: e.target.value })}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-purple-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-purple-300 focus:border-purple-400 outline-none transition-all text-base sm:text-lg bg-white/70 font-medium"
                  >
                    <option value="easy">🌱 Basic</option>
                    <option value="medium">⭐ For Coaching</option>
                    <option value="hard">🔥 Important</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 sm:py-5 px-6 sm:px-8 rounded-xl sm:rounded-2xl hover:from-blue-600 hover:to-purple-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-white mr-3"></div>
                      Adding vocabulary...
                    </span>
                  ) : (
                    <>
                      <Save className="h-5 w-5 sm:h-6 sm:w-6 inline mr-3" />
                      🎉 Add This Term!
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Mobile-Friendly Footer */}
        <div className="mt-8 sm:mt-12 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border-2 border-yellow-200">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">📱 Share With Friends!</h3>
            <p className="text-base sm:text-lg text-gray-600 mb-4">Use YouTube or Vimeo links so your friends can watch your drills from any device! 💝</p>
            <div className="flex justify-center space-x-4">
              <span className="text-xl sm:text-2xl">🏐</span>
              <span className="text-xl sm:text-2xl">📱</span>
              <span className="text-xl sm:text-2xl">💻</span>
              <span className="text-xl sm:text-2xl">🔗</span>
              <span className="text-xl sm:text-2xl">⭐</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}