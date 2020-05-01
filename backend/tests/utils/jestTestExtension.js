// Extends jest tests
expect.extend({
  // Checks if it's a valid email
  toBeEmail(received) {
    // The same email regex used in HTML5
    const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    // Checks if it's a valid email, if yes, it will return undefined
    const pass = expect(received).toMatch(emailRegex);

    // Checks if pass is undefined (if received is a valid email), if yes, it pass on test
    if (pass === undefined) {
      return {
        message: () =>
          `expected ${received} not to be an email`,
        pass: true
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be a valid email`,
        pass: false
      };
    }
  },

  // Checks if it's a valid brasilian phone number
  toBePhoneNumber(received) {
    // Valid brasilian phone number regex
    const phoneRegex = /^[0-9]{10,11}$/;

    // Checks if it's a valid phone number, if yes, it will return undefined
    const pass = expect(received).toMatch(phoneRegex);

    // Checks if pass is undefined (if received is a valid phone number), if yes, it pass on test
    if (pass === undefined) {
      return {
        message: () =>
          `expected ${received} not to be a whatsapp number`,
        pass: true
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be a valid whatsapp number`,
        pass: false
      };
    }
  }
});