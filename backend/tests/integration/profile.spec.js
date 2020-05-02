const app = require('../../src/app');

const dbConnection = require('../../src/database/connection');

// Supertest is a library to test using a api
const request = require('supertest');

describe('/profile endpoint tests', () => {
  // Before each test
  beforeEach(async () => {
    // Clears the test database
    await dbConnection.migrate.rollback();
    await dbConnection.migrate.latest();
  });

  // After all tests
  afterAll(async () => {
    // Destroy database connection
    await dbConnection.destroy();
  });

  // Tests if it's able to reach /profile endpoint with get method
  it('should be able to list all registered incidents of a NGO', async () => {

    // Creates a NGO and registers an incident just to test if it can return back
    const { body: { id: ngoId } } = await request(app).post('/ngos').send({
      name: "NGO name",
      email: "ngo@email.com",
      whatsapp: "11996575472",
      city: "city",
      state: "sp"
    });

    const expectedIncident = {
      id: 1,
      title: "Incident title",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer turpis libero, sollicitudin id leo sed, elementum scelerisque sapien. Quisque et aliquet libero. Aenean non erat quis sapien elementum facilisis finibus eu quam. Vivamus laoreet lacinia metus, in fringilla arcu aliquam sit amet. Proin tellus diam, euismod in porttitor ac, dapibus eget augue. Maecenas eu sodales elit, semper pharetra mi. Nulla vehicula elit sit amet elementum condimentum. Duis semper bibendum elit, ut tristique mi luctus ut. Morbi in dapibus ligula, eu iaculis ipsum. Sed ut convallis ex. Fusce vel mattis purus. Suspendisse diam ante, malesuada ac mattis vitae, rhoncus quis turpis. Etiam semper molestie bibendum.",
      value: 1000,
      ngo_id: ngoId
    };

    await request(app).post('/incidents').send({
      title: expectedIncident.title,
      description: expectedIncident.description,
      value: expectedIncident.value
    }).set('Authorization', ngoId);

    // Checks if the response is equal the expected
    const response = await request(app).get('/profile').set('Authorization', ngoId);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toEqual(1);
    expect(response.body).toEqual(expect.arrayContaining([expectedIncident]));
  });

  // Tests /profile endpoint without passing an authorization id
  it('should not be able to list incidents of a NGO (no authorization sent)', async () => {
    const response = await request(app).get('/profile');
    expect(response.status).toBe(400);
  });
});