const express = require('express');
const bodyParser = require('body-parser');

const cors = require('cors'); // Importer le middleware CORS
const user = require('./routes/user');
const uniteEnseignementRoute = require('./routes/uniteEnseignement');
const chapitreRoute = require('./routes/chapitre');
const elementConstitutifRoute = require('./routes/elementConstitutif');
const sousChapitreRoute = require('./routes/sousChapitre');
const mentionRoute = require('./routes/mention');
const parcoursRoute = require('./routes/parcours');
const cahierDeTexte = require('./routes/CahierDeTexte');
const authentification = require('./routes/authentification');
const syllabus = require('./routes/syllabus');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors()); // Utiliser le middleware CORS

// Middleware pour parser les requêtes JSON
app.use(bodyParser.json());

// Utiliser les routes pour le syllabus
app.use('/api/UE', uniteEnseignementRoute);
app.use('/api/chapitre', chapitreRoute);
app.use('/api/EC', elementConstitutifRoute);
app.use('/api/sousChapitre', sousChapitreRoute);
app.use('/api/mention', mentionRoute);
app.use('/api/parcours', parcoursRoute);
app.use('/api/cahier-de-texte', cahierDeTexte);
app.use('/api/user', user);
app.use('/api/authentification', authentification);
app.use('/api/syllabus', syllabus);

app.use((req, res, next) => {
    console.log('Received body:', req.body);  // Voir ce qui est envoyé
    next();
  });

// Lancer le serveur
app.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`);
});
