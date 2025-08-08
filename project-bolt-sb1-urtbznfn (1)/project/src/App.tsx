import React, { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import LoginPage from './components/LoginPage'
import Header from './components/Header'
import Home from './components/Home'
import VocabularyList from './components/VocabularyList'
import VideoList from './components/VideoList'
import AdminPanel from './components/AdminPanel'
import { getVocabulary, getVideodrills, initializeBasicVocabulary, type Vocabulary, type VideoDrill } from './lib/storage'
import { initializeDatabase } from './lib/database'

function AppContent() {
  const { isAuthenticated, isAdmin } = useAuth()
  const [currentView, setCurrentView] = useState<'home' | 'vocabulary' | 'videos' | 'admin'>('home')
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([])
  const [videos, setVideos] = useState<VideoDrill[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dbStatus, setDbStatus] = useState<'connected' | 'local' | 'checking'>('checking')

  const loadData = async () => {
    try {
      const [vocabData, videoData] = await Promise.all([
        getVocabulary(),
        getVideodrills()
      ])
      setVocabulary(vocabData)
      setVideos(videoData)
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  useEffect(() => {
    const initApp = async () => {
      setIsLoading(true)
      
      // Initialize database
      const dbInitialized = await initializeDatabase()
      setDbStatus(dbInitialized ? 'connected' : 'local')
      
      // Initialize basic vocabulary if needed
      await initializeBasicVocabulary()
      
      // Load data
      await loadData()
      setIsLoading(false)
    }

    if (isAuthenticated) {
      initApp()
    }
  }, [isAuthenticated])

  // Redirect non-admin users away from admin panel
  useEffect(() => {
    if (currentView === 'admin' && !isAdmin) {
      setCurrentView('home')
    }
  }, [currentView, isAdmin])

  const handleDataChange = async () => {
    await loadData()
  }

  const handleViewChange = (view: 'home' | 'vocabulary' | 'videos' | 'admin') => {
    // Prevent guests from accessing admin panel
    if (view === 'admin' && !isAdmin) {
      return
    }
    setCurrentView(view)
  }

  if (!isAuthenticated) {
    return <LoginPage />
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading VSSCS...</h2>
          <p className="text-gray-600">Setting up your learning environment! 🚀</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentView={currentView} onViewChange={handleViewChange} />
      
      {/* Database Status Indicator */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-center">
            <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              dbStatus === 'connected' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${
                dbStatus === 'connected' ? 'bg-green-500' : 'bg-yellow-500'
              }`}></div>
              {dbStatus === 'connected' ? '🗄️ Connected to Neon Database' : '💾 Using Local Storage'}
            </div>
          </div>
        </div>
      </div>
      
      {currentView === 'home' && (
        <Home 
          onViewChange={handleViewChange} 
          vocabularyCount={vocabulary.length}
          videoCount={videos.length}
        />
      )}
      
      {currentView === 'vocabulary' && (
        <VocabularyList vocabulary={vocabulary} onDataChange={handleDataChange} />
      )}
      
      {currentView === 'videos' && (
        <VideoList videos={videos} onDataChange={handleDataChange} />
      )}
      
      {currentView === 'admin' && isAdmin && (
        <AdminPanel onDataChange={handleDataChange} />
      )}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App