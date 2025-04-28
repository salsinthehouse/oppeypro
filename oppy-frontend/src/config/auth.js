const isDevelopment = process.env.NODE_ENV === 'development';

const config = {
  API_URL: isDevelopment 
    ? 'http://localhost:5000'
    : 'https://oppy.co.nz',
  
  // For development testing
  TEST_EMAIL: 'test@example.com',
  TEST_PASSWORD: 'Test123!'
};

export default config; 