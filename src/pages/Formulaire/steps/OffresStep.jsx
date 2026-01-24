import React from "react";
import {Button, Checkbox, Tag, message, Alert} from "antd";
import {CheckCircleOutlined} from "@ant-design/icons";

function OffresStep({ offres = [], onValidate }) {
    const [selectedIds, setSelectedIds] = React.useState(new Set());
    const [editMode, setEditMode] = React.useState(false);
    const [errorMsg, setErrorMsg] = React.useState(null);

    React.useEffect(() => {
        const allIds = new Set((offres || []).map((o) => o.id));
        setSelectedIds(allIds);
    }, [offres]);

    const toggleSelect = (id) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const onClickValidate = () => {
        const selected = offres.filter((o) => selectedIds.has(o.id));
        if (selected.length === 0) {
            setErrorMsg("Veuillez conserver au moins une offre.");
            return;
        }
        setErrorMsg(null);
        onValidate?.(selected);
    };

    return (
        <div className="offres-step">
            <p className="description-step">Découvrez notre sélection d’offres taillées pour votre profil. Vous pouvez les modifier à tout moment en retirant celles qui ne correspondent pas à vos besoins.</p>
            <div className="offres-list">
                {offres.map((offre) => {
                    const id = offre.id;
                    const titre = offre.libelle;
                    const description = offre.description;
                    const prix = offre.prix;

                    const isSelected = selectedIds.has(id);

                    const onRowClick = () => {
                        if (!editMode) return;
                        toggleSelect(id);
                    };

                    return (
                        <div key={id} onClick={onRowClick}
                             style={{
                                 cursor: editMode ? "pointer" : "default",
                                 userSelect: "none",
                             }}
                             className={`offre-row ${isSelected ? "selected" : ""}`}>
                            <div className="offre-content">
                                <img className="offre-picto" src="/template-assets/pictos/offre1.png" alt="picto"/>
                                <div className="offre-infos">
                                    <div className="offre-titre-header">
                                        <div className="offre-titre">{titre}</div>
                                        {!editMode && isSelected && <Tag color="#43cae9" icon={<CheckCircleOutlined />} variant="solid">Sélectionnée</Tag>}
                                    </div>
                                    <div className="offre-descirption">{description}</div>
                                </div>
                            </div>
                            <div className="offre-prix-bloc">
                                <div className="offre-prix">{prix.toFixed(2)} €</div>
                                {editMode && (
                                    <Checkbox checked={isSelected} onChange={() => toggleSelect(id)} />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            {errorMsg && (
                <Alert
                    type="error"
                    description={errorMsg}
                    showIcon
                />
            )}
            <div className="buttons-wrapper">
                <Button type="primary" ghost onClick={() => setEditMode((e) => !e)}>
                    {editMode ? "Terminer" : "Modifier"}
                </Button>
                {!editMode &&
                    <Button type="primary" onClick={onClickValidate}>
                        Valider mes offres
                    </Button>
                }
            </div>
        </div>
    );
}

export default OffresStep;
