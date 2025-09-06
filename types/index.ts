export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface Memo {
  id: string
  title: string
  content: string
  tags: string[]
  color?: string
  isPinned: boolean
  userId: string
  createdAt: string
  updatedAt: string
}

export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

export interface PaginationParams {
  page: number
  pageSize: number
}

export interface MemoFilter {
  search?: string
  tags?: string[]
  startDate?: string
  endDate?: string
}
