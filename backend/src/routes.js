const express = require('express');

// Controllers
const ngoController = require('./controllers/ngoController');
const incidentController = require('./controllers/incidentController');
const profileController = require('./controllers/profileController');
const sessionController = require('./controllers/sessionController');

// Validators, just to check inputs from frontend and mobile
const sessionValidator = require('../src/validators/sessionValidator');
const ngoValidator = require('../src/validators/ngoValidator');
const profileValidator = require('../src/validators/profileValidator');
const incidentValidator = require('../src/validators/incidentValidator');

// Express router instance
const routes = express.Router();

// Routes
routes.post('/sessions', sessionValidator, sessionController.create); // Route called when you want to login

routes.get('/ngos', ngoController.index); // Route called when you want to list every NGO in the database
routes.post('/ngos', ngoValidator, ngoController.create); // Route called when you want to create a new NGO

routes.get('/profile', profileValidator, profileController.index); // Route called when you want to list every incident from a NGO

routes.get('/incidents', incidentValidator.get, incidentController.index); // Route called when you want to list every incident in the database
routes.post('/incidents', incidentValidator.post, incidentController.create); // Route called when you want to create a new incident
routes.delete('/incidents/:id', incidentValidator.delete, incidentController.delete); // Route called when you want to delete an incident from the database

module.exports = routes;