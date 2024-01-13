const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    username: {
         type: String,
        required: true,
        min: 3,
        max: 255,
        unique: true 
        },
    email: {
        type: String,
        required: true,
        unique: true 
        },
    password: { 
        type: String, required: true
        },
    verified: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const User = mongoose.model("user", userSchema);

const validate = (user) => {
    const passwordComplexityOptions = {
        min: 8,
        max: 255,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
        symbol: 1,
    };

    const schema = Joi.object({
        username: Joi.string().min(3).max(255).required(),
        email: Joi.string().email().required(),
        password: Joi.string()
            .required()
            .min(passwordComplexityOptions.min)
            .max(passwordComplexityOptions.max)
            .pattern(
                new RegExp(
                    `^(?=.*[a-z]{${passwordComplexityOptions.lowerCase},})(?=.*[A-Z]{${passwordComplexityOptions.upperCase},})(?=.*[0-9]{${passwordComplexityOptions.numeric},})(?=.*[^a-zA-Z0-9]{${passwordComplexityOptions.symbol},}).*$`
                )
            )
            .message('Password must be at least 8 characters and include at least one lowercase letter, one uppercase letter, one number, and one special character.'),
    });

    return schema.validate(user);
};
/* module export */

module.exports = {
    User,
    validate,
};