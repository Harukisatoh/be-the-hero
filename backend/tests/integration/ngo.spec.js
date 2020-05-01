const app = require('../../src/app');

// Database connection
const dbConnection = require('../../src/database/connection');

// Supertest is a library to test using a api
const request = require('supertest');

// NGO tests
describe('/ngos endpoint tests', () => {
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


  // Tests if it's able to create a new NGO in the database
  it('should be able to create a new NGO', async () => {
    // Tries to post on the /ngos endpoint from the api
    const response = await request(app).post('/ngos').send({
      name: "NGO name",
      email: "ngo@email.com",
      whatsapp: "11996575472",
      city: "city",
      state: "sp"
    });

    expect(response.status).toBe(200); // Checks response status
    expect(response.body).toHaveProperty('id'); // Checks if it returns an id
  });

  // Tests if it's able to create a new NGO with invalid email
  it('should not be able to create a new NGO (invalid email)', async () => {
    // Tries to post on the /ngos endpoint from the api
    const response = await request(app).post('/ngos').send({
      name: "NGO name",
      email: "email",
      whatsapp: "11996575472",
      city: "city",
      state: "sp"
    });

    expect(response.status).toBe(400); // Checks if it is a bad request(400)
  });

  // Tests if it's able to create a new NGO with invalid whatsapp
  it('should not be able to create a new NGO (invalid whatsapp)', async () => {
    // Tries to post on the /ngos endpoint from the api
    const response = await request(app).post('/ngos').send({
      name: "NGO name",
      email: "ngo@email.com",
      whatsapp: "573511996575472",
      city: "city",
      state: "sp"
    });

    expect(response.status).toBe(400); // Checks if it is a bad request(400)
  });

  // Tests if it's able to create a new NGO with invalid state
  it('should not be able to create a new NGO (invalid state)', async () => {
    // Tries to post on the /ngos endpoint from the api
    const response = await request(app).post('/ngos').send({
      name: "NGO name",
      email: "ngo@email.com",
      whatsapp: "11996575472",
      city: "city",
      state: "kansas"
    });

    expect(response.status).toBe(400); // Checks if it is a bad request(400)
  });


  // Tests if it's able to reach /ngos endpoint with get method
  it('should be able to list all NGO in the database', async () => {

    // Creates a NGO just to test if it can return back
    await request(app).post('/ngos').send({
      name: "NGO name",
      email: "ngo@email.com",
      whatsapp: "11996575472",
      city: "city",
      state: "sp"
    });

    // Tries to get on the /ngos endpoint from the api
    const response = await request(app).get('/ngos');

    expect(response.status).toBe(200); // Checks response status
    expect(response.body).toBeInstanceOf(Array); // Checks if it returns an array

    // Checks if the response is returning all properties
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('name');
    expect(response.body[0]).toHaveProperty('email');
    expect(response.body[0]).toHaveProperty('whatsapp');
    expect(response.body[0]).toHaveProperty('city');
    expect(response.body[0]).toHaveProperty('state');
  });
})