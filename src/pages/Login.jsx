// src/pages/Login.jsx
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { login } from '../redux/authSlice'
import { useNavigate } from 'react-router-dom';



const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      const res = await fetch('http://localhost:5000/api/users/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Login failed')
      }

      dispatch(login({ token: data.token, user: data.user }))
      navigate('/profile');
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <form onSubmit={handleLogin} className="p-6 bg-white shadow rounded w-full max-w-sm space-y-4">
        <h2 className="text-xl font-bold text-center">Login</h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="w-full bg-black text-white py-2 rounded hover:bg-gray-800">
          Login
        </button>
      </form>
    </div>
  )
}

export default Login
