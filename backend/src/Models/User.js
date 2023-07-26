const { model, Schema } = require('mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        
    },
    password: String,
    name: String,
    role: String,
})

const User = model('User', userSchema);

module.exports = User;