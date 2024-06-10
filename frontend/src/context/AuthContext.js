import { createContext, useEffect, useReducer } from 'react'

export const AuthContext = createContext()

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload }
    case 'LOGOUT':
      return { user: null }
    default:
      return state
  }
}

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  })

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      const setParkAdmin = async () => {
        const response = await fetch(
          'http://localhost:4000/api/parking/isparkadmin',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userid: user.id }),
          },
        )
        const data = await response.json()
        if (response.ok) {
          user.parkAdmin = data.CNT
          console.log('userauth parkcnt:', user)
          dispatch({ type: 'LOGIN', payload: user })
        } else {
          user.parkAdmin = 0
          dispatch({ type: 'LOGIN', payload: user })
        }
      }
      setParkAdmin()
    }
  }, [dispatch])

  console.log('AuthContext state: ', state)
  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}
