import { NextRequest, NextResponse } from "next/server"

// 你的后端地址
const BACKEND_URL = "http://54.206.209.62:8000"

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } },
) {
  try {
    const path = params.path.join("/")
    const url = new URL(request.url)
    const searchParams = url.searchParams.toString()
    const backendUrl = `${BACKEND_URL}/${path}${searchParams ? `?${searchParams}` : ""}`

    console.log("🔄 Proxying GET to:", backendUrl)

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    console.log("✅ Backend response status:", response.status)

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("❌ Proxy error:", error)
    return NextResponse.json({ error: "Proxy failed" }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } },
) {
  try {
    const path = params.path.join("/")
    const body = await request.json()
    const backendUrl = `${BACKEND_URL}/${path}`

    console.log("🔄 Proxying POST to:", backendUrl)

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("❌ Proxy POST error:", error)
    return NextResponse.json({ error: "Proxy POST failed" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } },
) {
  try {
    const path = params.path.join("/")
    const body = await request.json()
    const backendUrl = `${BACKEND_URL}/${path}`

    const response = await fetch(backendUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("❌ Proxy PUT error:", error)
    return NextResponse.json({ error: "Proxy PUT failed" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } },
) {
  try {
    const path = params.path.join("/")
    const backendUrl = `${BACKEND_URL}/${path}`

    const response = await fetch(backendUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Proxy DELETE error:", error)
    return NextResponse.json({ error: "Proxy DELETE failed" }, { status: 500 })
  }
}
