'use client';

import { Pagination as BootstrapPagination } from 'react-bootstrap';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
}) => {
  const getPageNumbers = () => {
    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(currentPage - half, 1);
    let end = Math.min(start + maxVisiblePages - 1, totalPages);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(end - maxVisiblePages + 1, 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const pageNumbers = getPageNumbers();

  return (
    <BootstrapPagination className="justify-content-center mt-4">
      <BootstrapPagination.First
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      />
      <BootstrapPagination.Prev
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />

      {!pageNumbers.includes(1) && (
        <>
          <BootstrapPagination.Item
            active={1 === currentPage}
            onClick={() => onPageChange(1)}
          >
            1
          </BootstrapPagination.Item>
          {pageNumbers[0] > 2 && <BootstrapPagination.Ellipsis disabled />}
        </>
      )}

      {pageNumbers.map((number) => (
        <BootstrapPagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => onPageChange(number)}
        >
          {number}
        </BootstrapPagination.Item>
      ))}

      {!pageNumbers.includes(totalPages) && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
            <BootstrapPagination.Ellipsis disabled />
          )}
          <BootstrapPagination.Item
            active={totalPages === currentPage}
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </BootstrapPagination.Item>
        </>
      )}

      <BootstrapPagination.Next
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
      <BootstrapPagination.Last
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      />
    </BootstrapPagination>
  );
};

export default Pagination;
