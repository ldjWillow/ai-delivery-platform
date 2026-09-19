import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

const STORAGE_KEY = 'ai-delivery-auth'

type AuthUser = {
  name: string
  role: string
  account: string
}

type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (account: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readStored(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readStored())

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      login: async (account, password) => {
        await new Promise((r) => setTimeout(r, 450))
        const a = account.trim()
        const p = password.trim()
        if (!a || !p) {
          throw new Error('请输入账号和密码')
        }
        if (p.toLowerCase() === 'wrong' || p === '错误') {
          throw new Error('账号或密码不正确。连续失败可能导致临时锁定。')
        }
        if (a.toLowerCase() === 'locked') {
          throw new Error('该账号已锁定，请联系组织管理员解锁。')
        }
        const next: AuthUser = {
          account: a,
          name: a === 'admin' ? '管理员' : '张三',
          role: a === 'admin' ? 'Owner' : '技术负责人',
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        setUser(next)
      },
      logout: () => {
        localStorage.removeItem(STORAGE_KEY)
        setUser(null)
      },
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
