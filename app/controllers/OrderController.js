const Order = require('../models/order.js');
const Item = require('../models/item.js')
const mongoose = require('mongoose');

// Create and Save a new order
exports.create = (req, res) => {
   
    // Create an oredr
    const order = new Order({
        OrderID: req.body.OrderID, 
        OrderName: req.body.OrderName,
        OrderStatus: req.body.status,
        itemDetails: req.body.itemDetails,
        OrderTotal: req.body.OrderTotal
    });

    console.log("$$$$  "+ order.itemDetails)

    //Save order in the database
    order.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Order."
        });
    });
};

// Retrieve and return all orders from the database.
exports.findAll = (req, res) => {
    Order.find()
    .then(orders => {
        //console.log(orders)
        res.send(orders);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving orders."
        });
    });
};

//Delete an order(Object ID)
exports.delete = (req, res) => {
    Order.findByIdAndRemove(req.params.orderId)
    .then(order => {
        if(!order) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });
        }
        res.send({message: "Note deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Note not found with id " + req.params.orderId
            });                
        }
        return res.status(500).send({
            message: "Could not delete note with id " + req.params.orderId
        });
    });
};


// Retrieve and return all open orders from the database.
exports.findAllOpen = (req, res) => {
    Order.find().
    populate('itemDetails.itemID')
    .then(orders => {
        
        var resultArray = []

        for (let i =0; i< orders.length; i++){
            if(orders[i].OrderStatus == 'open'){
                resultArray.push(orders[i])
                console.log(orders[i])
            }
        }
         res.send(resultArray)
     }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving orders."
        });
    });
};

// Find a single order with a orderID
exports.findOneOrder = (req, res) => {
    var order_id = req.params.orderId

    Order.
    findOne({OrderID:order_id}).
    populate('itemDetails.itemID').
    then(order => {

        if(!order) {
            return res.status(404).send({
                message: "Order not found with id " + req.params.orderId
            });            
        }
        res.send(order);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Order not found with id " + req.params.orderId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving order with id " + req.params.orderId
        });
    });
};

// adding a new Item (send the object ID as Itemid)
exports.addNewItem = (req, res) => {
    var order_id = req.params.orderId
    var item_id = req.params.itemId

    Order.
    findOne({OrderID:order_id}).
    populate('itemDetails.itemID').
    then(order => {
        if(!order) {
            return res.status(404).send({
                message: "Order not found with id " + req.params.orderId
            });            
        }

        if(mongoose.Types.ObjectId.isValid(item_id)){
            Item.
            findOne({_id:item_id}).
            then(item=>{
                item.available_quantity = item.available_quantity-1
                item.save()
                const newItemDetails = {itemID: item, itemQuantity:1}
                order.itemDetails.push(newItemDetails)
                order.OrderTotal = order.OrderTotal + item.price
                order.save()
                return res.status(200).send(order)
            }).
            catch(err =>{
                console.error(err)
            })
         } else {
            return res.status(404).send({
                message: "Item not found with id " + item_id
            }); 
         }

    }).catch(err => {
        console.log(err)
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Order not found with id " + req.params.orderId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving order with id " + req.params.orderId
        });
    });

};

// Removing an item
exports.removeItem = (req, res) => {
    var order_id = req.params.orderId
    var item_id = req.params.itemId
    var resultArray =[]

    Order.
    findOne({OrderID:order_id}).
    populate('itemDetails.itemID').
    then(order => {

        if(!order) {
            return res.status(404).send({
                message: "Order not found with id " + req.params.orderId
            });            
        }


        for (let i =0 ; i<order.itemDetails.length; i++){
            if(order.itemDetails[i].itemID.itemID == item_id){
                Item.
                findOne({itemID:item_id}).
                then(item=>{
                    item.available_quantity = item.available_quantity+1
                    item.save()

                    //Removing item to the order
                    resultArray = order.itemDetails.filter( i=> i.itemID.itemID != item_id)
                    order.itemDetails = resultArray
                    order.OrderTotal = order.OrderTotal - item.price
                    order.save()
                    return res.status(200).send(order)
                }).
                catch(err =>{
                    console.error(err)
                })
            }
        }
       
    }).catch(err => {
        console.log(err)
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Order not found with id " + req.params.orderId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving order with id " + req.params.orderId
        });
    });
};

// Incrementing item count in an order
exports.ChangeItemCount = (req, res) => {

    var order_id = req.params.orderId
    var item_id = req.params.itemId
    var newValue =req.params.value

    Order.
    findOne({OrderID:order_id}).
    populate('itemDetails.itemID').
    then(order => {
        
        if(!order) {
            return res.status(404).send({
                message: "Order not found with id " + req.params.orderId
            });            
        }

        for (let i =0 ; i<order.itemDetails.length; i++){

            if(order.itemDetails[i].itemID.itemID == item_id){

                Item.
                findOne({itemID:item_id}).
                then(item=>{

                    if(order.itemDetails[i].itemQuantity < newValue){
                        item.available_quantity = item.available_quantity- (newValue - order.itemDetails[i].itemQuantity)
                    } else {
                        item.available_quantity = item.available_quantity+ (newValue - order.itemDetails[i].itemQuantity)
                    }

                    item.save()
    
                    const newItemDetails = {itemID: item, itemQuantity:newValue}
                    order.itemDetails[i] = newItemDetails
                    order.OrderTotal = order.OrderTotal + item.price
                    order.save()
                    console.log(order.itemDetails[i])
                    return res.status(200).send(order)
                }).
                catch(err =>{
                    console.error(err)
                })
            } 
        }
    }).catch(err => {
        console.log(err)
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Order not found with id " + order_id
            });                
        }
        return res.status(500).send({
            message: "Error retrieving order with id " + order_id
        });
    });
}


// Decrementing item count in an order
exports.MinusItemCount = (req, res) => {

    var order_id = req.params.orderId
    var item_id = req.params.itemId

    Order.
    findOne({OrderID:order_id}).
    populate('itemDetails.itemID').
    then(order => {

        if(!order) {
            return res.status(404).send({
                message: "Order not found with id " + req.params.orderId
            });            
        }

        for (let i =0 ; i<order.itemDetails.length; i++){

            if(order.itemDetails[i].itemID.itemID == item_id){

                Item.
                findOne({itemID:item_id}).
                then(item=>{
                    item.available_quantity = item.available_quantity+1
                    item.save()
                    const newQuantity = order.itemDetails[i].itemQuantity-1
                    const newItemDetails = {itemID: item, itemQuantity:newQuantity}
                    order.itemDetails[i] = newItemDetails
                    order.OrderTotal = order.OrderTotal - item.price
                    order.save()
                    console.log(order.itemDetails[i])
                    return res.status(200).send(order)
                }).
                catch(err =>{
                    console.error(err)
                })
            } 
        }

    }).catch(err => {
        console.log(err)
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Order not found with id " + req.params.orderId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving order with id " + req.params.orderId
        });
    });
}

