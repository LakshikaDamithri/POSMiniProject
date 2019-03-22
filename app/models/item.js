const mongoose = require('mongoose');

const ItemSchema = mongoose.Schema({
    itemID: {
        type: Number,
        unique: true,
        required: true
    },
    itemName: {
        type: String,
        unique: true,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    available_quantity: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Item', ItemSchema);