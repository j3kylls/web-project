// src/pages/FocusTimer.jsx
import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

const FocusTimer = () => {
  const { token } = useSelector((state) => state.auth)

  const [minutesInput, setMinutesInput] = useState(25) // default input
  const [minutes, setMinutes] = useState(25)
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const timerRef = useRef(null)

  const formatTime = (mins, secs) => {
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        if (seconds > 0) {
          setSeconds(prev => prev - 1)
        } else if (minutes > 0) {
          setMinutes(prev => prev - 1)
          setSeconds(59)
        } else {
          clearInterval(timerRef.current)
          setIsRunning(false)
          logFocusTime()
          alert('🎯 Focus session completed!')
        }
      }, 1000)
    }

    return () => clearInterval(timerRef.current)
  }, [isRunning, minutes, seconds])

  const handleStart = () => {
    setIsRunning(true)
  }

  const handlePause = () => {
    setIsRunning(false)
    clearInterval(timerRef.current)
  }

  const handleReset = () => {
    setIsRunning(false)
    clearInterval(timerRef.current)
    setMinutes(minutesInput)
    setSeconds(0)
  }

  const handleSetTime = (e) => {
    e.preventDefault()
    setMinutes(minutesInput)
    setSeconds(0)
    setIsRunning(false)
    clearInterval(timerRef.current)
  }

  const logFocusTime = async () => {
    try {
      await fetch('http://localhost:5000/api/pomodoro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ minutes: minutesInput }),
      })
    } catch (err) {
      console.error('Failed to log focus time:', err)
    }
  }

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-6">Focus Timer</h1>

      {/* Time Input */}
      <form onSubmit={handleSetTime} className="mb-6">
        <input
          type="number"
          value={minutesInput}
          onChange={(e) => setMinutesInput(Number(e.target.value))}
          className="p-2 border rounded w-24 text-center"
          min="1"
          required
        />
        <button
          type="submit"
          className="ml-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Set Time
        </button>
      </form>

      {/* Timer Display */}
      <div className="text-5xl font-mono mb-6">
        {formatTime(minutes, seconds)}
      </div>

      {/* Timer Controls */}
      <div className="space-x-4">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Start
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Pause
          </button>
        )}
        <button
          onClick={handleReset}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Reset
        </button>
      </div>
    </div>
  )
}

export default FocusTimer
