import { useState, useMemo } from "react"
export function usePagaination<T>(data: T[], pageSize: number) {
  const [currentPage, setCurrentPage] = useState(1)

  const currentData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize
    const lastPageIndex = firstPageIndex + pageSize
    return data.slice(firstPageIndex, lastPageIndex)
  }, [currentPage, data, pageSize])

  const totalPages = Math.ceil(data.length / pageSize)

  return {
    currentPage,
    setCurrentPage,
    currentData,
    totalPages,
    totalCount: data.length,
  }
}
