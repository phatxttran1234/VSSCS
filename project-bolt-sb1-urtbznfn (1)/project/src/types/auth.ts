export interface User {
  username: string
  role: 'admin' | 'guest'
}

export interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => boolean
  loginAsGuest: () => void
  logout: () => void
  isAuthenticated: boolean
  isAdmin: boolean
}