import React from 'react'
import { BookOpen, Video, TrendingUp, Star, Sparkles, ArrowRight, Users, Trophy } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

interface HomeProps {
  onViewChange: (view: 'vocabulary' | 'videos' | 'admin') => void
  vocabularyCount: number
  videoCount: number
}

export default function Home({ onViewChange, vocabularyCount, videoCount }: HomeProps) {
  const { user, isAdmin } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-8 sm:pt-12 lg:pt-16 pb-12 sm:pb-16 lg:pb-20">
          <div className="text-center">
            {/* Welcome Badge */}
            <div className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2 mb-4 sm:mb-6 shadow-lg border border-blue-100">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 mr-2" />
              <span className="text-xs sm:text-sm font-medium text-gray-700">
                Welcome back, {user?.username}!
              </span>
              {isAdmin && <span className="ml-1 sm:ml-2 text-xs bg-blue-100 text-blue-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">Admin</span>}
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight px-2">
              Master Volleyball with
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                VSSCS
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed px-4">
              Your comprehensive volleyball learning platform. Build your vocabulary, 
              watch training drills, and elevate your game to the next level.
            </p>

            {/* Stats */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 px-4">
              <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 shadow-lg w-full sm:w-auto justify-center">
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-2 sm:mr-3" />
                <span className="text-gray-700 font-medium text-sm sm:text-base">
                  <span className="font-bold text-blue-600">{vocabularyCount}</span> Vocabulary
                </span>
              </div>
              <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 shadow-lg w-full sm:w-auto justify-center">
                <Video className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 mr-2 sm:mr-3" />
                <span className="text-gray-700 font-medium text-sm sm:text-base">
                  <span className="font-bold text-indigo-600">{videoCount}</span> Drills
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Features Section */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pb-12 sm:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          
          {/* Vocabulary Card */}
          <div 
            onClick={() => onViewChange('vocabulary')}
            className="group relative bg-white rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden border border-gray-100 hover:border-blue-200 active:scale-95"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50"></div>
            <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-200/30 to-transparent rounded-full -translate-y-12 translate-x-12 sm:-translate-y-16 sm:translate-x-16"></div>
            
            <div className="relative p-6 sm:p-8 lg:p-10">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl shadow-lg mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>

              {/* Content */}
              <div className="mb-4 sm:mb-6">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors">
                  Vocabulary
                </h3>
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed mb-3 sm:mb-4">
                  Master essential volleyball terminology with our comprehensive vocabulary collection. 
                  Learn definitions, examples, and usage in context.
                </p>
                
                {/* Features */}
                <div className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
                  <div className="flex items-center text-gray-600">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full mr-2 sm:mr-3"></div>
                    <span className="text-xs sm:text-sm">Interactive flashcards</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full mr-2 sm:mr-3"></div>
                    <span className="text-xs sm:text-sm">Practice tests</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full mr-2 sm:mr-3"></div>
                    <span className="text-xs sm:text-sm">Difficulty levels</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-2xl sm:text-3xl font-bold text-blue-600">{vocabularyCount}</span>
                  <span className="text-gray-500 ml-1 sm:ml-2 text-sm sm:text-base">terms</span>
                </div>
                <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform text-sm sm:text-base">
                  <span className="mr-1 sm:mr-2">Explore</span>
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
              </div>
            </div>
          </div>

          {/* Volleyball Drills Card */}
          <div 
            onClick={() => onViewChange('videos')}
            className="group relative bg-white rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden border border-gray-100 hover:border-indigo-200 active:scale-95"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 opacity-50"></div>
            <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-indigo-200/30 to-transparent rounded-full -translate-y-12 translate-x-12 sm:-translate-y-16 sm:translate-x-16"></div>
            
            <div className="relative p-6 sm:p-8 lg:p-10">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl shadow-lg mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <Video className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>

              {/* Content */}
              <div className="mb-4 sm:mb-6">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-indigo-600 transition-colors">
                  Training Drills
                </h3>
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed mb-3 sm:mb-4">
                  Watch professional volleyball training drills and techniques. 
                  Improve your skills with step-by-step video instructions.
                </p>
                
                {/* Features */}
                <div className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
                  <div className="flex items-center text-gray-600">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-indigo-400 rounded-full mr-2 sm:mr-3"></div>
                    <span className="text-xs sm:text-sm">HD video tutorials</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-indigo-400 rounded-full mr-2 sm:mr-3"></div>
                    <span className="text-xs sm:text-sm">Skill categories</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-indigo-400 rounded-full mr-2 sm:mr-3"></div>
                    <span className="text-xs sm:text-sm">Progressive difficulty</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-2xl sm:text-3xl font-bold text-indigo-600">{videoCount}</span>
                  <span className="text-gray-500 ml-1 sm:ml-2 text-sm sm:text-base">drills</span>
                </div>
                <div className="flex items-center text-indigo-600 font-semibold group-hover:translate-x-2 transition-transform text-sm sm:text-base">
                  <span className="mr-1 sm:mr-2">Watch</span>
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Section */}
        {isAdmin && (
          <div className="mt-8 sm:mt-12">
            <div 
              onClick={() => onViewChange('admin')}
              className="group relative bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden active:scale-95"
            >
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              <div className="relative p-6 sm:p-8 lg:p-10 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-3">
                  Admin Dashboard
                </h3>
                <p className="text-white/90 text-sm sm:text-base lg:text-lg leading-relaxed mb-4 sm:mb-6 max-w-2xl mx-auto px-2">
                  Manage content, add new vocabulary terms, upload training drills, and help the community grow.
                </p>
                <div className="flex items-center justify-center text-white font-semibold group-hover:translate-x-2 transition-transform text-sm sm:text-base">
                  <span className="mr-1 sm:mr-2">Manage Content</span>
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Motivational Section */}
        <div className="mt-12 sm:mt-16 lg:mt-20 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-lg border border-gray-100">
            <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-4 sm:mb-6">
              <Star className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
              Ready to Elevate Your Game?
            </h3>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto px-4">
              Every volleyball champion started with learning the basics. 
              Master the vocabulary, practice with our drills, and watch your skills soar.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center mb-4 sm:mb-0">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg mr-2 sm:mr-3"></div>
              <span className="text-lg sm:text-xl font-bold text-gray-900">VSSCS</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm text-gray-600 text-center">
              <span className="hidden sm:inline">Volleyball Skills & Study Companion System</span>
              <span className="sm:hidden">Volleyball Learning Platform</span>
              <a href="#contact" className="hover:text-blue-600 transition-colors font-medium">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}