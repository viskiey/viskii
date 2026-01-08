import { Download, FileText, FileArchive } from "lucide-react"
import { FileDownloadItem } from "@/components/file-download-item"
import { createClient } from "@/lib/supabase/server"

const files = {
  batch: [
    { name: "j_player.bat", href: "/files/j_player.bat" },
    { name: "jw_player.bat", href: "/files/jw_player.bat" },
  ],
  text: [
    { name: "link.txt", href: "/files/link.txt" },
    { name: "link2.txt", href: "/files/link2.txt" },
    { name: "link3.txt", href: "/files/link3.txt" },
    { name: "link4.txt", href: "/files/link4.txt" },
  ],
  zip: [
    { name: "comment.zip", href: "/files/comment.zip" },
    { name: "comnent.zip", href: "/files/comnent.zip" },
  ],
}

async function getDownloadCounts(): Promise<Record<string, number>> {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from("download_counts").select("file_name, count")

    const counts: Record<string, number> = {}
    data?.forEach((item) => {
      counts[item.file_name] = item.count
    })
    return counts
  } catch {
    return {}
  }
}

export default async function Home() {
  const downloadCounts = await getDownloadCounts()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Download className="h-6 w-6 text-primary" />
            File Download
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Batch & Text Files */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="border-l-4 border-amber-500 px-6 py-4 bg-amber-500/5">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <FileText className="h-5 w-5 text-amber-500" />
                Batch & Text Files
              </h2>
            </div>
            <div className="p-6 grid gap-3">
              {[...files.batch, ...files.text].map((file) => (
                <FileDownloadItem
                  key={file.name}
                  name={file.name}
                  href={file.href}
                  initialCount={downloadCounts[file.name] || 0}
                  colorClass="hover:bg-primary hover:text-primary-foreground"
                />
              ))}
            </div>
          </div>

          {/* ZIP Files */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="border-l-4 border-emerald-500 px-6 py-4 bg-emerald-500/5">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <FileArchive className="h-5 w-5 text-emerald-500" />
                ZIP Files
              </h2>
            </div>
            <div className="p-6 grid gap-3">
              {files.zip.map((file) => (
                <FileDownloadItem
                  key={file.name}
                  name={file.name}
                  href={file.href}
                  initialCount={downloadCounts[file.name] || 0}
                  colorClass="hover:bg-emerald-600 hover:text-white"
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border/40 mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          File Download Portal
        </div>
      </footer>
    </div>
  )
}
