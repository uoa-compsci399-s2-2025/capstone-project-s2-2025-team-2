import { useState, useEffect } from "react"

export function usePageSize() {
  const [pageSize, setPageSize] = useState(8)

  useEffect(() => {
    const updatePageSize = () => {
      if (window.innerWidth > 1805) {
        setPageSize(15)
      } else if (window.innerWidth > 1503) {
        setPageSize(16)
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
