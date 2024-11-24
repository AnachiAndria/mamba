const express = require('express');
const { User } = require('../models');
const router = express.Router();
const crypto = require('crypto'); 
const { error } = require('console');

function generateToken() {
    return crypto.randomBytes(5).toString('hex'); // 10 caractères hexadécimaux (chiffres et lettres)
}
//add user
router.post('/user',async (req,res) => {
    const {email,nom,prenom,mdp} = req.body;

    const tokken = generateToken();

    try {
        const user = await User.create({email,nom,prenom,mdp,tokken});
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de creation de mention'});
    }
});

router.get('/user',async (req,res) => {
    try {
        const user = await User.findAll();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération des utilisateur.' });
    }
})

module.exports = router;