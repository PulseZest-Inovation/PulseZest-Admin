import React, { useState } from 'react';
import axios from 'axios';

const PaymentForm = () => {
  const [amount, setAmount] = useState('');

  const handleChange = (e) => {
    setAmount(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/api/createPayment', { amount: Number(amount) });
      console.log('Payment response:', response.data);
    } catch (error) {
      console.error('Error creating payment:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Amount (INR):</label>
        <input
          type="number"
          name="amount"
          value={amount}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Pay</button>
    </form>
  );
};

export default PaymentForm;