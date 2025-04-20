import React, { useState } from 'react';
import '../styles/ConfirmAccount.css';

const ConfirmAccount = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE || ''}/api/auth/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Confirmation failed');

      setMessage('✅ Account confirmed successfully! You can now log in.');
      setEmail('');
      setCode('');

      // Optional: redirect after confirmation
      // setTimeout(() => window.location.href = '/customer/auth', 3000);

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="confirm-account" style={{ padding: '2rem', maxWidth: '400px', margin: 'auto' }}>
      <h2>Confirm Your Email</h2>
      <form onSubmit={handleConfirm}>
        <input
          type="email"
          placeholder="Email used to register"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', marginBottom: '1rem' }}
        />
        <input
          type="text"
          placeholder="Confirmation Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          style={{ width: '100%', marginBottom: '1rem' }}
        />
        <button type="submit" style={{ width: '100%' }}>Confirm Account</button>
      </form>

      {message && <p className="success" style={{ color: 'green', marginTop: '1rem' }}>{message}</p>}
      {error && <p className="error" style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
};

export default ConfirmAccount;
