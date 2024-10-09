                        // Designing RESTFUL Services //

// const express = require('express');
// const app = express();


// const PORT = 3000;
// app.use(express.json());

// let users = [
//     {id: 1, name: 'Ali'},
//     {id: 2, name: 'Hassan'}
// ];

// //Get all the users

// app.get('/users', async(req, res) => {
//     res.json({ users });
// });


                                    // Crud operations

// Get user by specific id

// app.get('/users/:id', async (req, res) => {
//     try {
//         const user = await users.findById(req.params.id);
//         if(!user) return res.status(404).json({message: `The user with search id "${req.params.id}" not found!`});

//         console.log(user);
//         return res.status(200).json({message: `The user with search id "${req.params.id}" successfully found!`, user});
//     } catch (err) {
//         console.error(err.message);
//         return res.status(500).json({message: 'Server Error', error: err.message});
//     }

// });


// Post user with credentials

// app.post('/users', async(req, res) => {
//     try {
//         const newUser = req.body;
//         const user = new user(newUser);

//         await user.save();
//         return res.status(201).json({message: 'The user is successfully posted! ', user});
//     } catch (err) {
//         console.log(err.message);
//         return res.status(500).json({message: 'Server Error', Error: err.message});
//     }

// });


// Update the user with specific id

// app.put('/users/:id', async(req, res) => {
//     const { name } = req.body;

//     try {
//         const user = await users.findByIdAndUpdate(req.params.id, {name}, {new: true});
//         if(!user) return res.status(404).json({message: `The user with search id "${req.params.id}" was not found!`});

//         user.name = name || user.name;
//         console.log('Updated User is: ', user);
//         const updatedUser = await user.save();

//         console.log('The updated user is: ', updatedUser);
//         return res.status(200).json({message: 'The User is updated Successfully!'});
//     } catch (err) {
//         console.error(err.message);
//         return res.status(500).json({message: 'Server Error', error: err.message});
//     }
// });


// Delete user by specific id

// app.delete('/users/:id', async(req, res) => {
//     try {
//         const deletedUser = await users.findByIdAndDelete(req.params.id);
//         if(!deletedUser) return res.status(404).json({message: `The user with search id "${req.params.id}" not found!`});

//         console.log('The deleted user is: ', deletedUser);
//         return res.status(200).json({message: `The user with search id "${req.params.id}" is successfully deleted!`});
//     } catch (err) {
//         console.error(err.message);
//         return res.status(500).json({message: 'Server Error', error: err.message});
//     }
// });


// app.listen(PORT, () => console.log(`Server is listening on https://localhost:${PORT}`));


                                        // ------------------------------------ //


                    // Status Codes and Error Handling

// There are 5 different categories of Status codes:
// 1) Information Status Codes (100) ==> Represents Informational Messages
// 2) Success Status Code (200) ==> Represents OK / Success Messages
// 3) Redirection Status Codes (300) ==> Represents further action is needed to fulfill the request (URL)
// 4) Client Error Status Codes (400) ==> Represents client make error, leading request not being fulfilled
// 5) Server Error Status Codes (500) ==> Represents server make errors, leading server is not able to fulfill requests 

//         Most Common Status Codes
//         200  ===> Represents a OK request, means that the resource is successfully recieived
//         201  ===> Represents a successfull message, means that a resource is successfully created or posted
//         400  ===> Represents a bad request from client, request have not valid or complete data
//         401  ===> Represents a searching resource not found on the server
//         500  ===> Represents a server error, server encountering an errors due to internal conditions
//         503  ===> Represents a unable Service, server is unable to handle the requests



