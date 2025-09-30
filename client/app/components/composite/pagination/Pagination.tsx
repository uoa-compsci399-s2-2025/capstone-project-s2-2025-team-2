interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
     const getPageNumbers = () => {

     const pages = []
     const showPaginationStart = currentPage > 2
     const showPaginationEnd = currentPage < totalPages - 2
     if (totalPages <=5) {
          for (let i = 1; i <= totalPages; i++) {
               pages.push(i)
          }
     } else {
          pages.push(1)
          if (showPaginationStart) {
        pages.push('...')
        const startPage = Math.max(2, currentPage - 1)
        const endPage = Math.min(totalPages - 1, currentPage + 1)

        for (let i = startPage; i <= endPage; i++) {
          pages.push(i)
        }
        if (showPaginationEnd) {
          pages.push('...')
        }
        pages.push(totalPages)
      }
     return pages
  }
}
   const pages = getPageNumbers()         
  return (
    <div>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4"
      >
        Previous
      </button>
      <span className="px-4">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4"
      >
        Next
      </button>
    </div>
  )
}
