const User = require('../models/user.js');

// Authenticate a user
exports.authenticate = (req, res) => {

    var name = req.body.username;
    var pass = req.body.password; 

   

    // Validate Request
         if(!(name&&pass)) {
            return res.status(400).send({
                message: "Username or Password can not be empty"
            });
        }

    User.find({username: name,password: pass}).
        then( u =>{
            console.log(u)
            if(u.length!=0){
                res.status(201).send({
                    message: 'Acces granted'
                })
            }
            else{

                res.status(400).send({
                    message: "Incorrect Username or Password."
                });
            }

        }). catch(err => {
            res.status(500).send({
                message: err.message || "Incorrect Username or Password."
            });
        });
};


// exports.authenticate = (req, res) => {

//     var name = req.body.username;
//     var pass = req.body.password; 

//     // Validate Request
//          if(!(name&&pass)) {
//             return res.status(400).send({
//                 message: "Username or Password can not be empty"
//             });
//         }

//     User.find({username: name,password: pass}).
//         then( u =>{
            
//             console.log("u.0")

//             if("u.0".username== name){
//                 var result = u.find(user=>user.username== name)
//                 console.log("&&&&&&&&&   "+result._id)
//                 res.status(201).send({
//                     message: 'Acces granted'
//                 })
//             }
//             else{
//                 res.status(400).send({
//                     message: "Incorrect Username or Password."
//                 });
//             }

//         }). catch(err => {
//             res.status(500).send({
//                 message: err.message || "Incorrect Username or Password."
//             });
//         });
// };



exports.create = (req, res) => {

    // Create a user
    const user = new User({
        username: req.body.username, 
        password: req.body.password
    });

    // Save Note in the database
    user.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the User."
        });
    });
};

// Retrieve and return all users from the database.
exports.findAll = (req, res) => {
    User.find()
    .then(users => {
        res.send(users);
        //res.end(users);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
        });
    });
};

// // Find a single user with an username
// exports.findOne = (req, res) => {
//     User.findById(req.params.username)
//     .then(user => {
//         if(!user) {
//             return res.status(404).send({
//                 message: "User not found with username " + req.params.username
//             });            
//         }
//         res.send(user);
//     }).catch(err => {
//         if(err.kind === 'ObjectId') {
//             return res.status(404).send({
//                 message: "User not found with username " + req.params.username
//             });                
//         }
//         return res.status(500).send({
//             message: "Error retrieving user with username " + req.params.username
//         });
//     });
// };

// Update an user identified by the username in the request
// exports.update = (req, res) => {
//      // Validate Request
//      if(!req.body.content) {
//         return res.status(400).send({
//             message: "Note content can not be empty"
//         });
//     }

//     // Find user and update it with the request body
//     Note.findByIdAndUpdate(req.params.username, {
//         username: req.body.username,
//         password: req.body.password
//     }, {new: true})
//     .then(user => {
//         if(!user) {
//             return res.status(404).send({
//                 message: "User not found with username " + req.params.username
//             });
//         }
//         res.send(username);
//     }).catch(err => {
//         if(err.kind === 'ObjectId') {
//             return res.status(404).send({
//                 message: "User not found with username " + req.params.username
//             });                
//         }
//         return res.status(500).send({
//             message: "Error updating user with username " + req.params.username
//         });
//     });
// };

// // Delete an user with the specified username in the request
// exports.delete = (req, res) => {
//     User.findByIdAndRemove(req.params.username)
//     .then(user => {
//         if(!user) {
//             return res.status(404).send({
//                 message: "User not found with username " + req.params.username
//             });
//         }
//         res.send({message: "User deleted successfully!"});
//     }).catch(err => {
//         if(err.kind === 'ObjectId' || err.name === 'NotFound') {
//             return res.status(404).send({
//                 message: "User not found with username " + req.params.username
//             });                
//         }
//         return res.status(500).send({
//             message: "Could not delete user with username " + req.params.username
//         });
//     });
// };