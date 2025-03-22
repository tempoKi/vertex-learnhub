
import { PaginationProps } from "@/types/activity-log";
import {
  Pagination as PaginationUI,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Pagination = ({ page, totalPages, onPageChange }: PaginationProps) => {
  // Don't render pagination if there's only one page
  if (totalPages <= 1) return null;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if there are fewer than maxVisiblePages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate range around current page
      const leftBound = Math.max(2, page - 1);
      const rightBound = Math.min(totalPages - 1, page + 1);
      
      // Add ellipsis after first page if needed
      if (leftBound > 2) {
        pages.push(-1); // -1 represents ellipsis
      }
      
      // Add pages around current page
      for (let i = leftBound; i <= rightBound; i++) {
        pages.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (rightBound < totalPages - 1) {
        pages.push(-2); // -2 represents ellipsis (using different key)
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <PaginationUI className="mt-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => page > 1 && onPageChange(page - 1)}
            className={page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            aria-disabled={page <= 1}
          />
        </PaginationItem>

        {pageNumbers.map((pageNumber, index) => (
          pageNumber < 0 ? (
            <PaginationItem key={pageNumber}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                isActive={pageNumber === page}
                onClick={() => onPageChange(pageNumber)}
                className="cursor-pointer"
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          )
        ))}

        <PaginationItem>
          <PaginationNext 
            onClick={() => page < totalPages && onPageChange(page + 1)}
            className={page >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            aria-disabled={page >= totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationUI>
  );
};

export default Pagination;
