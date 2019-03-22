const Item = require('../models/item.js');
const mongoose = require('mongoose');

// Create and Save a new item
exports.create = (req, res) => {
        // Create an item
        const item = new Item({
            itemID: req.body.itemID, 
            itemName: req.body.itemName,
            price: req.body.price,
            available_quantity: req.body.available_quantity
        });
    
        // Save item in the database
        item.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the item."
            });
        });
};

// Retrieve and return all notes from the database.
exports.findAll = (req, res) => {
    Item.find()
    .then(items => {
        res.send(items);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving items."
        });
    });
};

// Find a single item with a itemId
exports.findOneItem = (req, res) => {

    var item_id = req.params.itemId

    Item.findOne({itemID:item_id})
    .then(item => {
        if(!item) {
            return res.status(404).send({
                message: "Item not found with id " + req.params.itemId
            });            
        }
        res.send(item);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Item not found with id " + req.params.itemId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving item with id " + req.params.itemId
        });
    });
};

// // Update a note identified by the noteId in the request
// exports.update = (req, res) => {

// };

// // Delete a note with the specified noteId in the request
// exports.delete = (req, res) => {

// };