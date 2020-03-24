const connection = require('../database/connection');

module.exports = {
    // Function called when you want to login
    async create(request, response) {
        // Gets request body
        const { id } = request.body;

        // Gets the NGO with the given id
        const ngo = await connection('ngos').where('id', id).select('name').first();

        // Verifies if the NGO exists
        if(!ngo) {
            // If not, returns an error
            return response.status(400).json({ error: 'No NGO found with this ID' });
        }

        // If yes, returns NGO name
        return response.json(ngo);
    }
};