import { useState, useEffect } from "react"

export function usePageSize() {
  const [pageSize, setPageSize] = useState(8)

  useEffect(() => {
    const updatePageSize = () => {
      if (window.innerWidth > 1700) {
        setPageSize(20)
      } else if (window.innerWidth > 1550) {
        setPageSize(16)
      } else if (window.innerWidth > 1505) {
        setPageSize(15)
      } else if (window.innerWidth > 768) {
        setPageSize(12)
      } else {
        setPageSize(8)
      }
    }
    updatePageSize()
    window.addEventListener("resize", updatePageSize)
    return () => window.removeEventListener("resize", updatePageSize)
  }, [])

  return pageSize
}
