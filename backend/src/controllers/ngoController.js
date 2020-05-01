const dbConnection = require('../database/connection');
const generateUniqueId = require('../utils/generateUniqueId');

module.exports = {
    // Function called when you want to list every NGO in the database
    async index(request, response) {
        // Gets NGO's from the database
        const ngos = await dbConnection('ngos').select('*');

        // And returns the result
        return response.json(ngos);
    },

    // Function called when you want to create a new NGO
    async create(request, response) {
        // Creates a hexadecimal random id that has 4 bytes
        const id = await generateUniqueId();

        // Gets request body
        const { name, email, whatsapp, city } = request.body;

        // Gets state from body separately, it's necessary to transform state into uppercase
        let { state } = request.body;
        state = state.toUpperCase();

        // Inserts the new NGO and gets the id from it
        await dbConnection('ngos').insert({
            id,
            name,
            email,
            whatsapp,
            city,
            state
        });

        // Returns new NGO id
        return response.json({ id });
    }
};