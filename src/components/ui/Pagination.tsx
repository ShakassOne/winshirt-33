
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showInfo?: boolean;
  totalItems?: number;
  itemsPerPage?: number;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showInfo = true,
  totalItems,
  itemsPerPage,
  className,
}) => {
  const getVisiblePages = () => {
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages();
  const startItem = (currentPage - 1) * (itemsPerPage || 20) + 1;
  const endItem = Math.min(currentPage * (itemsPerPage || 20), totalItems || 0);

  return (
    <div className={cn('flex flex-col sm:flex-row items-center justify-between gap-4', className)}>
      {showInfo && totalItems && (
        <div className="text-sm text-white/70">
          Affichage de <span className="font-medium">{startItem}</span> à{' '}
          <span className="font-medium">{endItem}</span> sur{' '}
          <span className="font-medium">{totalItems}</span> résultats
        </div>
      )}

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="bg-white/5 border-white/10 hover:bg-white/10"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only sm:ml-2">Précédent</span>
        </Button>

        {visiblePages.map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <div className="px-3 py-2">
                <MoreHorizontal className="h-4 w-4 text-white/50" />
              </div>
            ) : (
              <Button
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page as number)}
                className={cn(
                  "min-w-[2.5rem]",
                  currentPage === page
                    ? "bg-gradient-to-r from-winshirt-purple to-winshirt-blue"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                )}
              >
                {page}
              </Button>
            )}
          </React.Fragment>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="bg-white/5 border-white/10 hover:bg-white/10"
        >
          <span className="sr-only sm:not-sr-only sm:mr-2">Suivant</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
