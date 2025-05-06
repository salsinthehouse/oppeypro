import { useEffect } from 'react';
import { generateCodeVerifier, generateCodeChallenge } from '../auth/pkce';
import authConfig from '../config/auth';

const VendorLogin = () => {
  useEffect(() => {
    const { COGNITO_DOMAIN, CLIENT_ID, REDIRECT_URI, RESPONSE_TYPE, SCOPE } = authConfig;
    (async () => {
      const verifier = generateCodeVerifier();
      const challenge = await generateCodeChallenge(verifier);
      localStorage.setItem('pkce_verifier', verifier);

      const params = new URLSearchParams({
        client_id:             CLIENT_ID,
        response_type:         RESPONSE_TYPE,
        redirect_uri:          REDIRECT_URI,
        scope:                 SCOPE,
        code_challenge:        challenge,
        code_challenge_method: 'S256',
        state:                 'vendor'
      });

      window.location.href = `${COGNITO_DOMAIN}/oauth2/authorize?${params}`;
    })();
  }, []);

  return null;
};

export default VendorLogin;
