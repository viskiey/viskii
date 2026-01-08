"use client"

import { Download } from "lucide-react"
import { useState } from "react"

interface FileDownloadItemProps {
  name: string
  href: string
  initialCount: number
  colorClass: string
}

export function FileDownloadItem({ name, href, initialCount, colorClass }: FileDownloadItemProps) {
  const [count, setCount] = useState(initialCount)
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)

    // Increment count in database
    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: name }),
      })

      if (response.ok) {
        const data = await response.json()
        setCount(data.count)
      }
    } catch (error) {
      console.error("Failed to update download count")
    }

    // Trigger actual download
    const link = document.createElement("a")
    link.href = href
    link.download = name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setIsDownloading(false)
  }

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/50 ${colorClass} transition-colors group text-left disabled:opacity-50`}
    >
      <Download className={`h-4 w-4 opacity-60 group-hover:opacity-100 ${isDownloading ? "animate-bounce" : ""}`} />
      <span className="font-medium">{name}</span>
      <div className="ml-auto flex items-center gap-3">
        <span className="text-xs bg-background/50 px-2 py-1 rounded-full">{count} indirme</span>
        <span className="text-xs opacity-60 group-hover:opacity-100">{isDownloading ? "İndiriliyor..." : "İndir"}</span>
      </div>
    </button>
  )
}
