import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

dayjs.locale('fr');

function textOrDash(v) { return (v ?? '') === '' || v === null ? '—' : String(v); }

export function openAndDownloadContract(record, options = {}) {
    const {
        provider = {
            name: 'Verdissia Énergie',
            siret: 'SIRET 123 456 789 00012',
            address: '10 Rue de l’Énergie, 75000 Paris',
            phone: '+33 1 23 45 67 89',
            email: 'support@verdissia.com',
        },
        footerNote = 'Document généré électroniquement. Toute reproduction totale ou partielle est interdite sans accord préalable.',
    } = options;

    const {
        civilite, nom, prenom, voie, codePostal, ville, email, telephone,
        typeEnergie, offre, libelleOffre, dateMiseEnService, prix,
        numeroContrat
    } = record;

    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(provider.name, 40, 50);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`${provider.address}`, 40, 70);
    doc.text(`${provider.phone} • ${provider.email}`, 40, 85);
    doc.text(`${provider.siret}`, 40, 100);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('Contrat de fourniture d’énergie', pageWidth / 2, 140, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Numéro de dossier : ${textOrDash(numeroContrat)}`, 40, 170);
    doc.text(`Date d’émission : ${dayjs().format('DD MMMM YYYY')}`, 40, 190);

    autoTable(doc, {
        startY: 210,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 6 },
        head: [['Parties au contrat', 'Coordonnées']],
        body: [
            ['Client', `${textOrDash(civilite)} ${textOrDash(prenom)} ${textOrDash(nom)}\n${textOrDash(voie)}\n${textOrDash(codePostal)} ${textOrDash(ville)}\n${textOrDash(email)}\n${textOrDash(telephone)}`],
            ['Fournisseur', `${provider.name}\n${provider.address}\n${provider.phone}\n${provider.email}\n${provider.siret}`],
        ],
    });

    autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 16,
        theme: 'grid',
        head: [['Éléments du contrat', 'Valeur']],
        styles: { fontSize: 10, cellPadding: 6 },
        body: [
            ['Type d’énergie', textOrDash(typeEnergie)],
            ['Offre', [textOrDash(offre), libelleOffre ? `(${libelleOffre})` : ''].join(' ').trim()],
            ['Prix mensuel estimé (€ TTC / Mois)', (prix != null ? Number(prix).toFixed(2) : '—')],
            ['Date mise en service (prévue)', textOrDash(dateMiseEnService)],
        ],
    });

    autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 16,
        theme: 'plain',
        styles: { fontSize: 10, cellPadding: 4 },
        body: [
            [{ content: 'Conditions principales', styles: { fontStyle: 'bold', fontSize: 12 } }],
            ['• Le contrat prend effet à la date de mise en service indiquée, sous réserve de validation technique et administrative.'],
            ['• Les tarifs peuvent évoluer conformément aux dispositions réglementaires et aux Conditions Générales de Vente (CGV).'],
            ['• Le client s’engage à fournir des informations exactes et à signaler tout changement de situation.'],
            ['• Droit de rétractation de 14 jours à compter de la signature si applicable (voir CGV).'],
            ['• La facturation s’effectue mensuellement sur la base de la consommation réelle ou estimée.'],
        ],
    });

    autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 24,
        theme: 'plain',
        styles: { fontSize: 10 },
        body: [
            [{ content: 'Signatures', styles: { fontStyle: 'bold', fontSize: 12 } }],
            ['Fait à ........................................, le ..............................'],
            ['Signature du client :'],
            ['\n\n\n____________________________________________'],
            ['Signature du fournisseur :'],
            ['\n\n\n____________________________________________'],
        ],
    });

    doc.setFontSize(9);
    doc.setTextColor('#888');
    doc.text(footerNote, 40, doc.internal.pageSize.getHeight() - 30);

    const fileName = `Contrat_${textOrDash(prenom)}_${textOrDash(nom)}_${textOrDash(numeroContrat)}.pdf`.replace(/\s+/g, '_');
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    window.open(url);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
}
