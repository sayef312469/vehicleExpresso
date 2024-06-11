import { useState } from 'react'
import { useSignup } from '../hooks/useSignup'

const Signup = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [conPassword, setConPassword] = useState('')
  const { signup, error, isLoading } = useSignup()

  const handleSubmit = async (e) => {
    e.preventDefault()

    await signup(username, email, password, conPassword)
  }

  return (
    <form
      className="signup"
      onSubmit={handleSubmit}
    >
      <h3>Sign Up</h3>
      <hr />
      <div className="input_box">
        <label>
          <span className="material-symbols-outlined">verified_user</span>
        </label>
        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>
      <div className="input_box">
        <label>
          <span className="material-symbols-outlined">alternate_email</span>
        </label>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
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
          value={password}
        />
      </div>
      <div className="input_box">
        <label>
          <span className="material-symbols-outlined">enhanced_encryption</span>
        </label>
        <input
          type="password"
          placeholder="Confirm Password"
          onChange={(e) => setConPassword(e.target.value)}
          value={conPassword}
        />
      </div>
      <button disabled={isLoading}>Sign Up</button>
      {error && <div className="error">{error}</div>}
    </form>
  )
}

export default Signup
