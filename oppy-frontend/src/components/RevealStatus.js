// oppy-frontend/src/components/RevealStatus.js
import React from 'react';
import axios from 'axios';

const RevealStatus = () => {
  const handleSubscribe = async () => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/subscribe`);
    window.location.href = res.data.url;
  };

  return (
    <div>
      <p>To unlock all item locations, subscribe for $2/month:</p>
      <button onClick={handleSubscribe}>Subscribe Now</button>
    </div>
  );
};

export default RevealStatus;
