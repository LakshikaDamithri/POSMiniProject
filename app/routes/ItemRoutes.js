module.exports = (app) => {
    const items = require('../controllers/ItemController.js');

    // Create a new Note
    app.post('/items', items.create);

    // Retrieve all Notes
    app.get('/items', items.findAll);

    // Retrieve a single Note with noteId
    app.get('/items/:itemId', items.findOneItem);

    // // Update a Note with noteId
    // app.put('/items/:noteId', items.update);

    // // Delete a Note with noteId
    // app.delete('/items/:noteId', items.delete);
}