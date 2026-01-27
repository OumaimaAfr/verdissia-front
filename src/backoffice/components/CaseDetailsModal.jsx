import React from 'react';

function CaseDetailsModal({ open, dossier, onClose }) {
    if (!open || !dossier) return null;
    const c = dossier.client;

    return (
        <div className="modal-backdrop">
            <div className="modal" role="dialog" aria-modal="true" aria-labelledby="caseTitle">
                <div className="modal-header">
                    <h3 id="caseTitle">Détails du dossier {dossier.id}</h3>
                    <button onClick={onClose} aria-label="Fermer">×</button>
                </div>

                <div className="modal-body">
                    <section>
                        <h4>Identité</h4>
                        <ul>
                            <li><strong>Nom & Prénom :</strong> {c.prenom} {c.nom}</li>
                            <li><strong>CIN :</strong> {c.cin}</li>
                            <li><strong>Date de naissance :</strong> {c.dateNaissance}</li>
                        </ul>
                    </section>

                    <section>
                        <h4>Contact</h4>
                        <ul>
                            <li><strong>Téléphone :</strong> {c.tel}</li>
                            <li><strong>Email :</strong> {c.email}</li>
                            <li><strong>Adresse :</strong> {c.adresse}, {c.ville}</li>
                        </ul>
                    </section>

                    {dossier.rejectionReason && (
                        <section>
                            <h4>Motif de rejet</h4>
                            <p>{dossier.rejectionReason}</p>
                        </section>
                    )}
                </div>

                <div className="modal-actions">
                    <button onClick={onClose}>Fermer</button>
                </div>
            </div>
        </div>
    );
}
