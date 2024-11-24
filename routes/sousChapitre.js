const express = require('express');
const { SousChapitre } = require('../models');
const router = express.Router();

// Route pour ajouter un sous-chapitre
router.post('/sousChapitre', async (req, res) => {
    const { soustitre, chapitre_id } = req.body;

    try {
        const sousChapitre = await SousChapitre.create({ soustitre, chapitre_id });
        res.status(201).json(sousChapitre);
    } catch (err) {
        res.status(500).json({ error: soustitre + chapitre_id });
    }
});

router.get('/sousChapitre', async (req, res) => {
    try {
        const sousChapitres = await SousChapitre.findAll();
        res.status(200).json(sousChapitres);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération des sous-chapitres.' });
    }
});

router.put('/sousChapitre/:id', async (req, res) => {
    const { id } = req.params;
    const { soustitre, chapitre_id } = req.body;

    try {
        const sousChapitre = await SousChapitre.findByPk(id);
        if (sousChapitre) {
            sousChapitre.soustitre = soustitre;
            sousChapitre.chapitre_id = chapitre_id;
            await sousChapitre.save();
            res.status(200).json(sousChapitre);
        } else {
            res.status(404).json({ error: 'Sous-chapitre non trouvé.' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour du sous-chapitre.' });
    }
});

router.delete('/sousChapitre/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const sousChapitre = await SousChapitre.findByPk(id);
        if (sousChapitre) {
            await sousChapitre.destroy();
            res.status(204).send(); // No content
        } else {
            res.status(404).json({ error: 'Sous-chapitre non trouvé.' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la suppression du sous-chapitre.' });
    }
});

module.exports = router;

// const express = require('express');
// const { SousChapitre } = require('../models');
// const router = express.Router();

// // Route pour ajouter un sous-chapitre
// router.post('/sousChapitre', async (req, res) => {
//     const { soustitre, chapitre_id } = req.body;

//     try {
//         const sousChapitre = await SousChapitre.create({ soustitre, chapitre_id });
//         res.status(201).json(sousChapitre);
//     } catch (err) {
//         res.status(500).json({ error: soustitre + chapitre_id });
//     }
// });

// router.get('/sousChapitre', async (req, res) => {
//     try {
//         const sousChapitres = await SousChapitre.findAll();
//         res.status(200).json(sousChapitres);
//     } catch (err) {
//         res.status(500).json({ error: 'Erreur lors de la récupération des sous-chapitres.' });
//     }
// });

// router.put('/sousChapitre/:id', async (req, res) => {
//     const { id } = req.params;
//     const { soustitre, chapitre_id } = req.body;

//     try {
//         const sousChapitre = await SousChapitre.findByPk(id);
//         if (sousChapitre) {
//             sousChapitre.soustitre = soustitre;
//             sousChapitre.chapitre_id = chapitre_id;
//             await sousChapitre.save();
//             res.status(200).json(sousChapitre);
//         } else {
//             res.status(404).json({ error: 'Sous-chapitre non trouvé.' });
//         }
//     } catch (err) {
//         res.status(500).json({ error: 'Erreur lors de la mise à jour du sous-chapitre.' });
//     }
// });

// router.delete('/sousChapitre/:id', async (req, res) => {
//     const { id } = req.params;

//     try {
//         const sousChapitre = await SousChapitre.findByPk(id);
//         if (sousChapitre) {
//             await sousChapitre.destroy();
//             res.status(204).send(); // No content
//         } else {
//             res.status(404).json({ error: 'Sous-chapitre non trouvé.' });
//         }
//     } catch (err) {
//         res.status(500).json({ error: 'Erreur lors de la suppression du sous-chapitre.' });
//     }
// });
// router.delete('/sousChapitre/Delete/:idChapitre', async (req, res) => {
//     const { idChapitre } = req.params;

//     try {
//         const deletedRows = await SousChapitre.destroy({
//             where: { chapitre_id: idChapitre }
//         });

//         if (deletedRows > 0) {
//             res.status(204).send(); // No content
//         } else {
//             res.status(404).json({ error: 'Aucun sous-chapitre trouvé pour ce chapitre.' });
//         }
//     } catch (err) {
//         res.status(500).json({ error: 'Erreur lors de la suppression des sous-chapitres.' });
//     }
// });



// module.exports = router;
