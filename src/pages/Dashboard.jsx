// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const Dashboard = () => {
  const { user, token } = useSelector((state) => state.auth)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  // useEffect(() => {
  //   const fetchStats = async () => {
  //     try {
  //       const res = await fetch('http://localhost:5000/api/dashboard/stats', {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //       const data = await res.json()
  //       setStats(data)
  //       setLoading(false)
  //     } catch (err) {
  //       console.error('Failed to fetch stats:', err)
  //     }
  //   }

  //   fetchStats()
  // }, [token])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/dashboard/stats', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await res.json()
        console.log("📊 Dashboard stats received:", data)  // 🔍 Debug line
        setStats(data)
        setLoading(false)
      } catch (err) {
        console.error('❌ Failed to fetch stats:', err)
      }
    }
  
    fetchStats()
  }, [token])
  

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user?.username}</h1>

      {loading || !stats ? (
        <p>Loading dashboard...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-blue-100 p-4 rounded shadow">
            <h2 className="text-lg font-semibold">Blogs</h2>
            <p className="text-2xl">{stats.blogs}</p>
          </div>
          <div className="bg-green-100 p-4 rounded shadow">
            <h2 className="text-lg font-semibold">Tasks</h2>
            <p className="text-2xl">{stats.tasks}</p>
          </div>
          <div className="bg-purple-100 p-4 rounded shadow">
            <h2 className="text-lg font-semibold">Files</h2>
            <p className="text-2xl">{stats.files}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded shadow">
            <h2 className="text-lg font-semibold">Focus Time</h2>
            <p className="text-2xl">{stats.focusMinutes} min</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
