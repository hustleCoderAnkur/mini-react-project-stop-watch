import { useState, useEffect } from "react"

export default function App() {
  const [activeTab, setActiveTab] = useState("stopwatch")

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-80">

        <h1 className="text-center text-2xl font-bold text-gray-800 mb-4">
          Clock App
        </h1>

        <div className="flex mb-6">
          <button
            onClick={() => setActiveTab("stopwatch")}
            className={`flex-1 py-2 rounded-l-xl font-semibold border ${activeTab === "stopwatch"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-500 border-gray-300"
              }`}
          >
            Stopwatch
          </button>
          <button
            onClick={() => setActiveTab("timer")}
            className={`flex-1 py-2 rounded-r-xl font-semibold border ${activeTab === "timer"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-500 border-gray-300"
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

  useEffect(() => {
    if (!isRunning) return
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [isRunning])

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  const display = `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`

  const handleStartStop = () => setIsRunning((prev) => !prev)

  const handleReset = () => {
    setIsRunning(false)
    setSeconds(0)
  }

  return (
    <div className="flex flex-col items-center gap-4">

      <p className="text-6xl font-mono font-light text-gray-800">{display}</p>

      <p className="text-sm text-gray-400">
        {isRunning ? "Running..." : seconds === 0 ? "Press Start" : "Paused"}
      </p>

      <div className="flex gap-3">
        <button
          onClick={handleReset}
          className="px-5 py-2 rounded-xl bg-gray-100 text-gray-600 font-semibold hover:bg-gray-200"
        >
          Reset
        </button>
        <button
          onClick={handleStartStop}
          className="px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500"
        >
          {isRunning ? "Pause" : "Start"}
        </button>
      </div>

    </div>
  )
}

function Timer() {
  const [inputMinutes, setInputMinutes] = useState(1)
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

  const handlePauseResume = () => setIsRunning((prev) => !prev)

  const handleReset = () => {
    setIsRunning(false)
    setIsStarted(false)
    setIsDone(false)
    setSecondsLeft(0)
  }

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const display = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`

  return (
    <div className="flex flex-col items-center gap-4">

      {!isStarted ? (
        <>
          <p className="text-sm text-gray-500 font-medium">Enter minutes</p>
          <input
            type="number"
            min={1}
            max={60}
            value={inputMinutes}
            onChange={(e) => setInputMinutes(e.target.value)}
            className="w-24 text-center text-3xl font-mono border border-gray-300 rounded-xl py-2 outline-none focus:border-blue-500"
          />
          <button
            onClick={handleStart}
            className="w-full py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500"
          >
            Start Timer
          </button>
        </>
      ) : (
        <>
          <p className="text-6xl font-mono font-light text-gray-800">{display}</p>

          <p className={`text-sm font-medium ${isDone ? "text-green-500" : isRunning ? "text-blue-500" : "text-gray-400"}`}>
            {isDone ? "Done!" : isRunning ? "Counting down..." : "Paused"}
          </p>

          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="px-5 py-2 rounded-xl bg-gray-100 text-gray-600 font-semibold hover:bg-gray-200"
            >
              Reset
            </button>
            {!isDone && (
              <button
                onClick={handlePauseResume}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500"
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