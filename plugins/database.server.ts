import { initDatabase } from '../lib/database'

export default defineNitroPlugin(async () => {
  try {
    console.log('Initializing database...')
    await initDatabase()
    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Failed to initialize database:', error)
  }
})
