import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

const CloudFiles = () => {
  const { token } = useSelector((state) => state.auth)
  const [files, setFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const fileInputRef = useRef(null)

  useEffect(() => {
    fetchFiles()
  }, [token])

  const fetchFiles = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/cloud/myfiles', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setFiles(data.files || [])
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch files:', err)
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!selectedFile) return

    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const res = await fetch('http://localhost:5000/api/cloud/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      if (!res.ok) throw new Error('Failed to upload file')

      setSelectedFile(null)
      fileInputRef.current.value = null  // 👈 clear file name after upload
      fetchFiles()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/cloud/delete/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) throw new Error('Failed to delete file')

      fetchFiles()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Your Files</h1>

      <form onSubmit={handleUpload} className="mb-8 space-y-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => setSelectedFile(e.target.files[0])}
          className="block w-full text-sm text-gray-600"
          required
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Upload File
        </button>
      </form>

      <h2 className="text-lg font-semibold mb-2">Your Uploaded Files:</h2>

      {loading ? (
        <p>Loading files...</p>
      ) : files.length === 0 ? (
        <p>No files uploaded yet.</p>
      ) : (
        <ul className="space-y-3">
          {files.map((file) => (
            <li key={file._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
              <a
                href={file.viewLink}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline"
              >
                {file.filename}
              </a>
              <button
                onClick={() => handleDelete(file._id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default CloudFiles
