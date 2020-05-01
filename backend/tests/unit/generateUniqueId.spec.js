const generateUniqueId = require('../../src/utils/generateUniqueId');

// Generate ID tests
describe('Generate Unique ID', () => {
  // Tests if the function is able to generate an unique ID with 4 bytes
  it('should generate an ID with 4 bytes', async () => {
    const id = await generateUniqueId();

    // Tests
    expect(typeof 'id').toBe('string'); // Checks if the ID value is string type
    expect(id).toHaveLength(8); // Checks if the ID has 8 characters
  })
});