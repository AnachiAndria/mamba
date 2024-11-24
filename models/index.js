const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Modèles existants
const Mention = sequelize.define('Mention', {
    nom_mention: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

const User = sequelize.define('User',{
    email: {
        type: DataTypes.STRING,
        allowNull:false
    },
    nom: {
        type: DataTypes.STRING,
        allowNull:false
    },
    prenom: {
        type: DataTypes.STRING,
        allowNull:true
    },
    mdp: {
        type: DataTypes.STRING,
        allowNull:false
    },
    tokken: {
        type: DataTypes.STRING,
        allowNull:false
    },
})

const Parcours = sequelize.define('Parcours', {
    nom_parcours: {
        type: DataTypes.STRING,
        allowNull: false
    },
    niveau: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mention_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Mention,
            key: 'id'
        }
    }
});

const UniteEnseignement = sequelize.define('UniteEnseignement', {
    nomUE: {
        type: DataTypes.STRING,
        allowNull: false
    },
    niveau: {
        type: DataTypes.STRING,
        allowNull: false
    },
    parcours_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Parcours,
            key: 'id'
        }
    }
});

const ElementConstitutif = sequelize.define('ElementConstitutif', {
    nomEC: {
        type: DataTypes.STRING,
        allowNull: false
    },
    professeur_responsable: {
        type: DataTypes.STRING,
        allowNull: true
    },
    horaire:{
        type: DataTypes.STRING,
        allowNull: true
    },
    session: {
        type: DataTypes.STRING,
        allowNull: true
    },
    objectif:{
        type: DataTypes.STRING,
        allowNull: true
    },
    unite_enseignement_id: {
        type: DataTypes.INTEGER,
        references: {
            model: UniteEnseignement,
            key: 'id'
        }
    }
});

const Chapitre = sequelize.define('Chapitre', {
    titre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    element_constitutif_id: {
        type: DataTypes.INTEGER,
        references: {
            model: ElementConstitutif,
            key: 'id'
        }
    }
});

const SousChapitre = sequelize.define('SousChapitre', {
    soustitre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    chapitre_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Chapitre,
            key: 'id'
        }
    }
});

// Nouveau modèle CahierDeTexte
const CahierDeTexte = sequelize.define('CahierDeTexte', {
    dateCours: {
        type: DataTypes.DATEONLY, // Format de date uniquement
        allowNull: false
    },
    heureDebut: {
        type: DataTypes.TIME, // Format d'heure uniquement
        allowNull: false
    },
    heureFin: {
        type: DataTypes.TIME,
        allowNull: false
    },
    descriptionCours: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    element_constitutif_id: {
        type: DataTypes.INTEGER,
        references: {
            model: ElementConstitutif,
            key: 'id'
        }
    },
    sous_chapitre_id: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

// Association
Mention.hasMany(Parcours, { foreignKey: 'mention_id' });
Parcours.belongsTo(Mention, { foreignKey: 'mention_id' });
ElementConstitutif.hasMany(Chapitre, { foreignKey: 'element_constitutif_id' });
Chapitre.belongsTo(ElementConstitutif, { foreignKey: 'element_constitutif_id' });
Chapitre.hasMany(SousChapitre, { foreignKey: 'chapitre_id' });
SousChapitre.belongsTo(Chapitre, { foreignKey: 'chapitre_id' });

// Synchroniser les modèles avec la base de données
sequelize.sync({ force: false }).then(() => {
    console.log('Tables synchronisées avec succès');
});

// Exporter tous les modèles
module.exports = {
    Mention,
    Parcours,
    User,
    UniteEnseignement,
    ElementConstitutif,
    Chapitre,
    SousChapitre,
    CahierDeTexte
};
