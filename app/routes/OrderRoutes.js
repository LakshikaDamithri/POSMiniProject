

module.exports = (app) => {
    const orders = require('../controllers/OrderController.js');

    // Create a new Order
    app.post('/orders', orders.create);

    // Retrieve all Oders
    app.get('/orders', orders.findAll);

    // Retrieve all open orders
    app.get('/orders/open', orders.findAllOpen);

    // Retrieve a single Order
    app.get('/orders/:orderId', orders.findOneOrder);

   // adding a new Item to an Order
    app.put('/orders/add/:orderId/:itemId/:quantity', orders.addNewItem);

    // Removing an item
    app.put('/orders/remove/:orderId/:itemId', orders.removeItem);

    // Modify item count in an oredr
    app.put('/orders/:orderId/:itemId', orders.ModifyItemCount);
}