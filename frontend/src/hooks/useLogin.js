import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useLogin = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const { dispatch } = useAuthContext()

  const login = async (email, password) => {
    setIsLoading(true)
    setError(null)

    const response = await fetch('http://localhost:4000/api/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const user = await response.json()
    if (!response.ok) {
      setIsLoading(false)
      setError(user.error)
    }
    if (response.ok) {
      localStorage.setItem('user', JSON.stringify(user))
      console.log('saved to local storage')

      const res = await fetch('http://localhost:4000/api/parking/isparkadmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userid: user.id }),
      })
      const data = await res.json()
      if (res.ok) {
        user.parkAdmin = data.CNT
        dispatch({ type: 'LOGIN', payload: user })
      } else {
        user.parkAdmin = 0
        dispatch({ type: 'LOGIN', payload: user })
      }
    }
  }
  return { login, isLoading, error }
}
