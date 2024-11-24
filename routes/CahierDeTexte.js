const express = require('express');
const { CahierDeTexte } = require('../models');
const router = express.Router();

// Route pour ajouter un cahier de texte
router.post('/cahier-de-texte', async (req, res) => {
    const {  dateCours, heureDebut, heureFin, descriptionCours, element_constitutif_id, sous_chapitre_id } = req.body;

    try {
        const cahierDeTexte = await CahierDeTexte.create({
            
            dateCours,
            heureDebut,
            heureFin,
            descriptionCours,
            element_constitutif_id,
            sous_chapitre_id
        });
        res.status(201).json(cahierDeTexte);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la création du cahier de texte:'+err });
    }
});

// Route pour récupérer tous les cahiers de texte
router.get('/cahier-de-texte', async (req, res) => {
    try {
        const cahiersDeTexte = await CahierDeTexte.findAll();
        res.status(200).json(cahiersDeTexte);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération des cahiers de texte.' });
    }
});

// Route pour récupérer un cahier de texte par ID
router.get('/cahier-de-texte/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const cahierDeTexte = await CahierDeTexte.findByPk(id);
        if (cahierDeTexte) {
            res.status(200).json(cahierDeTexte);
        } else {
            res.status(404).json({ error: 'Cahier de texte non trouvé.' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération du cahier de texte.' });
    }
});

// Route pour mettre à jour un cahier de texte par ID
router.put('/cahier-de-texte/:id', async (req, res) => {
    const { id } = req.params;
    const {  dateCours, heureDebut, heureFin, descriptionCours, element_constitutif_id, sous_chapitre_id } = req.body;

    try {
        const cahierDeTexte = await CahierDeTexte.findByPk(id);
        if (cahierDeTexte) {
            cahierDeTexte.dateCours = dateCours;
            cahierDeTexte.heureDebut = heureDebut;
            cahierDeTexte.heureFin = heureFin;
            cahierDeTexte.descriptionCours = descriptionCours;
            cahierDeTexte.element_constitutif_id = element_constitutif_id;
            cahierDeTexte.sous_chapitre_id = sous_chapitre_id;
            await cahierDeTexte.save();
            res.status(200).json(cahierDeTexte);
        } else {
            res.status(404).json({ error: 'Cahier de texte non trouvé.' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour du cahier de texte.' });
    }
});

// Route pour supprimer un cahier de texte par ID
router.delete('/cahier-de-texte/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const cahierDeTexte = await CahierDeTexte.findByPk(id);
        if (cahierDeTexte) {
            await cahierDeTexte.destroy();
            res.status(204).send(); // No content
        } else {
            res.status(404).json({ error: 'Cahier de texte non trouvé.' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la suppression du cahier de texte.' });
    }
});

module.exports = router;
