import React, { createContext, useReducer } from 'react'

export const NotificationContext = createContext()

export const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'UNREAD':
      return {
        totalUnreadNotice: action.payload,
      }
    case 'READ':
      return {
        totalUnreadNotice: null,
      }
    default:
      return state
  }
}

export const NotificationContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, {
    totalUnreadNotice: null,
  })

  return (
    <NotificationContext.Provider value={{ ...state, dispatch }}>
      {children}
    </NotificationContext.Provider>
  )
}
