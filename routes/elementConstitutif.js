const express = require('express');
const { ElementConstitutif, UniteEnseignement } = require('../models');
const router = express.Router();

// Route pour ajouter un élément constitutif
router.post('/EC', async (req, res) => {
    let { nomEC, professeur_responsable, session, unite_enseignement_id } = req.body;
    unite_enseignement_id = unite_enseignement_id.unite_enseignement_id
    try {
        const ec = await ElementConstitutif.create({
            nomEC,
            professeur_responsable,
            session,
            unite_enseignement_id
        });
        res.status(201).json(ec);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la création de l\'élément constitutif.'+ err });
    }
});

router.get('/EC', async (req, res) => {
    try {
        const ecs = await ElementConstitutif.findAll();
        const ueRec = await UniteEnseignement.findAll({
            attributes: ['id','nomUE']
        });
        
        //mapping 
        const ueMap = ueRec.reduce((map, ue) =>{
            map[ue.id] = ue.nomUE;
            return map;
        },{})

        const result = ecs.map(ec =>({
            ...ec.toJSON(),
            nomUE: ueMap[ec.unite_enseignement_id] || null
        }));
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération des éléments constitutifs.' });
    }
});

router.get('/EC/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const ec = await ElementConstitutif.findByPk(id);
        if (ec) {
            res.status(200).json(ec);
        } else {
            res.status(404).json({ error: 'Élément constitutif non trouvé.' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'élément constitutif.' });
    }
});

router.put('/EC/:id', async (req, res) => {
    const { id } = req.params;
    let { nomEC, professeur_responsable,session, unite_enseignement_id } = req.body;
    unite_enseignement_id = unite_enseignement_id.unite_enseignement_id
    try {
        const ec = await ElementConstitutif.findByPk(id);
        if (ec) {
            ec.nomEC = nomEC;
            ec.professeur_responsable = professeur_responsable;
            ec.session = session;
            ec.unite_enseignement_id = unite_enseignement_id;
            await ec.save();
            res.status(200).json(ec);
        } else {
            res.status(404).json({ error: 'Élément constitutif non trouvé.' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'élément constitutif.' });
    }
});

router.delete('/EC/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const ec = await ElementConstitutif.findByPk(id);
        if (ec) {
            await ec.destroy();
            res.status(204).send(); // No content
        } else {
            res.status(404).json({ error: 'Élément constitutif non trouvé.' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la suppression de l\'élément constitutif.' });
    }
});

// N'oubliez pas d'exporter le routeur
module.exports = router; 