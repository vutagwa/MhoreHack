import { useState } from 'react';
import axios from 'axios';
import { createActor } from '@dfinity/agent';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [subscriptionStatus, setSubscriptionStatus] = useState('');
  const [paymentMessage, setPaymentMessage] = useState('');
  const [title, setTitle] = useState('');
  const [ageRestriction, setAgeRestriction] = useState(0);
  const [userAge, setUserAge] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(null);


  const handleLogin = async () => {
    try {
      const response = await axios.post('/login', { email: userId, password });
      if (response.status === 200) {
        setIsLoggedIn(true);
        setError(null);
      } else {
        setError('Incorrect email or password');
      }
    } catch (error) {
      setError('Incorrect email or password');
    }
  };
  const checkSubscription = async () => {
    try {
      const agent = createActor(idlFactory, { canisterId });
      const status = await agent.checkSubscription(userId);
      setSubscriptionStatus(status);
    } catch (error) {
      console.error('Error: ' + error);
    }
  };

  const processPayment = async () => {
    try {
      const agent = createActor(idlFactory, { canisterId });
      const result = await agent.processPayment(userId, paymentAmount);
      setPaymentMessage(result);
    } catch (error) {
      console.error('Error: ' + error);
    }
  };
  const handleUpload = async () => {
    try {
      const response = await axios.post('/upload', { title, ageRestriction }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }});
      console.log(response.data); // Handle response accordingly
    } catch (error) {
      console.error('Error uploading content:', error);
    }
  };

  const handleCheckAgeRestriction = async () => {
    try {
      const response = await axios.get(`/checkAgeRestriction/${videoId}?userAge=${userAge}`);
      console.log(response.data); // Handle response accordingly
    } catch (error) {
      console.error('Error checking age restriction:', error);
    }
  };

  const handleDeleteContent = async (id) => {
    try {
      const response = await axios.delete(`/content/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }});
      console.log(response.data); // Handle response accordingly
    } catch (error) {
      console.error('Error deleting content:', error);
    }
  };

  return (
    <div>
      <div className="login">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Login</button>
      </div>
      <div className="payment">
        <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} />
        <button onClick={checkSubscription}>Check Subscription</button>
        <p>Subscription Status: {subscriptionStatus}</p>
        <br />
        <input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(parseInt(e.target.value))} />
        <button onClick={processPayment}>Process Payment</button>
        <p>{paymentMessage}</p>
      </div>
    </div>
  );
}

export default App;
