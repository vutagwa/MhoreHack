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

  const handleLogin = async () => {
    try {
      const response = await axios.post("/api/login", { email, password });
      console.log(response.data);
      // Handle successful login
    } catch (error) {
      console.error(error.response.data);
      // Handle login error
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
