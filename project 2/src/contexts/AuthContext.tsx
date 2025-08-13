import React, { createContext, useContext, useState, useEffect } from 'react'
import { User, AuthContextType } from '../types/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('vsscs_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error loading saved user:', error)
        localStorage.removeItem('vsscs_user')
      }
    }
  }, [])

  const login = (username: string, password: string): boolean => {
    // Simple admin credentials check
    if (username === 'admin' && password === '1234') {
      const adminUser: User = { username: 'admin', role: 'admin' }
      setUser(adminUser)
      localStorage.setItem('vsscs_user', JSON.stringify(adminUser))
      return true
    }
    return false
  }

  const loginAsGuest = () => {
    const guestUser: User = { username: 'Guest', role: 'guest' }
    setUser(guestUser)
    localStorage.setItem('vsscs_user', JSON.stringify(guestUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('vsscs_user')
  }

  const value: AuthContextType = {
    user,
    login,
    loginAsGuest,
    logout,
    isAuthenticated: user !== null,
    isAdmin: user?.role === 'admin'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}