const Order = require('../models/order.js');

// Create and Save a new order
exports.create = (req, res) => {
   
    // Create an oredr
    const order = new Order({
        OrderID: req.body.OrderID, 
        OrderName: req.body.OrderName,
        OrderStatus: req.body.status,
        itemDetails: req.body.itemDetails
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

// Retrieve and return all open orders from the database.
exports.findAllOpen = (req, res) => {
    Order.find()
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
    var item_quantity = req.params.quantity

    Order.
    findOne({OrderID:order_id}).
    populate('itemDetails.itemID').
    then(order => {

        //adding item to the order
        order.itemDetails.push({itemID:item_id , itemQuantity: item_quantity})
        order.save()
       
        var index = order.itemDetails.length-1
        console.log(order.itemDetails[index].itemID.itemName)
        order.itemDetails[index].itemID.available_quantity = order.itemDetails[index].itemID.available_quantity - item_quantity
        console.log(order.itemDetails[index].itemID.available_quantity)

        //modifying available item count
        // array = order.itemDetails.filter( i=> i.itemID._id == item_id)
        // array[0].itemID.available_quantity = array[0].itemID.available_quantity - item_quantity
        
        if(!order) {
            return res.status(404).send({
                message: "Order not found with id " + req.params.orderId
            });            
        }
        res.send(order);
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

        //Removing item to the order
        resultArray = order.itemDetails.filter( i=> i.itemID.itemID != item_id)
        order.itemDetails = resultArray


        order.save()

        if(!order) {
            return res.status(404).send({
                message: "Order not found with id " + req.params.orderId
            });            
        }
        res.send(order);
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

// Changing item count in an order
exports.ModifyItemCount = (req, res) => {

    var order_id = req.params.orderId
    var item_id = req.params.itemId

    Order.
    findOne({OrderID:order_id}).
    populate('itemDetails.itemID').
    then(order => {
        for (let i =0 ; i<order.itemDetails.length; i++){
            if(order.itemDetails[i].itemID.itemID == item_id){
                order.itemDetails[i].itemQuantity ++
                order.save()
            }
        }
        if(!order) {
            return res.status(404).send({
                message: "Order not found with id " + req.params.orderId
            });            
        }
        res.send(order);
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

