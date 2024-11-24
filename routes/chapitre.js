const express = require('express');
const {  Chapitre } = require('../models');
const router = express.Router();

// Route pour ajouter un chapitre
router.post('/chapitre', async (req, res) => {
    const { titre, element_constitutif_id } = req.body;

    try {
        const chapitre = await Chapitre.create({ titre, element_constitutif_id });
        res.status(201).json(chapitre);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la création du chapitre.' });
    }
});

router.get('/chapitre', async (req, res) => {
    try {
        const chapitres = await Chapitre.findAll();
        res.status(200).json(chapitres);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération des chapitres.' });
    }
});

router.get('/chapitre/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const chapitre = await Chapitre.findByPk(id);
        if (chapitre) {
            res.status(200).json(chapitre);
        } else {
            res.status(404).json({ error: 'Chapitre non trouvé.' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération du chapitre.' });
    }
});

router.put('/chapitre/:id', async (req, res) => {
    const { id } = req.params;
    const { titre, element_constitutif_id } = req.body;

    try {
        const chapitre = await Chapitre.findByPk(id);
        if (chapitre) {
            chapitre.titre = titre;
            chapitre.element_constitutif_id = element_constitutif_id;
            await chapitre.save();
            res.status(200).json(chapitre);
        } else {
            res.status(404).json({ error: 'Chapitre non trouvé.' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour du chapitre.' });
    }
});

router.delete('/chapitre/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const chapitre = await Chapitre.findByPk(id);
        if (chapitre) {
            await chapitre.destroy();
            res.status(204).send(); // No content
        } else {
            res.status(404).json({ error: 'Chapitre non trouvé.' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la suppression du chapitre.' });
    }
});

module.exports = router;
