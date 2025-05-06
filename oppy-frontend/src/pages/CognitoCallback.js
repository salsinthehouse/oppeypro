import React, { useEffect, useRef, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import authConfig from '../config/auth';
import { AuthContext } from '../context/AuthContext';

const { COGNITO_DOMAIN, CLIENT_ID, REDIRECT_URI, CLIENT_SECRET } = authConfig;

const CognitoCallback = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const calledRef = useRef(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const processLogin = async () => {
      if (calledRef.current) return;
      calledRef.current = true;

      try {
        setLoading(true);
        const params = new URLSearchParams(search);
        const code = params.get('code');
        const stateParam = params.get('state');
        const err = params.get('error');
        const errDesc = params.get('error_description');
        const verifier = localStorage.getItem('pkce_verifier');

        if (err) throw new Error(errDesc || err);
        if (!code) throw new Error('No authorization code returned');
        if (!verifier) throw new Error('PKCE verifier missing');

        const form = new URLSearchParams();
        form.append('grant_type', 'authorization_code');
        form.append('client_id', CLIENT_ID);
        form.append('redirect_uri', REDIRECT_URI);
        form.append('code_verifier', verifier);
        form.append('code', code);
        if (CLIENT_SECRET) form.append('client_secret', CLIENT_SECRET);

        const tokenRes = await fetch(
          `${COGNITO_DOMAIN}/oauth2/token`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: form.toString(),
          }
        );

        const data = await tokenRes.json();
        if (!tokenRes.ok) {
          throw new Error(data.error_description || data.error || tokenRes.statusText);
        }

        if (!data.id_token || !data.access_token) {
          throw new Error('Tokens missing in response');
        }

        const decoded = jwtDecode(data.id_token);
        const tokenType = decoded['custom:userType'] || 
                         (decoded['cognito:groups']?.includes('vendors') ? 'vendor' : null);
        const finalType = tokenType || stateParam || 'customer';
        const userName = decoded.name || decoded.email || '';

        // Use the new login function from AuthContext
        login(data.access_token, finalType, userName);

        localStorage.removeItem('pkce_verifier');

        // Navigate to the appropriate dashboard
        const dashboardPath = finalType === 'vendor' ? '/vendor/dashboard' : '/customer/dashboard';
        navigate(dashboardPath, { replace: true });
      } catch (e) {
        console.error('Authentication error:', e);
        setError(e.message);
        localStorage.removeItem('pkce_verifier');
        
        // Redirect back to the appropriate login page based on state
        const params = new URLSearchParams(search);
        const stateParam = params.get('state');
        const loginPath = stateParam ? `/login/${stateParam}` : '/login/customer';
        navigate(loginPath, { replace: true });
      } finally {
        setLoading(false);
      }
    };

    processLogin();
  }, [search, navigate, login]);

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2 style={{ color: 'red' }}>Authentication Error</h2>
        <p>{error}</p>
        <button onClick={() => {
          const params = new URLSearchParams(search);
          const stateParam = params.get('state');
          const loginPath = stateParam ? `/login/${stateParam}` : '/login/customer';
          navigate(loginPath, { replace: true });
        }}>
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Processing login…</h2>
      {loading && <p>Please wait...</p>}
    </div>
  );
};

export default CognitoCallback;
