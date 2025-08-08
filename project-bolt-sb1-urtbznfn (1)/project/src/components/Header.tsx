import React, { useState } from 'react'
import { BookOpen, Video, Plus, Heart, LogOut, User, Menu, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

interface HeaderProps {
  currentView: 'home' | 'vocabulary' | 'videos' | 'admin'
  onViewChange: (view: 'home' | 'vocabulary' | 'videos' | 'admin') => void
}

export default function Header({ currentView, onViewChange }: HeaderProps) {
  const { user, logout, isAdmin } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleViewChange = (view: 'home' | 'vocabulary' | 'videos' | 'admin') => {
    onViewChange(view)
    setIsMobileMenuOpen(false) // Close mobile menu after selection
  }

  const handleLogout = () => {
    logout()
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="bg-gradient-to-r from-orange-400 via-pink-400 to-purple-500 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo - Compact for mobile */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-1.5 sm:p-2 mr-2 sm:mr-3">
                <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div>
                <span className="text-xl sm:text-3xl font-bold text-white drop-shadow-lg">
                  VSSCS
                </span>
                <p className="text-white/80 text-xs sm:text-sm font-medium hidden sm:block">Learn with Joy!</p>
              </div>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            <button
              onClick={() => onViewChange('home')}
              className={`px-4 xl:px-6 py-2 xl:py-3 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                currentView === 'home'
                  ? 'bg-white text-orange-500 shadow-lg'
                  : 'text-white hover:bg-white/20 backdrop-blur-sm'
              }`}
            >
              🏠 Home
            </button>
            <button
              onClick={() => onViewChange('vocabulary')}
              className={`px-4 xl:px-6 py-2 xl:py-3 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                currentView === 'vocabulary'
                  ? 'bg-white text-pink-500 shadow-lg'
                  : 'text-white hover:bg-white/20 backdrop-blur-sm'
              }`}
            >
              <BookOpen className="h-4 w-4 inline mr-1 xl:mr-2" />
              🏐 Vocab
            </button>
            <button
              onClick={() => onViewChange('videos')}
              className={`px-4 xl:px-6 py-2 xl:py-3 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                currentView === 'videos'
                  ? 'bg-white text-purple-500 shadow-lg'
                  : 'text-white hover:bg-white/20 backdrop-blur-sm'
              }`}
            >
              <Video className="h-4 w-4 inline mr-1 xl:mr-2" />
              🏐 Drills
            </button>
            
            {/* Admin-only button */}
            {isAdmin && (
              <button
                onClick={() => onViewChange('admin')}
                className={`px-4 xl:px-6 py-2 xl:py-3 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                  currentView === 'admin'
                    ? 'bg-white text-green-500 shadow-lg'
                    : 'text-white hover:bg-white/20 backdrop-blur-sm'
                }`}
              >
                <Plus className="h-4 w-4 inline mr-1 xl:mr-2" />
                ✨ Add Content
              </button>
            )}

            {/* User info and logout */}
            <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-white/30">
              <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 xl:px-4 py-2">
                <User className="h-4 w-4 text-white mr-2" />
                <span className="text-white text-sm font-medium">
                  {user?.username} {user?.role === 'admin' ? '👑' : '🌟'}
                </span>
              </div>
              <button
                onClick={logout}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 transform hover:scale-105"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </nav>

          {/* Mobile User Info & Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            {/* Compact User Info */}
            <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
              <User className="h-3 w-3 text-white mr-1" />
              <span className="text-white text-xs font-medium">
                {user?.username} {user?.role === 'admin' ? '👑' : '🌟'}
              </span>
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/10 backdrop-blur-sm rounded-b-2xl border-t border-white/20">
              <button
                onClick={() => handleViewChange('home')}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  currentView === 'home'
                    ? 'bg-white text-orange-500 shadow-lg'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                🏠 Home
              </button>
              <button
                onClick={() => handleViewChange('vocabulary')}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  currentView === 'vocabulary'
                    ? 'bg-white text-pink-500 shadow-lg'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <BookOpen className="h-4 w-4 inline mr-2" />
                🏐 Vocabulary
              </button>
              <button
                onClick={() => handleViewChange('videos')}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  currentView === 'videos'
                    ? 'bg-white text-purple-500 shadow-lg'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <Video className="h-4 w-4 inline mr-2" />
                🏐 Training Drills
              </button>
              
              {/* Admin-only button */}
              {isAdmin && (
                <button
                  onClick={() => handleViewChange('admin')}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    currentView === 'admin'
                      ? 'bg-white text-green-500 shadow-lg'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <Plus className="h-4 w-4 inline mr-2" />
                  ✨ Add Content
                </button>
              )}

              {/* Mobile Logout Button */}
              <div className="pt-2 border-t border-white/20">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-white hover:bg-red-500/20 transition-all duration-300 flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  🚪 Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}