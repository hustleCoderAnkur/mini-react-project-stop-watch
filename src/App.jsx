import { useEffect, useRef, useState } from "react"

// ─── HACKER TERMINAL BACKGROUND ───────────────────────────────
const HACKER_LINES = [
  // ── SHORT ──
  () => `[OK]`,
  () => `[SYS]   done.`,
  () => `[NET]   timeout.`,
  () => `[IO]    flushed.`,
  () => `[DB]    locked.`,
  () => `[AUTH]  denied.`,
  () => `[WARN]  retry ${rand(1, 5)}`,
  () => `[SYS]   reboot?`,
  () => `[PROC]  killed.`,
  () => `[NET]   lost.`,
  () => `[LOG]   queued.`,
  () => `[INFO]  ready.`,
  () => `[DISK]  full.`,
  () => `[SYS]   idle.`,
  () => `[IO]    seek.`,

  // ── MEDIUM ──
  () => `[SYS]   booting kernel module v${rand(2, 5)}.${rand(0, 99)}.${rand(0, 99)}...`,
  () => `[NET]   scanning ${randIP()} — port ${rand(1024, 65535)} open`,
  () => `[INFO]  connected to node-${rand(10, 99)}.cluster.local`,
  () => `[PROC]  spawning worker thread ${rand(1000, 9999)} — OK`,
  () => `[DISK]  read ${rand(1, 999)}MB from /dev/sda${rand(1, 4)} in ${rand(1, 200)}ms`,
  () => `[AUTH]  session token refreshed — expires in ${rand(300, 3600)}s`,
  () => `[NET]   packet loss ${rand(0, 5)}.${rand(0, 9)}% on eth${rand(0, 3)}`,
  () => `[SYS]   CPU ${rand(0, 7)} @ ${rand(40, 99)}% — temp ${rand(45, 85)}°C`,
  () => `[DB]    query executed in ${rand(1, 800)}ms — ${rand(0, 9999)} rows`,
  () => `[LOG]   ${randTimestamp()} request from ${randIP()} — 200 OK`,
  () => `[NET]   ping ${randIP()} — TTL=${rand(40, 128)} time=${rand(1, 200)}ms`,
  () => `[SYS]   mem usage: ${rand(30, 90)}% — swap: ${rand(0, 50)}%`,
  () => `[CRON]  job #${rand(100, 999)} completed in ${rand(1, 60)}s`,
  () => `[IO]    writing ${rand(1, 512)}KB to /tmp/cache_${randHex(4)}`,
  () => `[NET]   DNS resolved ${randIP()} in ${rand(1, 80)}ms`,
  () => `[SYS]   uptime: ${rand(1, 999)}d ${rand(0, 23)}h ${rand(0, 59)}m`,
  () => `[LOG]   ${randTimestamp()} websocket closed — code 1000`,
  () => `[PROC]  garbage collected — freed ${rand(10, 500)}MB`,
  () => `[NET]   SSL handshake with ${randIP()}:443 — TLS 1.3`,
  () => `[SYS]   load average: ${rand(0, 8)}.${rand(0, 99)} ${rand(0, 8)}.${rand(0, 99)} ${rand(0, 8)}.${rand(0, 99)}`,
  () => `[DB]    index rebuilt — ${rand(1000, 999999)} entries`,
  () => `[IO]    /var/log/syslog rotated — ${rand(1, 50)}MB archived`,
  () => `[NET]   retransmit on seq ${rand(100000, 999999)} — window ${rand(8, 65)}KB`,
  () => `[AUTH]  user session #${rand(1000, 9999)} validated`,
  () => `[SYS]   signal SIGTERM received by pid ${rand(1000, 32000)}`,
  () => `[PROC]  fork() — child pid ${rand(1000, 32000)} started`,
  () => `[NET]   route updated: ${randIP()}/24 via ${randIP()}`,
  () => `[LOG]   ${randTimestamp()} cache hit ratio: ${rand(70, 99)}.${rand(0, 9)}%`,
  () => `[SYS]   watchdog: all services healthy`,
  () => `[IO]    stream buffer flushed — ${rand(1, 999)}KB written`,
  () => `[PROC]  inode ${rand(100000, 999999)} allocated on /dev/sda${rand(1, 4)}`,
  () => `[NET]   keepalive sent to ${randIP()} — ack received`,
  () => `[DB]    vacuum complete — ${rand(1, 500)}MB reclaimed`,
  () => `[SYS]   entropy pool: ${rand(100, 4096)} bits available`,
  () => `[AUTH]  2FA verified for uid ${rand(1000, 9999)} — granted`,
  () => `[CRON]  scheduler tick at ${randTimestamp()} — ${rand(1, 12)} jobs pending`,
  () => `[IO]    fsync /var/data/block_${rand(1000, 9999)}.bin — OK`,
  () => `[NET]   MTU set to ${rand(1400, 9000)} on interface eth${rand(0, 3)}`,
  () => `[SYS]   context switch rate: ${rand(1000, 99999)}/s`,
  () => `[LOG]   ${randTimestamp()} 404 not found — ${randIP()} /api/v${rand(1, 4)}/data`,
  () => `[PROC]  mmap ${rand(1, 256)}MB at 0x${randHex(8)} — prot RWXP`,
  () => `[DISK]  SMART status: reallocated sectors = ${rand(0, 5)}`,
  () => `[NET]   BGP peer ${randIP()} — ${rand(1000, 9999)} prefixes received`,
  () => `[DB]    deadlock detected — transaction ${rand(1000, 9999)} rolled back`,
  () => `[SYS]   OOM killer invoked — freed ${rand(50, 800)}MB`,
  () => `[IO]    journal commit seq ${rand(10000, 99999)} — ${rand(1, 64)} blocks`,

  // ── LONG ──
  () => `[NET]   [${randTimestamp()}] ESTABLISHED tcp ${randIP()}:${rand(1024, 9999)} -> ${randIP()}:443 via gateway ${randIP()} — bytes sent: ${rand(1000, 999999)} recv: ${rand(1000, 999999)}`,
  () => `[SYS]   [${randTimestamp()}] kernel: CPU${rand(0, 7)} performance counters — cycles: ${rand(100000, 9999999)}  instructions: ${rand(100000, 9999999)}  IPC: ${rand(0, 3)}.${rand(10, 99)}  branch-misses: ${rand(0, 5)}.${rand(0, 99)}%`,
  () => `[DB]    [${randTimestamp()}] slow query log: SELECT * FROM events WHERE ts > NOW() - INTERVAL '${rand(1, 30)} days' AND node_id = ${rand(1, 999)} ORDER BY ts DESC LIMIT ${rand(10, 1000)}  — ${rand(500, 9999)}ms  rows_examined: ${rand(10000, 9999999)}`,
  () => `[PROC]  [${randTimestamp()}] process tree snapshot — pid ${rand(1000, 9999)} (node) children: [${rand(1000, 9999)}, ${rand(1000, 9999)}, ${rand(1000, 9999)}]  rss: ${rand(50, 2000)}MB  virt: ${rand(100, 8000)}MB  fds: ${rand(10, 1024)}  threads: ${rand(1, 64)}`,
  () => `[NET]   [${randTimestamp()}] traceroute to ${randIP()}: hop 1 ${randIP()} ${rand(1, 5)}ms  hop 2 ${randIP()} ${rand(5, 20)}ms  hop 3 ${randIP()} ${rand(10, 80)}ms  hop 4 ${randIP()} ${rand(20, 200)}ms  hop 5 ${randIP()} ${rand(30, 300)}ms`,
  () => `[LOG]   [${randTimestamp()}] access_log: ${randIP()} - - "GET /api/v${rand(1, 4)}/metrics?node=${rand(1, 99)}&window=${rand(60, 3600)}&format=json HTTP/2.0" 200 ${rand(100, 99999)} "${randIP()}" "node-fetch/${rand(2, 4)}.${rand(0, 9)}.${rand(0, 9)}"`,
  () => `[SYS]   [${randTimestamp()}] /proc/meminfo snapshot — MemTotal: ${rand(8, 256)}GB  MemFree: ${rand(1, 64)}GB  Cached: ${rand(1, 128)}GB  SwapTotal: ${rand(2, 32)}GB  SwapFree: ${rand(0, 32)}GB  Dirty: ${rand(0, 500)}MB  Writeback: ${rand(0, 100)}MB`,
  () => `[IO]    [${randTimestamp()}] block device stats /dev/sda — reads: ${rand(1000, 999999)}  writes: ${rand(1000, 999999)}  read_kb: ${rand(100000, 9999999)}  write_kb: ${rand(100000, 9999999)}  await: ${rand(0, 50)}.${rand(0, 9)}ms  util: ${rand(0, 100)}.${rand(0, 9)}%`,
  () => `[AUTH]  [${randTimestamp()}] audit: uid=${rand(1000, 9999)} gid=${rand(100, 999)} auid=${rand(1000, 9999)} ses=${rand(1, 999)} op=PAM:session_open grantors=pam_loginuid,pam_keyinit,pam_limits,pam_unix res=success`,
  () => `[CRON]  [${randTimestamp()}] batch job pipeline: stage[1/4] data_fetch — OK ${rand(10, 999)}ms | stage[2/4] transform — OK ${rand(50, 2000)}ms | stage[3/4] validate — OK ${rand(10, 500)}ms | stage[4/4] write_db — OK ${rand(20, 800)}ms | total: ${rand(100, 5000)}ms rows: ${rand(100, 9999999)}`,
  () => `[NET]   [${randTimestamp()}] firewall rule hit: src=${randIP()} dst=${randIP()} proto=TCP sport=${rand(1024, 65535)} dport=${rand(1, 1024)} flags=SYN,ACK action=ACCEPT chain=FORWARD policy=DROP in=eth${rand(0, 3)} out=eth${rand(0, 3)} len=${rand(40, 1500)}`,
  () => `[DB]    [${randTimestamp()}] replication lag report — primary: ${randIP()} replica[0]: ${randIP()} lag=${rand(0, 500)}ms replica[1]: ${randIP()} lag=${rand(0, 2000)}ms replica[2]: ${randIP()} lag=${rand(0, 100)}ms  binlog_pos: ${rand(100000, 9999999)}`,
  () => `[SYS]   [${randTimestamp()}] systemd unit health — nginx.service: active(running) ${rand(1, 999)}d  redis.service: active(running) ${rand(1, 999)}d  postgres.service: active(running) ${rand(1, 999)}d  node-app.service: active(running) ${rand(0, 30)}h`,
  () => `[PROC]  [${randTimestamp()}] scheduler: runqueue depth ${rand(0, 32)}  voluntary_ctxsw: ${rand(1000, 999999)}/s  involuntary_ctxsw: ${rand(100, 99999)}/s  migration_cost: ${rand(1, 500)}us  idle_cpus: ${rand(0, 7)}/${rand(8, 64)}`,
  () => `[IO]    [${randTimestamp()}] NFS mount stats — server: ${randIP()}:/exports/data  ops/s: ${rand(100, 9999)}  read_bw: ${rand(10, 1000)}MB/s  write_bw: ${rand(10, 500)}MB/s  rtt_avg: ${rand(1, 50)}ms  retrans: ${rand(0, 100)}`,
  () => `[NET]   [${randTimestamp()}] load balancer upstream check — node-${rand(1, 9)}: ${randIP()}:${rand(3000, 9000)} healthy ${rand(10, 500)}ms | node-${rand(1, 9)}: ${randIP()}:${rand(3000, 9000)} healthy ${rand(10, 500)}ms | node-${rand(1, 9)}: ${randIP()}:${rand(3000, 9000)} degraded ${rand(500, 5000)}ms`,
]

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }
function randIP() { return `${rand(1, 254)}.${rand(0, 255)}.${rand(0, 255)}.${rand(1, 254)}` }
function randHex(n) { return [...Array(n)].map(() => Math.floor(Math.random() * 16).toString(16)).join('') }
function randTimestamp() { return `${String(rand(0, 23)).padStart(2, '0')}:${String(rand(0, 59)).padStart(2, '0')}:${String(rand(0, 59)).padStart(2, '0')}` }

