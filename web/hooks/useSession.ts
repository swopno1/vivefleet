'use client'

import { User } from '@/lib/types'
import Cookies from 'js-cookie'
import { useState } from 'react'

export const useSession = () => {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token')
    }
    return null
  })
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user')
      return user ? JSON.parse(user) : null
    }
    return null
  })

  const setTokenAndStorage = (token: string | null) => {
    setToken(token)
    if (token) {
      localStorage.setItem('token', token)
      Cookies.set('token', token)
    } else {
      localStorage.removeItem('token')
      Cookies.remove('token')
    }
  }

  const setUserAndStorage = (user: User | null) => {
    setUser(user)
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  }

  return {
    token,
    setToken: setTokenAndStorage,
    user,
    setUser: setUserAndStorage,
  }
}
