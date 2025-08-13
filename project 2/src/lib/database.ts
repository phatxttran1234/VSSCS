import { neon } from '@neondatabase/serverless'

// Get database URL from environment variables
const getDatabaseUrl = () => {
  const url = import.meta.env.VITE_DATABASE_URL
  if (!url) {
    console.warn('Database URL not found. Using local storage as fallback.')
    return null
  }
  return url
}

// Initialize database connection
const sql = getDatabaseUrl() ? neon(getDatabaseUrl()!) : null

// Database initialization
export const initializeDatabase = async () => {
  if (!sql) {
    console.log('No database connection. Using local storage.')
    return false
  }

  try {
    // Create vocabulary table
    await sql`
      CREATE TABLE IF NOT EXISTS vocabulary (
        id TEXT PRIMARY KEY,
        word TEXT NOT NULL,
        definition TEXT NOT NULL,
        example TEXT,
        difficulty TEXT DEFAULT 'medium',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create video_drills table
    await sql`
      CREATE TABLE IF NOT EXISTS video_drills (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        video_url TEXT NOT NULL,
        tags TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    console.log('✅ Database tables initialized successfully!')
    return true
  } catch (error) {
    console.error('❌ Database initialization failed:', error)
    return false
  }
}

// Check if database is connected
export const isDatabaseConnected = () => {
  return sql !== null
}

// Export the sql instance for use in other files
export { sql }