function HackerTerminal() {
  const containerRef = useRef(null)
  const timeoutsRef = useRef([])
  const intervalsRef = useRef([])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // How many lines fit on screen
    const lineHeight = 18
    const maxLines = Math.floor(window.innerHeight / lineHeight) + 5

    // Spawn a new line at random intervals
    const spawnLine = () => {
      const lineEl = document.createElement('div')
      const template = HACKER_LINES[rand(0, HACKER_LINES.length - 1)]
      const text = template()

      // Type the line char by char
      lineEl.textContent = ''
      lineEl.style.opacity = '0.85'
      container.appendChild(lineEl)

      // Keep max lines — remove oldest
      while (container.children.length > maxLines) {
        container.removeChild(container.firstChild)
      }

      // Scroll to bottom
      container.scrollTop = container.scrollHeight

      let i = 0
      const typeInterval = setInterval(() => {
        lineEl.textContent = text.slice(0, i + 1)
        i++
        if (i >= text.length) {
          clearInterval(typeInterval)
          const t = setTimeout(spawnLine, rand(80, 400))
          timeoutsRef.current.push(t)
        }
        container.scrollTop = container.scrollHeight
      }, rand(12, 40))

      intervalsRef.current.push(typeInterval)
    }

    const streams = rand(2, 4)
    for (let s = 0; s < streams; s++) {
      const t = setTimeout(spawnLine, s * rand(200, 800))
      timeoutsRef.current.push(t)
    }

    return () => {
      timeoutsRef.current.forEach(clearTimeout)
      intervalsRef.current.forEach(clearInterval)
    }
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw', height: '100vh',
        background: '#000',
        zIndex: 0,
        overflow: 'hidden',
        padding: '12px 16px',
        boxSizing: 'border-box',
      }}
    >
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: '12px',
          lineHeight: '18px',
          color: '#00ff88',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          textShadow: '0 0 8px #00ff88, 0 0 3px #00ff88',
          opacity: 0.75,
        }}
      />
    </div>
  )
}

// ─── APP ──────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState("stopwatch")
  const [bgMode, setBgMode] = useState(false)

  return (
    <div style={{ position: "relative" }} className="min-h-screen flex items-center justify-center text-white px-8 py-12">
      {/* Hacker Terminal Background */}
      <HackerTerminal />

      {/* Card — sits above canvas */}
      <div style={{ position: "relative", zIndex: 10 }} className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl p-4">

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

  useEffect(() => {
    const handleVisibility = () => {
      if (bgMode) return

      if (document.hidden && isRunning) {
        setSavedTime(Date.now() - startTime + savedTime)
        setIsRunning(false)
        pausedByVisibilityRef.current = true
      } else if (!document.hidden && pausedByVisibilityRef.current) {
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

  const display = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}:${String(milliseconds).padStart(2, "0")}`

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

  useEffect(() => {
    const handleVisibility = () => {
      if (bgMode) return

      if (document.hidden && isRunning) {
        hiddenAtRef.current = Date.now()
        setIsRunning(false)
        pausedByVisibilityRef.current = true
      } else if (!document.hidden && pausedByVisibilityRef.current) {
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