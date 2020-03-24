const connection = require('../database/connection');
const crypto = require('crypto');

module.exports = {
    // Function called when you want to list every NGO in the database
    async index(request, response) {
        // Gets NGO's from the database
        const ngos = await connection('ngos').select('*');

        // And returns the result
        return response.json(ngos);
    },

    // Function called when you want to create a new NGO
    async create(request, response) {
        // Creates a hexadecimal random id that has 4 bytes
        const id = crypto.randomBytes(4).toString('HEX');

        // Gets request body
        const { name, email, whatsapp, city, uf } = request.body;
    
        // Inserts the new NGO and gets the id from it
        await connection('ngos').insert({
            id,
            name,
            email,
            whatsapp,
            city,
            uf
        });
    
        // Returns new NGO id
        return response.json({ id });
    }
};