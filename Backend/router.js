const express = require("express");
const router = express.Router();
const {handleSignUp, handleValidateOTP, handleLogin} = require('./Controllers/userController')
const tokenAuth = require('./Middleware/auth')
const cookieParser = require('cookie-parser');
const {handleGetNotes,handlePostNote,handleUpdateNote,handleDeleteNote} = require('./Controllers/noteController')

// JSON Middleware
router.use(express.json());

// Cookie-parser Middleware
router.use(cookieParser());

// Sample Route
router.get('/', (req, res) => {
    res.send("<h1>Yup! Server is running  🚀 </h1>");
});

// User Routes (Authentication)
router.post('/signup',handleSignUp)
router.post('/validate-user',handleValidateOTP)
router.post('/login',handleLogin)


// Auth Middleware (Authorization)
router.use(tokenAuth)

// Notes Routes (CRUD operations)
router.get('/get-notes',handleGetNotes)
router.post('/post-note',handlePostNote)
router.patch('/update-note',handleUpdateNote)
router.delete('/delete-note',handleDeleteNote)

//exports
module.exports = router;
