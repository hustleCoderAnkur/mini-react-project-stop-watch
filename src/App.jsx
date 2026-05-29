import { useEffect, useRef, useState } from "react"

export default function App() {
  const [activeTab, setActiveTab] = useState("stopwatch")
  const [bgMode, setBgMode] = useState(false)

  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white px-8 py-12">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl p-4">

        <h1 className="text-center text-3xl font-bold tracking-widest mb-2">
          DEV FOCUS
        </h1>

        <p className="text-center text-zinc-500 text-sm mb-4">
          Deep Work Productivity Timer
        </p>

        {/* Background Mode Toggle */}
        <div className="flex items-center justify-between bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 mb-5">
          <div>
            <p className="text-sm font-semibold text-zinc-300">Background Mode</p>
            <p className="text-xs text-zinc-600 mt-0.5">
              {bgMode
                ? "Timer runs even when you switch tabs"
                : "Timer pauses when you switch tabs"}
            </p>
          </div>
          <button
            onClick={() => setBgMode((prev) => !prev)}
            className={`relative w-12 h-6 rounded-full transition-all duration-300 ${bgMode ? "bg-green-500" : "bg-zinc-700"}`}
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${bgMode ? "left-7" : "left-1"}`}
            />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex mb-6">
          <button
            onClick={() => setActiveTab("stopwatch")}
            className={`flex-1 py-3 rounded-l-xl font-semibold transition-all ${activeTab === "stopwatch"
              ? "bg-green-500 text-black"
              : "bg-zinc-800 text-zinc-400"}`}
          >
            Stopwatch
          </button>
          <button
            onClick={() => setActiveTab("timer")}
            className={`flex-1 py-3 rounded-r-xl font-semibold transition-all ${activeTab === "timer"
              ? "bg-green-500 text-black"
              : "bg-zinc-800 text-zinc-400"}`}
          >
            Timer
          </button>
        </div>

        {activeTab === "stopwatch"
          ? <Stopwatch bgMode={bgMode} />
          : <Timer bgMode={bgMode} />}

      </div>
    </div>
  )
}

// ─── STOPWATCH ────────────────────────────────────────────────
function Stopwatch({ bgMode }) {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [savedTime, setSavedTime] = useState(0)
  const [showHelp, setShowHelp] = useState(false)
  const [sessions, setSessions] = useState(() => {
    try {
      const saved = localStorage.getItem("focusSessions")
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Track visibility change
  const pausedByVisibilityRef = useRef(false)

  useEffect(() => {
    localStorage.setItem("focusSessions", JSON.stringify(sessions))
  }, [sessions])

  useEffect(() => {
    let interval
    if (isRunning) {
      interval = setInterval(() => {
        setTime(Date.now() - startTime + savedTime)
      }, 10)
    }
    return () => clearInterval(interval)
  }, [isRunning, startTime, savedTime])

  // Visibility change handler
  useEffect(() => {
    const handleVisibility = () => {
      if (bgMode) return // background mode ON → don't touch

      if (document.hidden && isRunning) {
        // Tab switched away → pause
        setSavedTime(Date.now() - startTime + savedTime)
        setIsRunning(false)
        pausedByVisibilityRef.current = true
      } else if (!document.hidden && pausedByVisibilityRef.current) {
        // Tab came back → resume
        setStartTime(Date.now())
        setIsRunning(true)
        pausedByVisibilityRef.current = false
      }
    }

    document.addEventListener("visibilitychange", handleVisibility)
    return () => document.removeEventListener("visibilitychange", handleVisibility)
  }, [bgMode, isRunning, startTime, savedTime])

  const hours = Math.floor(time / 3600000)
  const minutes = Math.floor((time % 3600000) / 60000)
  const seconds = Math.floor((time % 60000) / 1000)
  const milliseconds = Math.floor((time % 1000) / 10)

  const display = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(milliseconds).padStart(2, "0")}`

  const handleStartStop = () => {
    if (isRunning) {
      setSavedTime(time)
      setIsRunning(false)
    } else {
      setStartTime(Date.now())
      setIsRunning(true)
    }
  }

  const handleReset = () => {
    setIsRunning(false)
    setTime(0)
    setSavedTime(0)
    setStartTime(null)
    pausedByVisibilityRef.current = false
  }

  const handleSave = () => {
    if (time === 0) return
    setSessions((prev) => [{ id: Date.now(), time: display }, ...prev])
  }

  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === "Space") { e.preventDefault(); handleStartStop() }
      if (e.key.toLowerCase() === "r") handleReset()
      if (e.key.toLowerCase() === "l") handleSave()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [time, isRunning])

  return (
    <div className="flex flex-col gap-5">
      <div className="text-center">
        <p className="text-5xl md:text-6xl font-mono font-bold tracking-widest text-green-400">
          {display}
        </p>
        <p className="mt-3 text-sm tracking-widest text-zinc-500">
          {isRunning ? "DEEP WORK ACTIVE" : time === 0 ? "READY TO FOCUS" : "PAUSED"}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <button onClick={handleReset} className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-all font-semibold">
          Reset
        </button>
        <button onClick={handleStartStop} className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-400 text-black transition-all font-bold">
          {isRunning ? "Pause" : "Start"}
        </button>
        <button onClick={handleSave} className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-all font-semibold">
          Save
        </button>
      </div>

      {/* Help */}
      <div className="w-full">
        <button
          onClick={() => setShowHelp((prev) => !prev)}
          className="w-full flex items-center justify-between bg-zinc-950 border border-zinc-800 hover:border-green-500 rounded-xl px-4 py-3 transition-all"
        >
          <span className="font-semibold text-zinc-300">Help & Shortcuts</span>
          <span className="text-green-400 text-xl">{showHelp ? "−" : "+"}</span>
        </button>

        {showHelp && (
          <div className="mt-3 bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="space-y-3 text-sm">
              {[["Start / Pause", "SPACE"], ["Reset", "R"], ["Save Session", "L"]].map(([label, key]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-zinc-400">{label}</span>
                  <kbd className="bg-zinc-800 px-3 py-1 rounded-lg text-green-400 font-mono">{key}</kbd>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sessions */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-zinc-300">Saved Sessions</h2>
          <span className="text-sm text-zinc-500">{sessions.length} Sessions</span>
        </div>

        {sessions.length === 0 ? (
          <p className="text-zinc-600 text-sm">No sessions saved yet</p>
        ) : (
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {sessions.map((session, index) => (
              <div key={session.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
                <div className="flex items-center justify-between">
                  <p className="text-zinc-500 text-sm">Session #{sessions.length - index}</p>
                  <p className="text-green-400 font-mono text-lg">{session.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── TIMER ────────────────────────────────────────────────────
function Timer({ bgMode }) {
  const [inputMinutes, setInputMinutes] = useState(25)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isStarted, setIsStarted] = useState(false)
  const [isDone, setIsDone] = useState(false)

  // For background-off mode: track when tab was hidden
  const hiddenAtRef = useRef(null)
  const pausedByVisibilityRef = useRef(false)

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

  // Visibility change for Timer
  useEffect(() => {
    const handleVisibility = () => {
      if (bgMode) return // background mode ON → run freely

      if (document.hidden && isRunning) {
        // Tab hidden → pause and note when
        hiddenAtRef.current = Date.now()
        setIsRunning(false)
        pausedByVisibilityRef.current = true
      } else if (!document.hidden && pausedByVisibilityRef.current) {
        // Tab visible again → resume (no time adjustment — time didn't pass)
        setIsRunning(true)
        hiddenAtRef.current = null
        pausedByVisibilityRef.current = false
      }
    }

    document.addEventListener("visibilitychange", handleVisibility)
    return () => document.removeEventListener("visibilitychange", handleVisibility)
  }, [bgMode, isRunning])

  const handleStart = () => {
    const totalSeconds = Number(inputMinutes) * 60
    if (totalSeconds <= 0) return
    setSecondsLeft(totalSeconds)
    setIsStarted(true)
    setIsDone(false)
    setIsRunning(true)
    pausedByVisibilityRef.current = false
  }

  const handlePauseResume = () => setIsRunning((prev) => !prev)

  const handleReset = () => {
    setIsRunning(false)
    setIsStarted(false)
    setIsDone(false)
    setSecondsLeft(0)
    pausedByVisibilityRef.current = false
    hiddenAtRef.current = null
  }

  const addExtraTime = (mins) => setSecondsLeft((prev) => prev + mins * 60)

  const hours = Math.floor(secondsLeft / 3600)
  const minutes = Math.floor((secondsLeft % 3600) / 60)
  const seconds = secondsLeft % 60

  const display = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`

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

          <p className={`text-sm text-center font-semibold tracking-wide ${isDone ? "text-green-400" : isRunning ? "text-green-300" : "text-zinc-500"}`}>
            {isDone ? "SESSION COMPLETE" : isRunning ? "DEEP WORK ACTIVE" : "PAUSED"}
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={handleReset} className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-all font-semibold">
              Reset
            </button>
            {!isDone && (
              <button onClick={handlePauseResume} className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-400 text-black transition-all font-bold">
                {isRunning ? "Pause" : "Resume"}
              </button>
            )}
          </div>

          {!isDone && (
            <div className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
              <p className="text-zinc-400 text-sm mb-4 text-center font-medium">Add Extra Focus Time</p>
              <div className="grid grid-cols-3 gap-3">
                {[5, 10, 15].map((m) => (
                  <button
                    key={m}
                    onClick={() => addExtraTime(m)}
                    className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-all font-semibold"
                  >
                    +{m} Min
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}