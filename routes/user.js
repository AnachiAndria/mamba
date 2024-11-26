const express = require("express");
const { User } = require("../models");
const router = express.Router();
const crypto = require("crypto");

function generateToken() {
  return crypto.randomBytes(5).toString("hex"); // 10 caractères hexadécimaux (chiffres et lettres)
}
//add user
router.post("/user/add", async (req, res) => {
  const { mail, nom, prenom, mdp } = req.body;
  let email = mail;
  const tokken = generateToken();

  try {
    const user = await User.create({ email, nom, prenom, mdp, tokken });
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Erreur lors de creation de mention" });
  }
});

router.get("/user", async (req, res) => {
  try {
    const user = await User.findAll();
    console.log(user);
    res.status(200).json(user);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des utilisateur." });
  }
});

router.put("/user/update/:id", async (req, res) => {
  const { id } = req.params;
  const { mail, nom, prenom, mdp } = req.body;
  let email = mail;

  try {
    const user = await User.findByPk(id);
    if (user) {
      user.nom = nom;
      user.prenom = prenom;
      user.email = email;
      user.mdp = mdp;
      await user.save();
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "Utilisateur non trouvé." });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour de l'utilisateur." });
  }
});

router.delete("/user/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (user) {
      await User.destroy({ where: { id } });
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Utilisateur non trouvé." });
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression de l'utilisateur." });
  }
});

module.exports = router;
