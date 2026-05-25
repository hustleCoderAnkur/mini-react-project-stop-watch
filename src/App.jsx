import { useState, useEffect } from "react"

export default function App() {
  const [activeTab, setActiveTab] = useState("stopwatch")

  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white px-4">

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 w-full max-w-md">

        <h1 className="text-center text-3xl font-bold mb-1 tracking-wide">
          DEV FOCUS
        </h1>

        <p className="text-center text-zinc-500 text-sm mb-6">
          Measure deep work sessions
        </p>

        <div className="flex mb-6">
          <button
            onClick={() => setActiveTab("stopwatch")}
            className={`flex-1 py-2 rounded-l-xl font-semibold border transition-all duration-200 ${
              activeTab === "stopwatch"
                ? "bg-green-500 text-black border-green-500"
                : "bg-zinc-900 text-zinc-400 border-zinc-700"
            }`}
          >
            Stopwatch
          </button>

          <button
            onClick={() => setActiveTab("timer")}
            className={`flex-1 py-2 rounded-r-xl font-semibold border transition-all duration-200 ${
              activeTab === "timer"
                ? "bg-green-500 text-black border-green-500"
                : "bg-zinc-900 text-zinc-400 border-zinc-700"
            }`}
          >
            Timer
          </button>
        </div>

        {activeTab === "stopwatch" ? <Stopwatch /> : <Timer />}
      </div>

    </div>
  )
}

function Stopwatch() {
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [laps, setLaps] = useState([])

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === "Space") {
        e.preventDefault()
        setIsRunning((prev) => !prev)
      }

      if (e.key.toLowerCase() === "r") {
        setSeconds(0)
        setIsRunning(false)
        setLaps([])
      }

      if (e.key.toLowerCase() === "s") {
        if (seconds > 0) {
          setLaps((prev) => [...prev, display])
        }
      }
    }

    window.addEventListener("keydown", handleKey)

    return () => window.removeEventListener("keydown", handleKey)
  }, [seconds])

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  const display = `${String(hours).padStart(2, "0")}:${String(
    minutes % 60
  ).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`

  const handleStartStop = () => {
    setIsRunning((prev) => !prev)
  }

  const handleReset = () => {
    setIsRunning(false)
    setSeconds(0)
    setLaps([])
  }

  const handleLap = () => {
    if (seconds > 0) {
      setLaps((prev) => [...prev, display])
    }
  }

  return (
    <div className="flex flex-col items-center gap-5">

      <div className="text-center">
        <p className="text-6xl font-mono font-bold tracking-widest text-green-400">
          {display}
        </p>

        <p className="text-zinc-500 mt-3 text-sm">
          {isRunning
            ? "FOCUS MODE ACTIVE"
            : seconds === 0
            ? "READY"
            : "PAUSED"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full">

        <button
          onClick={handleReset}
          className="py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-all font-semibold"
        >
          Reset
        </button>

        <button
          onClick={handleStartStop}
          className="py-3 rounded-xl bg-green-500 hover:bg-green-400 text-black transition-all font-bold"
        >
          {isRunning ? "Pause" : "Start"}
        </button>

      </div>

      <button
        onClick={handleLap}
        className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-all font-semibold"
      >
        Save Session
      </button>

      <div className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4">

        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold text-zinc-300">
            Coding Sessions
          </p>

          <p className="text-sm text-zinc-500">
            {laps.length} saved
          </p>
        </div>

        {laps.length === 0 ? (
          <p className="text-zinc-600 text-sm">
            No sessions saved yet
          </p>
        ) : (
          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
            {laps.map((lap, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2"
              >
                <span className="text-zinc-500 text-sm">
                  Session #{index + 1}
                </span>

                <span className="font-mono text-green-400">
                  {lap}
                </span>
              </div>
            ))}
          </div>
        )}

      </div>

      <div className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-500 space-y-1">
        <p>SPACE  Start / Pause</p>
        <p>R  Reset</p>
        <p>L  Save Session</p>
      </div>

    </div>
  )
}

function Timer() {
  const [inputMinutes, setInputMinutes] = useState(50)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isStarted, setIsStarted] = useState(false)
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false)
          setIsDone(true)
          return 0
        }

        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning])

  const handleStart = () => {
    const totalSeconds = Number(inputMinutes) * 60

    if (totalSeconds <= 0) return

    setSecondsLeft(totalSeconds)
    setIsStarted(true)
    setIsDone(false)
    setIsRunning(true)
  }

  const handlePauseResume = () => {
    setIsRunning((prev) => !prev)
  }

  const handleReset = () => {
    setIsRunning(false)
    setIsStarted(false)
    setIsDone(false)
    setSecondsLeft(0)
  }

  const hours = Math.floor(secondsLeft / 3600)
  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60

  const display = `${String(hours).padStart(2, "0")}:${String(
    minutes % 60
  ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`

  return (
    <div className="flex flex-col items-center gap-5">

      {!isStarted ? (
        <>

          <div className="w-full">

            <p className="text-zinc-400 text-sm mb-2">
              Focus Time (minutes)
            </p>

            <input
              type="number"
              min={1}
              max={300}
              value={inputMinutes}
              onChange={(e) => setInputMinutes(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl py-4 text-center text-4xl font-mono outline-none focus:border-green-500"
            />

          </div>

          <button
            onClick={handleStart}
            className="w-full py-4 rounded-xl bg-green-500 hover:bg-green-400 text-black font-bold transition-all"
          >
            Start Focus Timer
          </button>

          <div className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-500">
            Recommended:
            <br />
            • 50 mins coding + 10 mins break
            <br />
            • 90 mins deep work + 15 mins break
          </div>

        </>
      ) : (
        <>

          <p className="text-6xl font-mono font-bold tracking-widest text-green-400">
            {display}
          </p>

          <p
            className={`text-sm font-semibold tracking-wide ${
              isDone
                ? "text-green-400"
                : isRunning
                ? "text-green-300"
                : "text-zinc-500"
            }`}
          >
            {isDone
              ? "SESSION COMPLETE"
              : isRunning
              ? "DEEP WORK ACTIVE"
              : "PAUSED"}
          </p>

          <div className="grid grid-cols-2 gap-3 w-full">

            <button
              onClick={handleReset}
              className="py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-all font-semibold"
            >
              Reset
            </button>

            {!isDone && (
              <button
                onClick={handlePauseResume}
                className="py-3 rounded-xl bg-green-500 hover:bg-green-400 text-black transition-all font-bold"
              >
                {isRunning ? "Pause" : "Resume"}
              </button>
            )}

          </div>

        </>
      )}

    </div>
  )
}