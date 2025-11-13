'use client'

import { useAuth } from '@/contexts/AuthContext'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
) => {
  const WithAuthComponent = (props: P) => {
    const { token, loading } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
      if (!loading && !token) {
        const locale = pathname.split('/')[1] || 'en';
        router.replace(`/${locale}/(auth)/login`);
      }
    }, [loading, token, router, pathname]);

    if (loading) {
      return <div>Loading...</div>
    }

    if (!token) {
      return null
    }

    return <WrappedComponent {...props} />
  }

  return WithAuthComponent
}

export default withAuth
