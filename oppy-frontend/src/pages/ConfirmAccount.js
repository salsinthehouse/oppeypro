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
      const response = await fetch('http://localhost:5000/api/auth/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Confirmation failed');

      setMessage('Account confirmed successfully! You can now log in.');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="confirm-account">
      <h2>Confirm Your Email</h2>
      <form onSubmit={handleConfirm}>
        <input
          type="email"
          placeholder="Email used to register"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Confirmation Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />

        <button type="submit">Confirm Account</button>
      </form>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default ConfirmAccount;
