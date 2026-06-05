import { useEffect, useState } from 'react'

export type User = {
  name?: string
  surname?: string
  mail?: string
  description?: string
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUser = async (signal?: AbortSignal) => {
    try {
      setLoading(true)
      const token = localStorage.getItem('jwt')

      const res = await fetch('http://localhost:8080/user/me', {
        method: 'GET',
        signal,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok) {
        throw new Error(`Error ${res.status}`)
      }

      const data: User = await res.json()
      setUser(data)
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Error fetching user:', err)
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const ac = new AbortController()
    fetchUser(ac.signal)
    return () => ac.abort()
  }, [])

  return { user, loading, error, refetch: () => fetchUser() }
}