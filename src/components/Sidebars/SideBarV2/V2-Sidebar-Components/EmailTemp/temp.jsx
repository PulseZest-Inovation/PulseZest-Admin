import React from 'react';
import axios from 'axios';

const PaymentButton = () => {
  const handlePayment = async () => {
    try {
      const response = await axios.post('http://localhost:3001/initiate-payment', {
        mobile: '9719688888',
      });

      if (response.data.success) {
        alert('Payment initiated successfully');
      } else {
        alert('Payment failed');
      }
    } catch (error) {
      console.error('Payment initiation error:', error);
      alert('Payment initiation failed. Please try again.');
    }
  };

  return (
    <button onClick={handlePayment}>
      Pay 1 Unit
    </button>
  );
};

export default PaymentButton;
