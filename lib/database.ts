import { promises as fs } from 'fs'
import { join } from 'path'
import type { User, Memo } from '~/types'

interface DatabaseSchema {
  users: User[]
  memos: Memo[]
  lastId: {
    users: number
    memos: number
  }
}

class FileDatabase {
  private dbPath: string
  private data: DatabaseSchema

  constructor() {
    this.dbPath = join(process.cwd(), 'data', 'database.json')
    this.data = {
      users: [],
      memos: [],
      lastId: { users: 0, memos: 0 }
    }
  }

  async init() {
    try {
      // 确保data目录存在
      const dataDir = join(process.cwd(), 'data')
      await fs.mkdir(dataDir, { recursive: true })

      // 检查数据库文件是否存在
      try {
        const fileContent = await fs.readFile(this.dbPath, 'utf-8')
        this.data = JSON.parse(fileContent)
        console.log('Database loaded from file')
      } catch (error) {
        // 文件不存在，创建初始数据
        await this.save()
        console.log('Database initialized with empty data')
      }
    } catch (error) {
      console.error('Failed to initialize database:', error)
      throw error
    }
  }

  private async save() {
    try {
      await fs.writeFile(this.dbPath, JSON.stringify(this.data, null, 2), 'utf-8')
    } catch (error) {
      console.error('Failed to save database:', error)
      throw error
    }
  }

  // User operations
  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
    const user: User = {
      id: ++this.data.lastId.users,
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    this.data.users.push(user)
    await this.save()
    return user
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.data.users.find(user => user.email === email) || null
  }

  async getUserById(id: number): Promise<User | null> {
    return this.data.users.find(user => user.id === id) || null
  }

  async updateUser(id: number, updates: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | null> {
    const userIndex = this.data.users.findIndex(user => user.id === id)
    if (userIndex === -1) return null

    this.data.users[userIndex] = {
      ...this.data.users[userIndex],
      ...updates,
      updatedAt: new Date()
    }
    
    await this.save()
    return this.data.users[userIndex]
  }

  // Memo operations
  async createMemo(memoData: Omit<Memo, 'id' | 'createdAt' | 'updatedAt'>): Promise<Memo> {
    const memo: Memo = {
      id: ++this.data.lastId.memos,
      ...memoData,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    this.data.memos.push(memo)
    await this.save()
    return memo
  }

  async getMemosByUserId(userId: number, limit = 20, offset = 0): Promise<Memo[]> {
    const userMemos = this.data.memos
      .filter(memo => memo.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(offset, offset + limit)
    
    return userMemos
  }

  async getMemoById(id: number, userId: number): Promise<Memo | null> {
    return this.data.memos.find(memo => memo.id === id && memo.userId === userId) || null
  }

  async updateMemo(id: number, userId: number, updates: Partial<Omit<Memo, 'id' | 'userId' | 'createdAt'>>): Promise<Memo | null> {
    const memoIndex = this.data.memos.findIndex(memo => memo.id === id && memo.userId === userId)
    if (memoIndex === -1) return null

    this.data.memos[memoIndex] = {
      ...this.data.memos[memoIndex],
      ...updates,
      updatedAt: new Date()
    }
    
    await this.save()
    return this.data.memos[memoIndex]
  }

  async deleteMemo(id: number, userId: number): Promise<boolean> {
    const memoIndex = this.data.memos.findIndex(memo => memo.id === id && memo.userId === userId)
    if (memoIndex === -1) return false

    this.data.memos.splice(memoIndex, 1)
    await this.save()
    return true
  }

  async searchMemos(userId: number, query: string, limit = 20): Promise<Memo[]> {
    const searchQuery = query.toLowerCase()
    return this.data.memos
      .filter(memo => 
        memo.userId === userId && 
        (memo.title.toLowerCase().includes(searchQuery) || 
         memo.content.toLowerCase().includes(searchQuery) ||
         memo.tags.some(tag => tag.toLowerCase().includes(searchQuery)))
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit)
  }
}

// 单例模式
let dbInstance: FileDatabase | null = null

export function getDatabase(): FileDatabase {
  if (!dbInstance) {
    dbInstance = new FileDatabase()
  }
  return dbInstance
}

export async function initDatabase() {
  const db = getDatabase()
  await db.init()
  return db
}

export default FileDatabase
