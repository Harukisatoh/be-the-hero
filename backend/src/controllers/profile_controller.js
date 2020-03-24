const connection = require('../database/connection');

module.exports = {
    // Function called when you want to list every incident from a NGO
    async index(request, response) {
        // Verifies which page is on the URL
        const { page = 1 } = request.query;

        // Gets ond_id from headers
        const ngo_id = request.headers.authorization;

        // Counts every case in the database
        const [count] = await connection('incidents').where('ngo_id', ngo_id).count();

        // Returns 5 results according to the page searched
        const incidents = await connection('incidents')
            .limit(5)
            .offset((page - 1) * 5)
            .where('ngo_id', ngo_id)
            .select('*');

        // Creates a header to returns the total number of incidents
        response.header('X-Total-Count', count['count(*)']);

        // Returns the incidents and the total number of incidents
        return response.json(incidents);
    }
}