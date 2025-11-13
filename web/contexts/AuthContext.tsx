'use client'

import { User } from '@/lib/types'
import { createContext, useContext, useEffect, useState } from 'react'
import { useSession } from '../hooks/useSession'
import { useParams } from 'next/navigation'

interface AuthContextType {
  user: User | null
  token: string | null
  login: (token: string, user: User) => void
  logout: () => void
  loading: boolean
  loginUser: (
    values: any,
  ) => Promise<{
    error: any
    success: boolean
  }>
  registerUser: (
    values: any,
  ) => Promise<{
    error: any
    success: boolean
  }>
  forgotPassword: (
    values: any,
  ) => Promise<{
    error: any
    success: boolean
  }>
  resetPassword: (
    values: any,
  ) => Promise<{
    error: any
    success: boolean
  }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { token, setToken, user, setUser } = useSession()
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const locale = params.locale

  useEffect(() => {
    if (token && user) {
      // Here you might want to validate the token with the backend
      setLoading(false)
    } else {
      setLoading(false)
    }
  }, [token, user])

  const login = (newToken: string, newUser: User) => {
    setToken(newToken)
    setUser(newUser)
  }

  const logout = () => {
    setToken(null)
    setUser(null)
  }

  const api = 'http://localhost:4000'

  const loginUser = async (values: any) => {
    try {
      const response = await fetch(`${api}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })
      const data = await response.json()
      if (!response.ok) {
        return { error: data, success: false }
      }
      login(data.token, data.user)
      localStorage.setItem('role', data.user.role)
      localStorage.setItem('locale', locale)
      return { error: null, success: true }
    } catch (error) {
      return { error, success: false }
    }
  }

  const registerUser = async (values: any) => {
    try {
      const response = await fetch(`${api}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })
      const data = await response.json()
      if (!response.ok) {
        return { error: data, success: false }
      }
      return { error: null, success: true }
    } catch (error) {
      return { error, success: false }
    }
  }

  const forgotPassword = async (values: any) => {
    try {
      const response = await fetch(`${api}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })
      const data = await response.json()
      if (!response.ok) {
        return { error: data, success: false }
      }
      return { error: null, success: true }
    } catch (error) {
      return { error, success: false }
    }
  }

  const resetPassword = async (values: any) => {
    try {
      const response = await fetch(`${api}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })
      const data = await response.json()
      if (!response.ok) {
        return { error: data, success: false }
      }
      return { error: null, success: true }
    } catch (error) {
      return { error, success: false }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        loading,
        loginUser,
        registerUser,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
