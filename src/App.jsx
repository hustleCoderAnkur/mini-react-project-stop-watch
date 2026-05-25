import { useEffect, useState } from "react"

export default function App() {
  const [activeTab, setActiveTab] = useState("stopwatch")

  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white px-8 py-12">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl p-4">
        <h1 className="text-center text-3xl font-bold tracking-widest mb-2">
          DEV FOCUS
        </h1>
        <p className="text-center text-zinc-500 text-sm mb-6">
          Deep Work Productivity Timer
        </p>

        <div className="flex mb-6">

          <button
            onClick={() => setActiveTab("stopwatch")}
            className={`flex-1 py-3 rounded-l-xl font-semibold transition-all ${activeTab === "stopwatch"
                ? "bg-green-500 text-black"
                : "bg-zinc-800 text-zinc-400"
              }`}
          >
            Stopwatch
          </button>

          <button
            onClick={() => setActiveTab("timer")}
            className={`flex-1 py-3 rounded-r-xl font-semibold transition-all ${activeTab === "timer"
                ? "bg-green-500 text-black"
                : "bg-zinc-800 text-zinc-400"
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
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem("focusSessions")
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem("focusSessions", JSON.stringify(sessions))
  }, [sessions])

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setTime((prev) => prev + 10)
    }, 10)

    return () => clearInterval(interval)
  }, [isRunning])

  const hours = Math.floor(time / 3600000)
  const minutes = Math.floor((time % 3600000) / 60000)
  const seconds = Math.floor((time % 60000) / 1000)
  const milliseconds = Math.floor((time % 1000) / 10)
  const display = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}:${String(milliseconds).padStart(2, "0")}`

  const handleStartStop = () => {
    setIsRunning((prev) => !prev)
  }

  const handleReset = () => {
    setIsRunning(false)
    setTime(0)
  }

  const handleSave = () => {
    if (time === 0) return

    const newSession = {
      id: Date.now(),
      time: display,
    }

    setSessions((prev) => [newSession, ...prev])
  }

  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === "Space") {
        e.preventDefault()
        handleStartStop()
      }

      if (e.key.toLowerCase() === "r") {
        handleReset()
      }

      if (e.key.toLowerCase() === "l") {
        handleSave()
      }
    }

    window.addEventListener("keydown", handleKey)

    return () => window.removeEventListener("keydown", handleKey)
  }, [time])

  return (
    <div className="flex flex-col gap-5">
      <div className="text-center">
        <p className="text-5xl md:text-6xl font-mono font-bold tracking-widest text-green-400">
          {display}
        </p>

        <p className="mt-3 text-sm tracking-widest text-zinc-500">
          {isRunning
            ? "DEEP WORK ACTIVE"
            : time === 0
              ? "READY TO FOCUS"
              : "PAUSED"}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={handleReset}
          className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-all font-semibold"
        >
          Reset
        </button>

        <button
          onClick={handleStartStop}
          className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-400 text-black transition-all font-bold"
        >
          {isRunning ? "Pause" : "Start"}
        </button>

        <button
          onClick={handleSave}
          className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-all font-semibold"
        >
          Save
        </button>

      </div>

      <div className="w-full">
        <button
          onClick={() => setShowHelp((prev) => !prev)}
          className="w-full flex items-center justify-between bg-zinc-950 border border-zinc-800 hover:border-green-500 rounded-xl px-4 py-3 transition-all"
        >
          <span className="font-semibold text-zinc-300">
            Help & Shortcuts
          </span>

          <span className="text-green-400 text-xl">
            {showHelp ? "−" : "+"}
          </span>
        </button>

        {showHelp && (
          <div className="mt-3 bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">
                  Start / Pause
                </span>

                <kbd className="bg-zinc-800 px-3 py-1 rounded-lg text-green-400 font-mono">
                  SPACE
                </kbd>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-400">
                  Reset
                </span>

                <kbd className="bg-zinc-800 px-3 py-1 rounded-lg text-green-400 font-mono">
                  R
                </kbd>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-400">
                  Save Session
                </span>

                <kbd className="bg-zinc-800 px-3 py-1 rounded-lg text-green-400 font-mono">
                  S
                </kbd>
              </div>
            </div>
          </div>
        )}
      </div>


      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-zinc-300">
            Saved Sessions
          </h2>

          <span className="text-sm text-zinc-500">
            {sessions.length} Sessions
          </span>
        </div>

        {sessions.length === 0 ? (
          <p className="text-zinc-600 text-sm">
            No sessions saved yet
          </p>
        ) : (
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {sessions.map((session, index) => (
              <div
                key={session.id}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-3"
              >

                <div className="flex items-center justify-between">
                  <p className="text-zinc-500 text-sm">
                    Session #{sessions.length - index}
                  </p>

                  <p className="text-green-400 font-mono text-lg">
                    {session.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Timer() {
  const [inputMinutes, setInputMinutes] = useState(25)
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

  const addExtraTime = (minutesToAdd) => {
    setSecondsLeft((prev) => prev + minutesToAdd * 60)
  }

  const hours = Math.floor(secondsLeft / 3600)
  const minutes = Math.floor((secondsLeft % 3600) / 60)
  const seconds = secondsLeft % 60
  const display = `${String(hours).padStart(2, "0")}
  :${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`

  return (
    <div className="flex flex-col gap-5">
      {!isStarted ? (
        <>
          <input
            type="number"
            min={1}
            max={300}
            value={inputMinutes}
            onChange={(e) => setInputMinutes(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl py-5 text-center text-5xl font-mono outline-none focus:border-green-500"
          />

          <button
            onClick={handleStart}
            className="w-full py-4 rounded-2xl bg-green-500 hover:bg-green-400 text-black font-bold transition-all"
          >
            Start Focus Timer
          </button>
        </>
      ) : (
        <>
          <p className="text-6xl font-mono font-bold tracking-widest text-green-400 text-center">
            {display}
          </p>

            <p
            className={`text-sm text-center font-semibold tracking-wide ${isDone
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

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleReset}
              className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-all font-semibold"
            >
              Reset
            </button>

            {!isDone && (
              <button
                onClick={handlePauseResume}
                className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-400 text-black transition-all font-bold"
              >
                {isRunning ? "Pause" : "Resume"}
              </button>
            )}

          </div>

          {!isDone && (
            <div className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
              <p className="text-zinc-400 text-sm mb-4 text-center font-medium">
                Add Extra Focus Time
              </p>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => addExtraTime(5)}
                  className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-all font-semibold"
                >
                  +5 Min
                </button>

                <button
                  onClick={() => addExtraTime(10)}
                  className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-all font-semibold"
                >
                  +10 Min
                </button>

                <button
                  onClick={() => addExtraTime(15)}
                  className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-all font-semibold"
                >
                  +15 Min
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}