const express = require("express");
const userRoutes = express.Router();
const userController = require('../controllers/user');

userRoutes.get("/", (req, res) => {
    res.status(400).send("welcome to the user routes")
})


userRoutes.get('/getAllData', userController.getAllData);
userRoutes.post('/createData', userController.createData);
userRoutes.put('/updateData/:id', userController.updateData);
userRoutes.delete('/deleteData/:id', userController.deleteData);





module.exports = userRoutes

