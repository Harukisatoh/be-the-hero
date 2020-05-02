const generateUniqueId = require('../../src/utils/generateUniqueId');
const dbConnection = require('../../src/database/connection');

const request = require('supertest');
const app = require('../../src/app');

// Generate ID tests
describe('Generate Unique ID', () => {

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

  // Tests if the function is able to generate an unique ID with 4 bytes
  it('should generate an unique ID with 4 bytes', async () => {
    const id = await generateUniqueId();

    const registeredIds = await dbConnection('ngos').select('id').where('id', id);

    // Tests
    expect(typeof 'id').toBe('string'); // Checks if the ID value is string type
    expect(id).toHaveLength(8); // Checks if the ID has 8 characters
    expect(registeredIds.length).toEqual(0); // Checks if it's an unique ID
  })
});