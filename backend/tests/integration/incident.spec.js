const app = require('../../src/app');

// Database connection
const dbConnection = require('../../src/database/connection');

// Supertest is a library to test using a api
const request = require('supertest');

describe('/incidents endpoint tests', () => {
  // Before each test
  beforeEach(async () => {
    // Clears the test database
    await dbConnection.migrate.rollback();
    await dbConnection.migrate.latest();
  });

  // After the tests
  afterAll(async () => {
    // Destroy database connection
    await dbConnection.destroy();
  });

  it('should be able to create a new incident', async () => {
    // Creates a NGO just to get the id (for authorization header)
    const { body: { id: id } } = await request(app).post('/ngos').send({
      name: "NGO name",
      email: "ngo@email.com",
      whatsapp: "11996575472",
      city: "city",
      state: "sp"
    });

    // Tries to post on the /incidents endpoint from the api 
    const response = await request(app).post('/incidents').send({
      title: "Incident title",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer turpis libero, sollicitudin id leo sed, elementum scelerisque sapien. Quisque et aliquet libero. Aenean non erat quis sapien elementum facilisis finibus eu quam. Vivamus laoreet lacinia metus, in fringilla arcu aliquam sit amet. Proin tellus diam, euismod in porttitor ac, dapibus eget augue. Maecenas eu sodales elit, semper pharetra mi. Nulla vehicula elit sit amet elementum condimentum. Duis semper bibendum elit, ut tristique mi luctus ut. Morbi in dapibus ligula, eu iaculis ipsum. Sed ut convallis ex. Fusce vel mattis purus. Suspendisse diam ante, malesuada ac mattis vitae, rhoncus quis turpis. Etiam semper molestie bibendum.",
      value: 1000
    }).set('Authorization', id);

    expect(response.status).toBe(200); // Checks response status
    expect(response.body).toHaveProperty('id'); // Checks if it returns an id
  });

  it('should not be able to create a new incident', async () => {
    // Creates a NGO just to get the id (for authorization header)
    const { body: { id: id } } = await request(app).post('/ngos').send({
      name: "NGO name",
      email: "ngo@email.com",
      whatsapp: "11996575472",
      city: "city",
      state: "sp"
    });

    // Tries to post on the /incidents endpoint from the api 
    const response = await request(app).post('/incidents').send({
      title: "Incident title",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer turpis libero, sollicitudin id leo sed, elementum scelerisque sapien. Quisque et aliquet libero. Aenean non erat quis sapien elementum facilisis finibus eu quam. Vivamus laoreet lacinia metus, in fringilla arcu aliquam sit amet. Proin tellus diam, euismod in porttitor ac, dapibus eget augue. Maecenas eu sodales elit, semper pharetra mi. Nulla vehicula elit sit amet elementum condimentum. Duis semper bibendum elit, ut tristique mi luctus ut. Morbi in dapibus ligula, eu iaculis ipsum. Sed ut convallis ex. Fusce vel mattis purus. Suspendisse diam ante, malesuada ac mattis vitae, rhoncus quis turpis. Etiam semper molestie bibendum.",
      value: "value"
    }).set('Authorization', id);

    expect(response.status).toBe(400); // Checks response status
  });

  it('should be able to list incidents in the database', async () => {

    // Creates a NGO just to get the id (for authorization header)
    const { body: { id: id } } = await request(app).post('/ngos').send({
      name: "NGO name",
      email: "ngo@email.com",
      whatsapp: "11996575472",
      city: "city",
      state: "sp"
    });

    // Posts 7 incidents on the /incidents endpoint from the api 
    for (let i = 0; i < 7; i++) {
      await request(app).post('/incidents').send({
        title: "Incident title",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer turpis libero, sollicitudin id leo sed, elementum scelerisque sapien. Quisque et aliquet libero. Aenean non erat quis sapien elementum facilisis finibus eu quam. Vivamus laoreet lacinia metus, in fringilla arcu aliquam sit amet. Proin tellus diam, euismod in porttitor ac, dapibus eget augue. Maecenas eu sodales elit, semper pharetra mi. Nulla vehicula elit sit amet elementum condimentum. Duis semper bibendum elit, ut tristique mi luctus ut. Morbi in dapibus ligula, eu iaculis ipsum. Sed ut convallis ex. Fusce vel mattis purus. Suspendisse diam ante, malesuada ac mattis vitae, rhoncus quis turpis. Etiam semper molestie bibendum.",
        value: 1000
      }).set('Authorization', id);
    }

    // Makes two requests, one for each page
    const { status: firstStatus, body: firstResponse } = await request(app).get('/incidents');
    const { status: secondStatus, body: secondResponse } = await request(app).get('/incidents').query({ page: 2 });

    // Checks if both were successful
    expect(firstStatus).toBe(200);
    expect(secondStatus).toBe(200);

    // Checks if it returns an array
    expect(firstResponse).toBeInstanceOf(Array);
    expect(secondResponse).toBeInstanceOf(Array);

    // Checks if it is returning 6 incidents per page
    expect(firstResponse.length).toBe(6);
    expect(secondResponse.length).toBe(1);

    // Checks if the response is returning all properties
    expect(firstResponse[0]).toHaveProperty('id');
    expect(firstResponse[0]).toHaveProperty('title');
    expect(firstResponse[0]).toHaveProperty('description');
    expect(firstResponse[0]).toHaveProperty('value');
    expect(firstResponse[0]).toHaveProperty('ngo_id');
    expect(firstResponse[0]).toHaveProperty('name');
    expect(firstResponse[0]).toHaveProperty('whatsapp');
    expect(firstResponse[0]).toHaveProperty('email');
    expect(firstResponse[0]).toHaveProperty('city');
    expect(firstResponse[0]).toHaveProperty('state');
  });

  it('should be able to delete an incident', async () => {
    // Creates a NGO just to be able to create an incident
    const { body: { id: ngoId } } = await request(app).post('/ngos').send({
      name: "NGO name",
      email: "ngo@email.com",
      whatsapp: "11996575472",
      city: "city",
      state: "sp"
    });

    // Creates an incident to checks if it's possible to delete it
    const { body: { id: incidentId } } = await request(app).post('/incidents').send({
      title: "Incident title",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer turpis libero, sollicitudin id leo sed, elementum scelerisque sapien. Quisque et aliquet libero. Aenean non erat quis sapien elementum facilisis finibus eu quam. Vivamus laoreet lacinia metus, in fringilla arcu aliquam sit amet. Proin tellus diam, euismod in porttitor ac, dapibus eget augue. Maecenas eu sodales elit, semper pharetra mi. Nulla vehicula elit sit amet elementum condimentum. Duis semper bibendum elit, ut tristique mi luctus ut. Morbi in dapibus ligula, eu iaculis ipsum. Sed ut convallis ex. Fusce vel mattis purus. Suspendisse diam ante, malesuada ac mattis vitae, rhoncus quis turpis. Etiam semper molestie bibendum.",
      value: 1000
    }).set('Authorization', ngoId);

    // Tries to reach delete endpoint from api
    const { status } = await request(app).delete(`/incidents/${incidentId}`).set({ Authorization: ngoId });

    // Checks if the delete was successful
    expect(status).toBe(204);
  });

  it('should not be able to delete an incident', async () => {
    // Creates a NGO just to be able to create an incident
    const { body: { id: ngoId } } = await request(app).post('/ngos').send({
      name: "NGO name",
      email: "ngo@email.com",
      whatsapp: "11996575472",
      city: "city",
      state: "sp"
    });

    // Creates an incident to checks if it's possible to delete it
    const { body: { id: incidentIdOne } } = await request(app).post('/incidents').send({
      title: "Incident title",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer turpis libero, sollicitudin id leo sed, elementum scelerisque sapien. Quisque et aliquet libero. Aenean non erat quis sapien elementum facilisis finibus eu quam. Vivamus laoreet lacinia metus, in fringilla arcu aliquam sit amet. Proin tellus diam, euismod in porttitor ac, dapibus eget augue. Maecenas eu sodales elit, semper pharetra mi. Nulla vehicula elit sit amet elementum condimentum. Duis semper bibendum elit, ut tristique mi luctus ut. Morbi in dapibus ligula, eu iaculis ipsum. Sed ut convallis ex. Fusce vel mattis purus. Suspendisse diam ante, malesuada ac mattis vitae, rhoncus quis turpis. Etiam semper molestie bibendum.",
      value: 1000
    }).set('Authorization', ngoId);

    // Creates an incident to checks if it's possible to delete it
    const { body: { id: incidentIdTwo } } = await request(app).post('/incidents').send({
      title: "Incident title",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer turpis libero, sollicitudin id leo sed, elementum scelerisque sapien. Quisque et aliquet libero. Aenean non erat quis sapien elementum facilisis finibus eu quam. Vivamus laoreet lacinia metus, in fringilla arcu aliquam sit amet. Proin tellus diam, euismod in porttitor ac, dapibus eget augue. Maecenas eu sodales elit, semper pharetra mi. Nulla vehicula elit sit amet elementum condimentum. Duis semper bibendum elit, ut tristique mi luctus ut. Morbi in dapibus ligula, eu iaculis ipsum. Sed ut convallis ex. Fusce vel mattis purus. Suspendisse diam ante, malesuada ac mattis vitae, rhoncus quis turpis. Etiam semper molestie bibendum.",
      value: 1000
    }).set('Authorization', ngoId);

    // Tries to delete with a random Authorization id - It should be a Unauthorized request (401)
    const { status: statusOne } = await request(app).delete(`/incidents/${incidentIdOne}`).set({ Authorization: 'abcdefgh' });
    // Tries to delete without Authorization id - It should be a Bad request (400)
    const { status: statusTwo } = await request(app).delete(`/incidents/${incidentIdTwo}`);

    // Checks if the delete was successful
    expect(statusOne).toBe(401); // Unauthorized
    expect(statusTwo).toBe(400); // Bad request
  });
});