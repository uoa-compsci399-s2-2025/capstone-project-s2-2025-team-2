import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = "http://54.206.209.62:8000"

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  try {
    const params = await context.params
    const path = params.path.join("/")
    const url = new URL(request.url)
    const searchParams = url.searchParams.toString()
    const backendUrl = `${BACKEND_URL}/${path}${searchParams ? `?${searchParams}` : ""}`

    console.log("🔄 Proxying GET to:", backendUrl)

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(request.headers.get("authorization") && {
          Authorization: request.headers.get("authorization")!,
        }),
      },
    })

    console.log("Backend response status:", response.status)

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Proxy error:", error)
    return NextResponse.json(
      { error: "Proxy failed", details: error.message },
      { status: 500 },
    )
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  try {
    const params = await context.params
    const path = params.path.join("/")
    const body = await request.json()
    const backendUrl = `${BACKEND_URL}/${path}`

    console.log("Proxying POST to:", backendUrl)

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(request.headers.get("authorization") && {
          Authorization: request.headers.get("authorization")!,
        }),
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Backend error response:", errorText)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Proxy POST error:", error)
    console.log(error.stack)
    return NextResponse.json(
      { error: "Proxy POST failed", details: error.message },
      { status: 500 },
    )
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  try {
    const params = await context.params
    const path = params.path.join("/")
    const body = await request.json()
    const backendUrl = `${BACKEND_URL}/${path}`

    const response = await fetch(backendUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(request.headers.get("authorization") && {
          Authorization: request.headers.get("authorization")!,
        }),
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("❌ Proxy PUT error:", error)
    return NextResponse.json(
      { error: "Proxy PUT failed", details: error.message },
      { status: 500 },
    )
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  try {
    const params = await context.params
    const path = params.path.join("/")
    const backendUrl = `${BACKEND_URL}/${path}`

    console.log("🔄 Proxying PATCH to:", backendUrl)

    const bodyJson =
      request.headers.get("content-length") &&
      request.headers.get("content-length") !== "0"
        ? await request.json().catch(() => undefined)
        : undefined

    const response = await fetch(backendUrl, {
      method: "PATCH",
      headers: {
        ...(request.headers.get("authorization") && {
          Authorization: request.headers.get("authorization")!,
        }),
        ...(bodyJson && { "Content-Type": "application/json" }),
      },
      ...(bodyJson && { body: JSON.stringify(bodyJson) }),
    })

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("❌ Proxy PATCH error:", error)
    return NextResponse.json(
      { error: "Proxy PATCH failed", details: error.message },
      { status: 500 },
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  try {
    const params = await context.params
    const path = params.path.join("/")
    const backendUrl = `${BACKEND_URL}/${path}`

    const response = await fetch(backendUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(request.headers.get("authorization") && {
          Authorization: request.headers.get("authorization")!,
        }),
      },
    })

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Proxy DELETE error:", error)
    return NextResponse.json(
      { error: "Proxy DELETE failed", details: error.message },
      { status: 500 },
    )
  }
}
