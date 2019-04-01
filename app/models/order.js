const mongoose = require('mongoose');
//const Item = require('../models/item.js');
// var ObjectId = mongoose.Schema.Types.ObjectId;
// var Item = new Schema({ driver: ObjectId });

const OrderSchema = mongoose.Schema({
    OrderID: {
        type: Number,
        unique: true,
        required: true
    },
    OrderName:{
        type: String,
        unique: true,
        require:true
    },
    OrderStatus: {
        type: String,
        required: true
    },
    itemDetails: [{
        itemID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item'
        },
        itemQuantity: Number
    }],
    OrderTotal:{
        type: Number,
        required: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('Order', OrderSchema);