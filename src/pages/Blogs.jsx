// src/pages/Blogs.jsx
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const Blogs = () => {
  const { token } = useSelector((state) => state.auth)
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  // Blog form states
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [editingId, setEditingId] = useState(null) // null = new post

  useEffect(() => {
    fetchBlogs()
  }, [token])

  const fetchBlogs = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/blogs', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setBlogs(data)
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch blogs:', err)
    }
  }

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault()

    const method = editingId ? 'PUT' : 'POST'
    const url = editingId
      ? `http://localhost:5000/api/blogs/${editingId}`
      : 'http://localhost:5000/api/blogs'

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      })

      if (!res.ok) throw new Error('Failed to save blog')

      setTitle('')
      setContent('')
      setEditingId(null)
      fetchBlogs()
    } catch (err) {
      console.error(err)
    }
  }

  const handleEdit = (blog) => {
    setTitle(blog.title)
    setContent(blog.content)
    setEditingId(blog._id)
  }

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/blogs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Delete failed')
      fetchBlogs()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        {editingId ? 'Edit Blog' : 'Create a Blog'}
      </h1>

      <form onSubmit={handleCreateOrUpdate} className="space-y-4 mb-8">
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Content"
          className="w-full p-2 border rounded"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingId ? 'Update Blog' : 'Create Blog'}
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-2">Your Blogs</h2>

      {loading ? (
        <p>Loading...</p>
      ) : blogs.length === 0 ? (
        <p>No blogs found.</p>
      ) : (
        <ul className="space-y-4">
          {blogs.map((blog) => (
            <li key={blog._id} className="bg-white p-4 shadow rounded">
              <h2 className="text-lg font-semibold">{blog.title}</h2>
              <p className="text-sm text-gray-600">{blog.content}</p>

              <div className="mt-2 flex gap-3">
                <button
                  onClick={() => handleEdit(blog)}
                  className="text-blue-500 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(blog._id)}
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

export default Blogs
