const isDevelopment = process.env.NODE_ENV === 'development';

const config = {
  API_URL: isDevelopment 
    ? 'http://localhost:5000'
    : 'https://oppy.co.nz',
  
  // Cognito Configuration
  COGNITO_DOMAIN: 'https://ap-southeast-2h3klci7kn.auth.ap-southeast-2.amazoncognito.com',
  CLIENT_ID: '5jf5h16hat2fcju90p0r2tjd6k',
  CALLBACK_URI: 'https://oppy.co.nz/vendor/callback',
  SCOPE: 'email openid phone',
  RESPONSE_TYPE: 'code',
  STATE: 'vendor-login',
  
  // For development testing
  TEST_EMAIL: 'test@example.com',
  TEST_PASSWORD: 'Test123!'
};

export default config; 