import { useState, useEffect } from "react"
import { set } from "zod"

export function usePageSize() {
  const [pageSize, setPageSize] = useState(8)

  useEffect(() => {
    const updatePageSize = () => {
      if (window.innerWidth > 1805) {
        setPageSize(10)
      } else if (window.innerWidth > 1503) {
        setPageSize(8)
      } else if (window.innerWidth > 768) {
        setPageSize(6)
      } else {
        setPageSize(4)
      }
    }
    updatePageSize()
    window.addEventListener("resize", updatePageSize)
    return () => window.removeEventListener("resize", updatePageSize)
  }, [])

  return pageSize
}
