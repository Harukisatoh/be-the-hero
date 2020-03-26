const connection = require('../database/connection');

module.exports = {
    // Function called when you want to list every incident in the database
    async index(request, response) {
        // Verifies which page is on the URL
        const { page = 1 } = request.query;

        // Counts every incident in the database
        const [count] = await connection('incidents').count();

        // Returns 5 results according to the page searched
        const incidents = await connection('incidents')
            .join('ngos', 'ngos.id', '=', 'incidents.ngo_id')
            .limit(5)
            .offset((page - 1) * 5)
            .select(['incidents.*', 'ngos.name', 'ngos.whatsapp', 'ngos.email', 'ngos.city', 'ngos.uf']);

        // Creates a header to returns the total number of incidents
        response.header('X-Total-Count', count['count(*)']);

        // Returns the incidents and the total number of incidents
        return response.json(incidents);
    },

    // Function called when you want to create a new incident
    async create(request, response) {
        // Gets ngo_id from header
        const ngo_id = request.headers.authorization;

        // Gets request body
        const { title, description, value } = request.body;

        // Inserts the new incident and gets the id from it
        const [id] = await connection('incidents').insert({
            title,
            description,
            value,
            ngo_id
        });

        // Returns new incident id
        return response.json({ id });
    },

    // Function called when you want to delete an incident from the database
    async delete(request, response) {
        // Gets id from URL
        const { id } = request.params;

        // Gets id from the logged NGO
        const ngo_id = request.headers.authorization;

        // Gets the incident corresponding to the id passed on the URL
        const incident = await connection('incidents').where('id', id).select('ngo_id').first();

        // Verifies if the incident exists
        if (!incident) {
            // If not, returns an error
            return response.status(404).json({ error: 'This incident does not exist' });
        }

        // Verifies if the NGO logged owns the incident to be deleted
        if (incident.ngo_id !== ngo_id) {
            // If not, returns an error
            return response.status(401).json({ error: 'Operation not permitted.' });
        }

        // If yes, deletes the incident from database
        await connection('incidents').where('id', id).delete();

        // And returns a response with an empty body
        return response.status(204).send();
    }
};