import React from 'react';
 
interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}
 
function Modal({ children, onClose }: ModalProps) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <dialog
        className="modal"
        open
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </dialog>
    </div>
  );
}
 
export default Modal;
 
 