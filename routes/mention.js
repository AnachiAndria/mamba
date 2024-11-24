const express = require('express');
const { Mention, Parcours } = require('../models');
const router = express.Router();

// Route pour ajouter un mention
router.post('/mention', async (req, res) => {
    const { nom_mention } = req.body;

    try {
        const mention = await Mention.create({ nom_mention });
        res.status(201).json(mention);
    } catch (err) {
        res.status(500).json({ error: 'Erreur de creation de mention' });
    }
});

router.get('/mention', async (req, res) => {
    try {
        const mentions = await Mention.findAll({
            include: [
                {
                    model: Parcours,
                    as: 'Parcours', // This alias is optional but can help for clarity in the response
                    attributes: ['nom_parcours'], // Only include specific fields if desired
                }
            ],
        });
        res.status(200).json(mentions);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération des mentions.',error: err.message });
    }
});

router.put('/mention/:id', async (req, res) => {
    const { id } = req.params;
    const { nom_mention } = req.body;

    try {
        const mention = await Mention.findByPk(id);
        if (mention) {
            mention.nom_mention = nom_mention;
            await mention.save();
            res.status(200).json(mention);
        } else {
            res.status(404).json({ error: 'Mention non trouvé.' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour du mention.' });
    }
});

router.delete('/mention/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const mention = await Mention.findByPk(id);
        if (mention) {
            await mention.destroy();
            res.status(204).send(); // No content
        } else {
            res.status(404).json({ error: 'Mention non trouvé.' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la suppression du mention.' });
    }
});

module.exports = router;
