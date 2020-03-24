const express = require('express');
const ngo_controller = require('./controllers/ngo_controller');
const incident_controller = require('./controllers/incident_controller');
const profile_controller = require('./controllers/profile_controller');
const session_controller = require('./controllers/session_controller');

const routes = express.Router();


routes.post('/sessions', session_controller.create); // Route called when you want to login

routes.get('/ngos', ngo_controller.index); // Route called when you want to list every NGO in the database
routes.post('/ngos', ngo_controller.create); // Route called when you want to create a new NGO

routes.get('/profile', profile_controller.index); // Route called when you want to list every incident from a NGO

routes.get('/incidents', incident_controller.index); // Route called when you want to list every incident in the database
routes.post('/incidents', incident_controller.create); // Route called when you want to create a new incident
routes.delete('/incidents/:id', incident_controller.delete); // Route called when you want to delete an incident from the database

module.exports = routes;