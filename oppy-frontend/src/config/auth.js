const isDevelopment = process.env.NODE_ENV === 'development';

const authConfig = {
  // API base (for your axios or fetch calls)
  API_URL: isDevelopment
    ? 'http://localhost:5000'
    : 'https://oppy.co.nz',

  // Cognito Hosted UI domain
  COGNITO_DOMAIN: 'https://ap-southeast-2h3klci7kn.auth.ap-southeast-2.amazoncognito.com',

  // Your App client ID
  CLIENT_ID: '5jf5h16hat2fcju90p0r2tjd6k',

  // No client secret needed for PKCE
  // The single callback endpoint you've whitelisted in Cognito
  REDIRECT_URI: isDevelopment
    ? 'http://localhost:3000/auth/callback'
    : 'https://oppy.co.nz/auth/callback',

  // OAuth settings
  RESPONSE_TYPE: 'code',
  SCOPE:         'openid email profile',
};

export default authConfig;
