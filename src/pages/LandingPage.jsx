// src/pages/LandingPage.jsx
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const LandingPage = () => {
  const { token } = useSelector((state) => state.auth)

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="text-center max-w-lg px-4">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
          Welcome to <span className="text-indigo-600">Exam Productivity</span>
        </h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Organize your blogs, manage tasks, track focus time, upload files, and stay on top of your academic life —
          all in one place.
        </p>

        {!token ? (
          <div className="flex justify-center gap-4">
            <Link
              to="/login"
              className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-6 py-2 border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50 transition"
            >
              Signup
            </Link>
          </div>
        ) : (
          <Link
            to="/profile"
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Go to Profile
          </Link>
        )}
      </div>
    </div>
  )
}

export default LandingPage
