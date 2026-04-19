import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './Pagination.css';

export default function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '…') {
      pages.push('…');
    }
  }

  return (
    <nav className="pagination">
      <button className="page-btn" onClick={() => onPage(page - 1)} disabled={page === 1}>
        <FiChevronLeft />
      </button>
      {pages.map((p, idx) =>
        p === '…'
          ? <span key={`e${idx}`} className="page-ellipsis">…</span>
          : <button key={p} className={`page-btn${p === page ? ' active' : ''}`} onClick={() => onPage(p)}>{p}</button>
      )}
      <button className="page-btn" onClick={() => onPage(page + 1)} disabled={page === totalPages}>
        <FiChevronRight />
      </button>
    </nav>
  );
}
