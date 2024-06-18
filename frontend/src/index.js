import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthContextProvider } from './context/AuthContext'
import { NotificationContextProvider } from './context/NotificationContext'
import { ParksContextProvider } from './context/ParksContext'
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <ParksContextProvider>
        <NotificationContextProvider>
          <App />
        </NotificationContextProvider>
      </ParksContextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
)
