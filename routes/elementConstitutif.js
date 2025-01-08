const express = require('express');
const { ElementConstitutif, UniteEnseignement, Parcours } = require('../models');
const router = express.Router();

// Route pour ajouter un élément constitutif
router.post('/EC', async (req, res) => {
    let { nomEC, professeur_responsable, horaire, session, objectif, unite_enseignement_id } = req.body;
    
    // Fonction utilitaire pour extraire l'ID
    const getUEId = (data) => {
        if (typeof data === 'number' || (typeof data === 'string' && !isNaN(data))) {
            return Number(data);
        }
        if (typeof data === 'object' && data !== null) {
            return data.unite_enseignement_id;
        }
        return null;
    };

    try {
        // Extraction de l'ID avec gestion des deux cas
        const ueId = getUEId(unite_enseignement_id);
        
        if (ueId === null) {
            return res.status(400).json({ 
                error: 'Format invalide pour unite_enseignement_id' 
            });
        }

        const ec = await ElementConstitutif.create({
            nomEC,
            professeur_responsable,
            horaire,
            session,
            objectif,
            unite_enseignement_id: ueId
        });

        res.status(201).json(ec);
    } catch (err) {
        res.status(500).json({ 
            error: 'Erreur lors de la création de l\'élément constitutif : ' + err.message 
        });
    }
});

router.get('/EC', async (req, res) => {
    try {
        // Récupérer les éléments constitutifs
        const ecs = await ElementConstitutif.findAll();

        // Récupérer les unités d'enseignement avec leurs parcours_id
        const ueRec = await UniteEnseignement.findAll({
            attributes: ['id', 'nomUE', 'parcours_id']
        });

        // Récupérer les informations des parcours
        const parcoursRecords = await Parcours.findAll({
            attributes: ['id', 'nom_parcours']
        });

        // Créer un mappage de parcours_id vers nom_parcours
        const parcoursMap = parcoursRecords.reduce((map, parcours) => {
            map[parcours.id] = parcours.nom_parcours;
            return map;
        }, {});

        // Créer un mappage des unités d'enseignement
        const ueMap = ueRec.reduce((map, ue) => {
            map[ue.id] = {
                nomUE: ue.nomUE,
                nom_parcours: parcoursMap[ue.parcours_id] || null, // Ajouter nom_parcours basé sur parcours_id
            };
            return map;
        }, {});

        // Ajouter les champs nomUE et nom_parcours aux éléments constitutifs
        const result = ecs.map(ec => ({
            ...ec.toJSON(),
            nomUE: ueMap[ec.unite_enseignement_id]?.nomUE || null,
            nom_parcours: ueMap[ec.unite_enseignement_id]?.nom_parcours || null,
        }));

        res.status(200).json(result);
    } catch (err) {
        console.error('Erreur lors de la récupération des éléments constitutifs:', err);
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
    let {nomEC, professeur_responsable, horaire, session, objectif } = req.body;

    try {
        const ec = await ElementConstitutif.findByPk(id);
        if (ec) {
            ec.nomEC = nomEC;
            ec.professeur_responsable = professeur_responsable;
            ec.horaire = horaire;
            ec.session = session;
            ec.objectif = objectif;
            await ec.save();
            res.status(200).json(ec);
        } else {
            res.status(404).json({ error: 'Élément constitutif non trouvé.' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'élément constitutif: '+err });
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