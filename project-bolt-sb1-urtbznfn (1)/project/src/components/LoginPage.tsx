import React, { useState } from 'react'
import { Lock, User, Heart, Eye, EyeOff, Crown, Users } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
  const [showAdminForm, setShowAdminForm] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [staySignedInCoach, setStaySignedInCoach] = useState(false)
  const [staySignedInAdmin, setStaySignedInAdmin] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login, loginAsGuest } = useAuth()

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    await new Promise(resolve => setTimeout(resolve, 800))

    const success = login(username, password)
    if (!success) {
      setError('Invalid admin credentials! Please check your username and password.')
    } else if (staySignedInAdmin) {
      localStorage.setItem('vsscs_stay_signed_in_admin', 'true')
    }
    setIsLoading(false)
  }

  const handleCoachLogin = () => {
    loginAsGuest()
    if (staySignedInCoach) {
      localStorage.setItem('vsscs_stay_signed_in_coach', 'true')
    }
  }

  const handleJoinAsAdmin = () => {
    setShowAdminForm(true)
    setError('')
  }

  const handleBackToOptions = () => {
    setShowAdminForm(false)
    setUsername('')
    setPassword('')
    setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-50 to-red-100 flex items-center justify-center p-3">
      <div className="max-w-md w-full">
        {/* Compact Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full mb-4 shadow-lg">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Welcome to <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">VSSCS</span>! 🏐
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Your volleyball learning platform! Choose your role:
          </p>
        </div>

        {!showAdminForm ? (
          /* Compact Options */
          <div className="space-y-4">
            {/* Join as Coach - Compact */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-200">
              <div className="bg-gradient-to-r from-orange-400 to-yellow-500 p-4 rounded-t-2xl">
                <div className="flex items-center">
                  <Users className="h-6 w-6 text-white mr-3" />
                  <div>
                    <h2 className="text-lg font-bold text-white">🏐 Join as Coach</h2>
                    <p className="text-white/90 text-sm">Learn volleyball vocabulary & drills</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <div className="space-y-3">
                  <div className="bg-orange-50 rounded-xl p-3 border border-orange-200">
                    <div className="text-sm text-gray-700 space-y-1">
                      <div className="flex items-center">
                        <span className="text-green-500 mr-2">✅</span>
                        <span>50+ volleyball terms</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-500 mr-2">✅</span>
                        <span>Training drill videos</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-500 mr-2">✅</span>
                        <span>Mobile-friendly</span>
                      </div>
                    </div>
                  </div>

                  {/* Stay Signed In - Compact */}
                  <div className="flex items-center bg-orange-50 rounded-lg p-2 border border-orange-200">
                    <input
                      type="checkbox"
                      id="staySignedInCoach"
                      checked={staySignedInCoach}
                      onChange={(e) => setStaySignedInCoach(e.target.checked)}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded mr-2"
                    />
                    <label htmlFor="staySignedInCoach" className="text-sm text-gray-700 font-medium">
                      Stay signed in as Coach
                    </label>
                  </div>

                  <button
                    onClick={handleCoachLogin}
                    className="w-full bg-gradient-to-r from-orange-500 to-yellow-600 text-white py-3 px-4 rounded-xl hover:from-orange-600 hover:to-yellow-700 transition-all font-bold text-sm shadow-lg transform hover:scale-105"
                  >
                    <Users className="h-4 w-4 inline mr-2" />
                    Join as Coach
                  </button>
                </div>
              </div>
            </div>

            {/* Join as Admin - Compact */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-200">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 rounded-t-2xl">
                <div className="flex items-center">
                  <Crown className="h-6 w-6 text-white mr-3" />
                  <div>
                    <h2 className="text-lg font-bold text-white">👑 Join as Admin</h2>
                    <p className="text-white/90 text-sm">Create & manage content</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <div className="space-y-3">
                  <div className="bg-purple-50 rounded-xl p-3 border border-purple-200">
                    <div className="text-sm text-gray-700 space-y-1">
                      <div className="flex items-center">
                        <span className="text-purple-500 mr-2">⭐</span>
                        <span>Add vocabulary</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-purple-500 mr-2">⭐</span>
                        <span>Upload drill videos</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-purple-500 mr-2">⭐</span>
                        <span>Edit all content</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleJoinAsAdmin}
                    className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 px-4 rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all font-bold text-sm shadow-lg transform hover:scale-105"
                  >
                    <Crown className="h-4 w-4 inline mr-2" />
                    Enter Admin Credentials
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Compact Admin Login Form */
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-200">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 rounded-t-2xl">
              <div className="flex items-center">
                <Crown className="h-6 w-6 text-white mr-3" />
                <div>
                  <h2 className="text-lg font-bold text-white">👑 Admin Login</h2>
                  <p className="text-white/90 text-sm">Enter your credentials</p>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-400 outline-none transition-all bg-white/70"
                      placeholder="Admin username"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-400 outline-none transition-all bg-white/70"
                      placeholder="Admin password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Stay Signed In - Compact */}
                <div className="flex items-center bg-purple-50 rounded-lg p-2 border border-purple-200">
                  <input
                    type="checkbox"
                    id="staySignedInAdmin"
                    checked={staySignedInAdmin}
                    onChange={(e) => setStaySignedInAdmin(e.target.checked)}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mr-2"
                  />
                  <label htmlFor="staySignedInAdmin" className="text-sm text-gray-700 font-medium">
                    Stay signed in as Admin
                  </label>
                </div>

                {error && (
                  <div className="bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={handleBackToOptions}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-all font-medium text-sm shadow-lg"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-sm shadow-lg"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                        Signing in...
                      </span>
                    ) : (
                      <>
                        <Crown className="h-4 w-4 inline mr-1" />
                        Login
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Compact Footer */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            🏐 Ready to improve your volleyball skills?
          </p>
        </div>
      </div>
    </div>
  )
}