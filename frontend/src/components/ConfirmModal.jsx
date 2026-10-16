const ConfirmModal = ({ open, title, message, confirmLabel = "Confirm", onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <dialog className="modal modal-open" role="alertdialog" aria-modal="true" aria-label={title}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">{title}</h3>
        {message && <p className="py-3 text-base-content/70">{message}</p>}
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onCancel} autoFocus>
            Cancel
          </button>
          <button className="btn btn-error" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onCancel} />
    </dialog>
  );
};

export default ConfirmModal;
