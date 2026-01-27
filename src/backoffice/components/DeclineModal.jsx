import React, { useState } from 'react';

function DeclineModal({ open, onClose, onConfirm }) {
    const [reason, setReason] = useState('');
    const [touched, setTouched] = useState(false);

    if (!open) return null;

    const handleConfirm = () => {
        setTouched(true);
        if (!reason.trim()) return;
        onConfirm(reason.trim());
        setReason('');
        setTouched(false);
    };

    const handleClose = () => {
        setReason('');
        setTouched(false);
        onClose();
    };

    return (
        <div className="modal-backdrop">
            <div className="modal" role="dialog" aria-modal="true" aria-labelledby="declineTitle">
                <h3 id="declineTitle">Motif de rejet</h3>
                <p>Le motif est <strong>obligatoire</strong>.</p>
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    onBlur={() => setTouched(true)}
                    rows={4}
                    placeholder="Ex. pièces manquantes, incohérence d'identité, risque élevé..."
                    aria-invalid={touched && !reason.trim()}
                />
                {touched && !reason.trim() && (
                    <div className="error">Le motif est requis.</div>
                )}
                <div className="modal-actions">
                    <button onClick={handleClose}>Annuler</button>
                    <button className="btn-danger" onClick={handleConfirm}>Confirmer</button>
                </div>
            </div>
        </div>
    );
}

export default DeclineModal;
