const express = require('express');
const {User} = require('../models');
const router = express.Router();

//login code 
router.post('/login', async (req, res) => {
    const { email, mdp } = req.body;

    try {
        // Find user by email and mdp (assuming mdp is hashed)
        const user = await User.findOne({
            where: { email, mdp },
        });

        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé' });
        }
        
        try {
            //get token
            const accessToken = user.tokken;
            const abilityRules = [
                {
                  action: 'manage',
                  subject: 'all',
                },
              ];
            //filtre les sensitive data
            const userData = {
                id: user.id,
                email: user.email,
                nom: user.nom,
                prenom: user.prenom,
                role: "admin"
            };

            return res.status(200).json({
                userAbilityRules: abilityRules,
                accessToken,
                userData: userData,
            });
        } catch (err) {
            return res.status(500).json({ message: 'Error processing login', error: err.message });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la recherche de l’utilisateur', error: err.message });
    }
});

module.exports = router;