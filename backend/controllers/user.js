const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const passwordValidator = require('password-validator');

const User = require('../models/User');

// schema password validator

let schema = new passwordValidator();

// Add properties to it
schema
    .min(5)                                    // Minimum length 8
    .max(100)                                  // Maximum length 100
    .uppercase()                              // Must have uppercase letters
    .lowercase()                              // Must have lowercase letters

// creation user et hash

exports.signup = (req, res, next) => {
    if (!schema.validate(req.body.password)) {
        console.log("mot de passe trop faible");
        // throw { error : "mot de passe trop faible" };
        res.status(500).json({ message : "mot de passe trop faible" })
    } else {
        bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const user = new User({
                    email: req.body.email,
                    password: hash
                });
                user.save()
                    .then(() => res.status(201).json({ message: 'Utilisateur crée' }))
                    .catch(error => res.status(400).json({ error }))
            })
            .catch(error => res.status(500).json({ error }));
    };
}

    // connexion user et verification mdp

    exports.login = (req, res, next) => {
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    return res.status(401).json({ error: 'utilisateur non trouvé !' });
                }
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            return res.status(401).json({ error: 'mot de passe incorrect !' });
                        }
                        res.status(200).json({
                            userId: user._id,
                            token: jwt.sign(
                                { userId: user._id },
                                "RANDOM_TOKEN_SECRET",
                                { expiresIn: "24h" }
                            )
                        });
                    })
                    .catch(error => res.status(500).json({ error }));
            })
            .catch(error => res.status(500).json({ error }));
    };