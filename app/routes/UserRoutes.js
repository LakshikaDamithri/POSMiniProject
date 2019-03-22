module.exports = (app) => {
    const user = require('../controllers/UserController.js');

    // Create a new User
    app.post('/user', user.create);

    //Authenticate
    app.post('/user/authenticate', user.authenticate)

}