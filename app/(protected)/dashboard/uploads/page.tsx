"use client"

import { useState, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function UploadForm({
  files,
  uploading,
  progress,
  status,
  onSubmit,
}: {
  files: File[]
  uploading: boolean
  progress: number
  status: string | null
  onSubmit: (mangaName: string, volume: string, tag: string) => void
}) {
  const [mangaName, setMangaName] = useState("")
  const [volume, setVolume] = useState("")
  const [tag, setTag] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(mangaName, volume, tag)
  }

  const isError = status?.startsWith("ERROR")

  return (
    <div className="flex h-full flex-col items-center justify-center bg-[#050300] p-8 font-mono">
      <div className="w-full max-w-[320px]">
        {/* header */}
        <div className="mb-10 text-center">
          <div className="text-[9px] tracking-[0.5em] text-orange-500/40 mb-2">
            DATA UPLINK
          </div>
          <div className="text-2xl font-black tracking-[0.3em] text-orange-500">
            UPLOAD
          </div>
          <div className="mt-3 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* series identifier */}
          <div>
            <label className="mb-2 block text-[9px] tracking-[0.4em] text-orange-500/50">
              SERIES IDENTIFIER
            </label>
            <input
              type="text"
              value={mangaName}
              onChange={(e) => setMangaName(e.target.value)}
              className="w-full border border-orange-500/25 bg-transparent px-4 py-3 font-mono text-sm tracking-widest text-orange-400 outline-none transition-colors placeholder:text-orange-500/15 focus:border-orange-500/70"
              placeholder="SERIES NAME"
              required
            />
          </div>

          {/* volume sequence */}
          <div>
            <label className="mb-2 block text-[9px] tracking-[0.4em] text-orange-500/50">
              VOLUME SEQUENCE
            </label>
            <input
              type="text"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              className="w-full border border-orange-500/25 bg-transparent px-4 py-3 font-mono text-sm tracking-widest text-orange-400 outline-none transition-colors placeholder:text-orange-500/15 focus:border-orange-500/70"
              placeholder="OPTIONAL"
            />
          </div>

          {/* classification tag */}
          <div>
            <label className="mb-2 block text-[9px] tracking-[0.4em] text-orange-500/50">
              CLASSIFICATION TAG
            </label>
            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full border border-orange-500/25 bg-transparent px-4 py-3 font-mono text-sm tracking-widest text-orange-400 outline-none transition-colors placeholder:text-orange-500/15 focus:border-orange-500/70"
              placeholder="OPTIONAL"
            />
          </div>

          {/* file count */}
          <div>
            <label className="mb-2 block text-[9px] tracking-[0.4em] text-orange-500/50">
              DATA PAYLOAD
            </label>
            {files.length > 0 && (
              <div className="text-[10px] text-orange-400">
                {files.length} FILE{files.length > 1 ? "S" : ""} SELECTED —{" "}
                {formatFileSize(files.reduce((a, f) => a + f.size, 0))}
              </div>
            )}
            {files.length === 0 && (
              <div className="text-[10px] text-orange-500/20">
                NO FILES SELECTED
              </div>
            )}
          </div>

          {/* submit */}
          <button
            type="submit"
            disabled={uploading || files.length === 0 || !mangaName.trim()}
            className="w-full border border-orange-500/40 py-3 text-[11px] font-black tracking-[0.4em] text-orange-500 transition-all hover:border-orange-500 hover:bg-orange-500/8 disabled:cursor-not-allowed disabled:opacity-25"
          >
            {uploading
              ? `TRANSFERRING — ${progress}%`
              : "INITIALIZE TRANSFER"}
          </button>
        </form>

        {/* status */}
        {status && (
          <div
            className={cn(
              "mt-4 text-center text-[10px] tracking-widest",
              isError ? "text-red-400" : "text-orange-400",
            )}
          >
            {status}
          </div>
        )}

        {/* footer */}
        <div className="mt-10 text-center">
          <div className="text-[9px] tracking-widest text-orange-500/15">
            SECURE CHANNEL — AES-256
          </div>
        </div>
      </div>
    </div>
  )
}

