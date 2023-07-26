const { Schema, model } = require('mongoose');


const CartSchema = new Schema({
    totalItems: {
        type: Number,
        required:true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    cartItems: [
        {
            id: {
                type: Schema.Types.ObjectId,
                ref:'Product'
            },
            qty: {
                type: Number,
                required: true,
            },
        }
    ]

})


const Cart = model('Cart', CartSchema);
module.exports = Cart;