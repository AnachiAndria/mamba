const express = require('express');
const { ElementConstitutif, Chapitre, SousChapitre,UniteEnseignement } = require('../models'); // Importer les modèles nécessaires
const router = express.Router();

router.post('/syllabus', async (req, res) => {
  try {
    const { ecId, syllabus } = req.body;

    // Valider les données d'entrée
    if (!ecId || !syllabus) {
      return res.status(400).json({ error: 'EC ID et données du syllabus sont requis.' });
    }

    // Vérifier l'existence de l'EC
    const ec = await ElementConstitutif.findByPk(ecId);
    if (!ec) {
      return res.status(404).json({ error: 'Element Constitutif introuvable.' });
    }

    // Mettre à jour l'EC avec les données du syllabus
    ec.nomEC = syllabus.Titre || ec.nomEC;
    ec.horaire = syllabus.horaire || ec.horaire;
    ec.objectif = syllabus.Objectif || ec.objectif;
    await ec.save();

    // Gestion des chapitres
    for (const chapter of syllabus.chapitres) {
      // Rechercher le chapitre existant
      let existingChapter = await Chapitre.findOne({
        where: {
          titre: chapter.titre,
          element_constitutif_id: ecId,
        },
      });

      if (existingChapter) {
        // Mettre à jour le chapitre existant
        existingChapter.titre = chapter.titre;
        await existingChapter.save();
      } else {
        // Créer un nouveau chapitre s'il n'existe pas
        existingChapter = await Chapitre.create({
          titre: chapter.titre,
          element_constitutif_id: ecId,
        });
      }

      // Gestion des sous-chapitres
      for (const sousChapitre of chapter['sous-Chapitre']) {
        // Rechercher le sous-chapitre existant
        const existingSousChapitre = await SousChapitre.findOne({
          where: {
            soustitre: sousChapitre,
            chapitre_id: existingChapter.id,
          },
        });

        if (!existingSousChapitre) {
          // Créer le sous-chapitre s'il n'existe pas
          await SousChapitre.create({
            soustitre: sousChapitre,
            chapitre_id: existingChapter.id,
          });
        }
      }
    }

    return res.status(200).json({ message: 'Syllabus mis à jour avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du syllabus :', error);
    return res.status(500).json({ error: 'Échec de la mise à jour du syllabus.' });
  }
});


router.get('/EC', async (req, res) => {
  try {
    const ecs = await ElementConstitutif.findAll({
      include: [
        {
          model: Chapitre,
          attributes: ['id', 'titre'], // Specify the attributes to return for chapters
        },
      ],
      attributes: ['id', 'nomEC', 'professeur_responsable', 'horaire', 'session', 'objectif', 'unite_enseignement_id'],
    });

    // Fetch UniteEnseignement for mapping
    const ueRec = await UniteEnseignement.findAll({
      attributes: ['id', 'nomUE'],
    });

    // Map UniteEnseignement by ID for quick lookup
    const ueMap = ueRec.reduce((map, ue) => {
      map[ue.id] = ue.nomUE;
      return map;
    }, {});

    // Add `nomUE` to each EC entry and filter those with chapters
    const result = ecs
      .filter(ec => ec.Chapitres && ec.Chapitres.length > 0) // Keep only ECs with chapters
      .map(ec => ({
        ...ec.toJSON(),
        nomUE: ueMap[ec.unite_enseignement_id] || null,
      }));

    res.status(200).json(result);
  } catch (err) {
    console.error('Erreur lors de la récupération des éléments constitutifs:', err);
    res.status(500).json({ error: 'Erreur lors de la récupération des éléments constitutifs:' + err });
  }
});

router.get('/syllabus/:id', async (req, res) => {
  try {
    const { id } = req.params; // ID of EC

    // Fetch EC with related chapters and subchapters
    const ec = await ElementConstitutif.findByPk(id, {
      attributes: ['id', 'nomEC', 'objectif', 'horaire'], // Include relevant EC fields
      include: [
        {
          model: Chapitre,
          attributes: ['id', 'titre'],
          include: [
            {
              model: SousChapitre,
              attributes: ['id', 'soustitre'],
            },
          ],
        },
      ],
    });

    if (!ec) {
      return res.status(404).json({ error: 'Element Constitutif introuvable.' });
    }

    res.status(200).json(ec);
  } catch (err) {
    console.error('Erreur lors de la récupération du syllabus:', err);
    res.status(500).json({ error: 'Erreur lors de la récupération du syllabus.' });
  }
});

module.exports = router;
