import React, { useState } from 'react'
import { useLogin } from '../hooks/useLogin'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, error, isLoading } = useLogin()

  const handleSubmit = async (e) => {
    e.preventDefault()

    await login(email, password)
  }

  return (
    <form
      className="login"
      onSubmit={handleSubmit}
    >
      <h3>Login</h3>
      <hr />
      <div className="input_box">
        <label>
          <span className="material-symbols-outlined">alternate_email</span>
        </label>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="input_box">
        <label>
          <span className="material-symbols-outlined">lock_open</span>
        </label>
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button disabled={isLoading}>Login</button>
      {error && <div className="error">{error}</div>}
    </form>
  )
}

export default Login
