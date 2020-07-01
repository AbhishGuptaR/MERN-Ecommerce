const express = require('express');
const router = express.Router();

const {getProductById, createProduct, getProduct, photo, updateProduct, deleteProduct, getAllProducts, getAllUniqueCategories} = require('../controllers/product')
const {isAdmin, isAuthenticated, isSignedIn} = require('../controllers/auth')
const {getUserById} = require('../controllers/user')

//Params
router.param('userId', getUserById);
router.param('productId', getProductById);

//Routes
//Create Route
router.post("/product/create/:userId", isSignedIn, isAuthenticated, isAdmin, createProduct);
//Read Route
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo);
//Update Route
router.put("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, updateProduct);
//Delete Route
router.delete("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, deleteProduct);
//Listing Route
router.get("/products", getAllProducts);

router.get("/products/categories", getAllUniqueCategories);

module.exports = router ;