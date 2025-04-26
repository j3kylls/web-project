import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const Tasks = () => {
  const { token } = useSelector((state) => state.auth)
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [token])

  const fetchTasks = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setTasks(data)
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch tasks', err)
    }
  }

  const handleCreateOrUpdateTask = async (e) => {
    e.preventDefault()

    const url = editingTaskId
      ? `http://localhost:5000/api/tasks/${editingTaskId}`
      : 'http://localhost:5000/api/tasks'

    const method = editingTaskId ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, dueDate }),
      })

      if (!res.ok) throw new Error('Failed to save task')

      setTitle('')
      setDueDate('')
      setEditingTaskId(null)
      fetchTasks()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteTask = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) throw new Error('Failed to delete task')

      fetchTasks()
    } catch (err) {
      console.error(err)
    }
  }

  const handleMarkCompleted = async (taskId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: true }),
      })

      if (!res.ok) throw new Error('Failed to mark as completed')

      setTasks(prev =>
        prev.map(task =>
          task._id === taskId ? { ...task, completed: true } : task
        )
      )
    } catch (err) {
      console.error(err)
    }
  }

  const handleEditTask = (task) => {
    setTitle(task.title)
    setDueDate(task.dueDate ? task.dueDate.slice(0, 10) : '')
    setEditingTaskId(task._id)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        {editingTaskId ? 'Edit Task' : 'Create Task'}
      </h1>

      <form onSubmit={handleCreateOrUpdateTask} className="mb-8 space-y-4">
        <input
          type="text"
          placeholder="Task Title"
          className="w-full p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="date"
          className="w-full p-2 border rounded"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]} // 👈 THIS line added
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          {editingTaskId ? 'Update Task' : 'Create Task'}
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-2">Your Tasks</h2>

      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li key={task._id} className="flex items-center justify-between bg-white p-4 rounded shadow">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    disabled
                    className="cursor-not-allowed accent-green-500"
                  />
                  <span className={task.completed ? 'line-through text-gray-400' : ''}>
                    {task.title}
                  </span>
                </div>

                {task.dueDate && (
                  <p className="text-sm text-gray-500 ml-8">
                    {task.completed
                      ? `Was due on ${new Date(task.dueDate).toLocaleDateString()}`
                      : `Due: ${new Date(task.dueDate).toLocaleDateString()}`}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                {!task.completed && (
                  <button
                    onClick={() => handleMarkCompleted(task._id)}
                    className="text-green-500 hover:underline"
                  >
                    Mark Completed
                  </button>
                )}
                {!task.completed && (
                  <button
                    onClick={() => handleEditTask(task)}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Tasks
