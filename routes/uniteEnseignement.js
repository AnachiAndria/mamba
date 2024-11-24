const express = require('express');
const { UniteEnseignement, ElementConstitutif, Chapitre, SousChapitre, Parcours } = require('../models');
const router = express.Router();

// Route pour ajouter une unité d'enseignement
router.post('/UE', async (req, res) => {
    let { nomUE, niveau,parcours_id } = req.body;
    parcours_id = parcours_id.parcours_id;
    try {
        const ue = await UniteEnseignement.create({ nomUE, niveau, parcours_id });
        res.status(201).json(ue);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la création de l\'unité d\'enseignement.' });
    }
});

// Route GET pour récupérer toutes les unités d'enseignement
router.get('/UE', async (req, res) => {
    try {
        // Fetch all UniteEnseignement records
        const unitesEnseignement = await UniteEnseignement.findAll();

        // Fetch all Parcours records
        const parcoursRecords = await Parcours.findAll({
            attributes: ['id', 'nom_parcours']
        });

        // Create a mapping of parcours_id to nom_parcours
        const parcoursMap = parcoursRecords.reduce((map, parcours) => {
            map[parcours.id] = parcours.nom_parcours;
            return map;
        }, {});

        // Map nom_parcours into each UniteEnseignement based on parcours_id
        const result = unitesEnseignement.map(ue => ({
            ...ue.toJSON(),
            nom_parcours: parcoursMap[ue.parcours_id] || null  // Add nom_parcours or null if not found
        }));

        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération des unités d\'enseignement.' + err });
    }
});

// Route GET pour récupérer une unité d'enseignement par son ID
router.get('/UE/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const ue = await UniteEnseignement.findByPk(id);

        if (ue) {
            res.status(200).json(ue);
        } else {
            res.status(404).json({ error: 'Unité d\'enseignement non trouvée.' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'unité d\'enseignement.' });
    }
});
// Route PUT pour mettre à jour une unité d'enseignement par son ID
router.put('/UE/:id', async (req, res) => {
    const { id } = req.params;
    const { nomUE, parcours_id } = req.body;

    try {
        const ue = await UniteEnseignement.findByPk(id);

        if (ue) {
            ue.nomUE = nomUE;
            ue.parcours_id = parcours_id;
            await ue.save();
            res.status(200).json(ue);
        } else {
            res.status(404).json({ error: 'Unité d\'enseignement non trouvée.' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'unité d\'enseignement.' });
    }
});
// Route DELETE pour supprimer une unité d'enseignement par son ID
router.delete('/UE/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const ue = await UniteEnseignement.findByPk(id);

        if (ue) {
            await ue.destroy();
            res.status(200).json({ message: 'Unité d\'enseignement supprimée avec succès.' });
        } else {
            res.status(404).json({ error: 'Unité d\'enseignement non trouvée.' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la suppression de l\'unité d\'enseignement.' });
    }
});


module.exports = router;
