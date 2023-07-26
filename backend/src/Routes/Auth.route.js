const express = require('express');
const VerifyUser = require('../Middlewares/verifyUser');
const Login = require('../Controllers/Auth/Login.controller');
const Register = require('../Controllers/Auth/Register.controller');
const Me = require('../Controllers/Auth/Me.controller');
const router = express.Router();

// Routes
const protectedRoute = express.Router();
const unprotectedRoute = express.Router();
protectedRoute.use(VerifyUser);
// Unprotected Routes
unprotectedRoute.post('/login', Login);
unprotectedRoute.post('/signup', Register);
// Protected Routes
protectedRoute.get('/me', Me);

router.use('/', unprotectedRoute);
router.use('/', protectedRoute);

module.exports = router;
