import './DeleteModal.css';

const WarnIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const DeleteModal = ({ productName, onConfirm, onCancel }) => (
  <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
    <div className="delete-modal">
      <div className="delete-icon"><WarnIcon /></div>
      <h2>Delete Product</h2>
      <p>
        Are you sure you want to delete this Product?<br />
        <strong>"{productName}"</strong>
      </p>
      <p className="delete-warning">This action cannot be undone.</p>
      <div className="delete-actions">
        <button className="btn btn-outline" onClick={onCancel}>Cancel</button>
        <button className="btn btn-danger" onClick={onConfirm}>Delete</button>
      </div>
    </div>
  </div>
);

export default DeleteModal;