function DropZone({
  files,
  isDragging,
  progress,
  uploading,
  logLines,
  onDragOver,
  onDragLeave,
  onDrop,
  onSelectFiles,
  fileInputRef,
  onFileInputChange,
}: {
  files: File[]
  isDragging: boolean
  progress: number
  uploading: boolean
  logLines: string[]
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: () => void
  onDrop: (e: React.DragEvent) => void
  onSelectFiles: () => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
  onFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  const statusText = uploading
    ? progress === 100
      ? "COMPLETE"
      : "TRANSFERRING..."
    : "AWAITING INPUT..."

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-black p-8 font-mono select-none">
      {/* scanlines */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px)",
        }}
      />

      {/* vignette */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* drop zone — vertically centered */}
      <div className="flex flex-1 flex-col justify-center">
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={cn(
            "border-2 border-dashed p-12 text-center transition-colors",
            isDragging ? "border-orange-500/50" : "border-orange-500/20",
          )}
        >
          <div className="text-4xl text-orange-500/30">&#8593;</div>
          <div className="mt-3 text-[10px] tracking-[0.4em] text-orange-500/40">
            DROP FILES HERE
          </div>
          <div className="mt-1 text-[9px] text-orange-500/20">
            CBZ, CBR, PDF, ZIP
          </div>

          {/* select files button */}
          <button
            type="button"
            onClick={onSelectFiles}
            className="mt-6 border border-orange-500/40 px-6 py-3 text-[11px] font-black tracking-[0.4em] text-orange-500 transition-all hover:border-orange-500 hover:bg-orange-500/8"
          >
            SELECT FILES
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".cbz,.cbr,.pdf,.zip"
            onChange={onFileInputChange}
            className="hidden"
          />
        </div>

        {/* file list */}
        {files.length > 0 && (
          <div className="mt-4 space-y-1">
            {files.map((file, i) => (
              <div key={i} className="text-[10px] text-orange-400">
                {file.name}{" "}
                <span className="text-orange-500/40">
                  ({formatFileSize(file.size)})
                </span>
              </div>
            ))}
          </div>
        )}

        {/* progress section */}
        <div className="mt-8">
          <div className="text-[9px] tracking-[0.4em] text-orange-500/40 mb-2">
            TRANSFER PROGRESS
          </div>
          <div className="h-1.5 w-full bg-orange-500/10">
            <div
              className="h-full bg-orange-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div className="text-[10px] font-bold text-orange-400 tabular-nums">
              {progress}%
            </div>
            <div className="text-[10px] text-orange-500/40">{statusText}</div>
          </div>
        </div>
      </div>

      {/* transfer log */}
      <div className="mt-6">
        <div className="text-[9px] tracking-[0.4em] text-orange-500/30 mb-2">
          TRANSFER LOG
        </div>
        <div className="space-y-px">
          {logLines.map((line, i) => (
            <div
              key={i}
              className="text-[10px] font-mono transition-all duration-300"
              style={{
                color: `rgba(251, 146, 60, ${0.1 + (i / Math.max(logLines.length, 1)) * 0.6})`,
              }}
            >
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [logLines, setLogLines] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const addLog = useCallback((line: string) => {
    const timestamp = new Date().toTimeString().slice(0, 8)
    setLogLines((prev) => [...prev.slice(-9), `[${timestamp}] ${line}`])
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const dropped = Array.from(e.dataTransfer.files)
      setFiles(dropped)
      addLog(`${dropped.length} file(s) received via drop`)
    },
    [addLog],
  )

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const selected = Array.from(e.target.files)
        setFiles(selected)
        addLog(`${selected.length} file(s) selected`)
      }
    },
    [addLog],
  )

  const handleSelectFiles = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleSubmit = useCallback(
    (mangaName: string, _volume: string, _tag: string) => {
      if (!mangaName.trim() || files.length === 0) return

      setUploading(true)
      setProgress(0)
      setStatus(null)
      addLog("Initializing secure transfer...")

      const formData = new FormData()
      formData.set("mangaName", mangaName.trim())
      for (const file of Array.from(files)) {
        formData.append("files", file)
      }

      const xhr = new XMLHttpRequest()

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const pct = Math.round((e.loaded / e.total) * 100)
          setProgress(pct)
          if (pct % 25 === 0 && pct > 0) {
            addLog(`Transfer progress: ${pct}%`)
          }
        }
      }

      xhr.onload = () => {
        setUploading(false)
        if (xhr.status >= 200 && xhr.status < 300) {
          setProgress(100)
          setStatus("TRANSFER COMPLETE — DATA INTEGRATED")
          addLog("Transfer complete")
          setFiles([])
          if (fileInputRef.current) fileInputRef.current.value = ""
        } else {
          setStatus("ERROR — TRANSFER FAILED")
          addLog("Transfer failed: server error")
        }
      }

      xhr.onerror = () => {
        setUploading(false)
        setStatus("ERROR — CONNECTION LOST")
        addLog("Connection error during transfer")
      }

      xhr.open("POST", "/api/upload")
      xhr.send(formData)
      addLog(`Uploading ${files.length} file(s) to ${mangaName.trim()}`)
    },
    [files, addLog],
  )

  return (
    <div className="flex h-full overflow-hidden bg-black">
      <div className="w-[45%] border-r border-orange-500/20">
        <UploadForm
          files={files}
          uploading={uploading}
          progress={progress}
          status={status}
          onSubmit={handleSubmit}
        />
      </div>
      <div className="w-[55%]">
        <DropZone
          files={files}
          isDragging={isDragging}
          progress={progress}
          uploading={uploading}
          logLines={logLines}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onSelectFiles={handleSelectFiles}
          fileInputRef={fileInputRef}
          onFileInputChange={handleFileInputChange}
        />
      </div>
    </div>
  )
}
