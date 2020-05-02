const request = require('supertest');
const dbConnection = require('../../src/database/connection');
const app = require('../../src/app');

describe('/sessions endpoint tests', () => {

  beforeEach(async () => {
    await dbConnection.migrate.rollback();
    await dbConnection.migrate.latest();
  });

  afterAll(async () => {
    await dbConnection.destroy();
  });

  it('should be able to log in the app', async () => {
    const { body: { id: ngoId } } = await request(app).post('/ngos').send({
      name: "NGO name",
      email: "ngo@email.com",
      whatsapp: "11996575472",
      city: "city",
      state: "sp"
    });

    const response = await request(app).post('/sessions').send({
      id: ngoId
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name');
    expect(response.body.name).toBe("NGO name");
  });

  it('should not be able to log in the app (no NGO found with this id)', async () => {
    const response = await request(app).post('/sessions').send({
      id: "inexistentid"
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('No NGO found with this ID')
  });

  it('should not be able to log in the app (id must be a string)', async () => {
    const response = await request(app).post('/sessions').send({
      id: 1
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.message).toBe('"id" must be a string');
  });

  it('should not be able to log in the app (id is required)', async () => {
    const response = await request(app).post('/sessions');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.message).toBe('"id" is required');
  })
});