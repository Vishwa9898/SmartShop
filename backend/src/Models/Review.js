const { Schema, model } = require('mongoose');

const reviewSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
    },
    rating: Number,
    title: String,
    description: String,
    createdAt: Date,
}, {
    timestamps: true,
});


const Review = model('Review', reviewSchema);

module.exports = Review;