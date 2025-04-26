import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import Home from './pages/LandingPage' // if LandingPage.jsx is acting as Home
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Blogs from './pages/Blogs'
import Tasks from './pages/Tasks'
import CloudFiles from './pages/CloudFiles'
import FocusTimer from './pages/FocusTimer'
import Notifications from './pages/Notifications'


function App() {
  return (
    <Router>
      <Navbar />  {/* 👈 This renders the top navigation bar */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/blogs"
          element={
            <ProtectedRoute>
              <Blogs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cloud"
          element={
            <ProtectedRoute>
              <CloudFiles />
            </ProtectedRoute>
          }
        />
        <Route
          path="/focus"
          element={
            <ProtectedRoute>
              <FocusTimer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
