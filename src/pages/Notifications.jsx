// src/pages/Notifications.jsx
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const Notifications = () => {
  const { token } = useSelector((state) => state.auth)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/notifications', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        setNotifications(data)
        setLoading(false)
      } catch (err) {
        console.error('Failed to fetch notifications', err)
      }
    }

    fetchNotifications()
  }, [token])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>

      {loading ? (
        <p>Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notification) => (
            <li key={notification._id} className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold">{notification.title}</h2>
              <p className="text-gray-700">{notification.message}</p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Notifications
