import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiX } from 'react-icons/fi';
import './Modal.css';

export default function Modal({ open, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (open) {
      document.addEventListener('keydown', handler);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal modal--${size} animate-scaleIn`} onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h3 className="modal__title">{title}</h3>
          <button className="modal__close" onClick={onClose}><FiX /></button>
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </div>,
    document.body
  );
}
