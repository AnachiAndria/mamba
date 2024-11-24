const express = require('express');
const { Parcours, Mention } = require('../models');
const router = express.Router();

// Route pour ajouter un parcours
router.post('/parcours', async (req, res) => {
    let { nom_parcours, niveau, mention_id } = req.body;
    niveau = niveau.join(", ");
    try {
        const parcours = await Parcours.create({ nom_parcours, niveau, mention_id});
        res.status(201).json(parcours);
    } catch (err) {
        res.status(500).json({ error: 'Erreur de creation de parcours ',err });
    }
});

router.get('/parcours', async (req, res) => {
    try {
        const parcourss = await Parcours.findAll({
            include: [
                {
                    model: Mention,
                    as: 'Mention', // This alias is optional but can help for clarity in the response
                    attributes: ['nom_mention'], // Only include specific fields if desired
                }
            ],
        });
        res.status(200).json(parcourss);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération des parcourss.' });
    }
});

router.put('/parcours/:id', async (req, res) => {
    const { id } = req.params;
    const { nom_parcours, niveau, mention_id } = req.body;

    try {
        const parcours = await Parcours.findByPk(id);
        if (parcours) {
            parcours.nom_parcours = nom_parcours;
            parcours.niveau = niveau;
            parcours.mention_id = mention_id;
            await parcours.save();
            res.status(200).json(parcours);
        } else {
            res.status(404).json({ error: 'Parcours non trouvé.' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour du parcours.' });
    }
});

router.delete('/parcours/:id', async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    try {
        const parcours = await Parcours.findByPk(id);
        if (parcours) {
            await parcours.destroy();
            res.status(204).send(); // No content
        } else {
            res.status(404).json({ error: 'Parcours non trouvé.' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la suppression du parcours.' });
    }
});

module.exports = router;
