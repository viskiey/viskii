import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { fileName } = await request.json()

    if (!fileName) {
      return NextResponse.json({ error: "File name is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Increment the download count
    const { data, error } = await supabase.rpc("increment_download", { file_name_param: fileName })

    if (error) {
      // If RPC doesn't exist, fall back to manual update
      const { data: currentData } = await supabase
        .from("download_counts")
        .select("count")
        .eq("file_name", fileName)
        .single()

      const newCount = (currentData?.count || 0) + 1

      const { error: updateError } = await supabase
        .from("download_counts")
        .update({ count: newCount, updated_at: new Date().toISOString() })
        .eq("file_name", fileName)

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 })
      }

      return NextResponse.json({ count: newCount })
    }

    return NextResponse.json({ count: data })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.from("download_counts").select("file_name, count")

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Convert array to object for easier lookup
    const counts: Record<string, number> = {}
    data?.forEach((item) => {
      counts[item.file_name] = item.count
    })

    return NextResponse.json(counts)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
