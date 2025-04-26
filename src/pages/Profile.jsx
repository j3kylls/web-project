// src/pages/Profile.jsx
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../redux/authSlice'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const Profile = () => {
  const { user, token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const handleClearAccount = async () => {
    const confirm = window.confirm("Are you sure you want to clear your account data? (Blogs, Tasks, Files, Timetable, Pomodoro sessions)")
    if (!confirm) return

    try {
      const res = await fetch('http://localhost:5000/api/users/clear-account', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()
      if (res.ok) {
        alert('✅ Your account data has been cleared!')
        window.location.reload()
      } else {
        alert('❌ Failed to clear account: ' + data.error)
      }
    } catch (err) {
      console.error(err)
      alert('❌ Something went wrong while clearing your account.')
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()

    try {
      const res = await fetch('http://localhost:5000/api/users/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data = await res.json()
      if (res.ok) {
        alert('✅ Password changed successfully! Please login again.');
        dispatch(logout())    // 🔥 Auto logout
        navigate('/login')    // 🔥 Redirect to login page
      } else {
        alert('❌ Failed to change password: ' + data.error)
      }
    } catch (err) {
      console.error(err)
      alert('❌ Error changing password.')
    }
  }

  const handleDeleteAccount = async () => {
    const confirm = window.confirm("⚠️ This will permanently delete your account. Are you sure?")
    if (!confirm) return

    try {
      const res = await fetch(`http://localhost:5000/api/users/delete/${user.email}`, {
        method: 'DELETE',
      })

      const data = await res.json()
      if (res.ok) {
        alert('✅ Account deleted successfully!')
        dispatch(logout())
        navigate('/signup')
      } else {
        alert('❌ Failed to delete account: ' + data.error)
      }
    } catch (err) {
      console.error(err)
      alert('❌ Error deleting account.')
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">👤 Profile</h1>

      {user ? (
        <div className="space-y-4 mt-4">
          <div className="space-y-1">
            <p><strong>Name:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>User ID:</strong> {user._id}</p>
          </div>

          {/* Clear Account Button */}
          <button
            onClick={handleClearAccount}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Clear My Data
          </button>

          {/* Change Password Form */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Change Password</h2>
            <form onSubmit={handleChangePassword} className="space-y-2">
              <input
                type="password"
                placeholder="Current Password"
                className="w-full p-2 border rounded"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="New Password"
                className="w-full p-2 border rounded"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Change Password
              </button>
            </form>
          </div>

          {/* Dangerous: Delete Account */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-red-600 mb-2">Danger Zone</h2>
            <button
              onClick={handleDeleteAccount}
              className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800"
            >
              Delete My Account
            </button>
          </div>
        </div>
      ) : (
        <p>User not logged in.</p>
      )}
    </div>
  )
}

export default Profile
