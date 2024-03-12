import { useState } from 'react';
import { mhore_hack_backend } from 'declarations/mhore_hack_backend';
import React, { useState } from 'react';
import axios from 'axios';
import { createActor } from '@dfinity/agent';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory, canisterId } from 'src/hackathon_backend/main.mo';

function App(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/login', { email, password });
      console.log(response.data);
      // Handle successful login
    } catch (error) {
      console.error(error.response.data);
      // Handle login error
    }
  };
};
  const [title, setTitle] = useState('');
  const [age, setAge] = useState(0);
  const [userAge, setUserAge] = useState(0);
  const [contentId, setContentId] = useState(0);
  const [message, setMessage] = useState('');

  // content upload
  const uploadContent = async () => {
    try {
      const id = await contentManager.uploadContent(title, age);
      setMessage(`Content uploaded successfully with ID: ${id}`);
    } catch (err) {
      setMessage(`Error uploading content: ${err}`);
    }
  };

  // content deletion
  const deleteContent = async () => {
    try {
      const success = await contentManager.deleteContent(contentId);
      if (success) {
        setMessage('Content deleted successfully');
      } else {
        setMessage('Failed to delete content');
      }
    } catch (err) {
      setMessage(`Error deleting content: ${err}`);
    }
  };

  //check age restriction
  const checkAgeRestriction = async () => {
    try {
      const allowed = await contentManager.checkAgeRestriction(contentId, userAge);
      if (allowed) {
        setMessage('User meets age restriction for content');
      } else {
        setMessage('User does not meet age restriction for content');
      }
    } catch (err) {
      setMessage(`Error checking age restriction: ${err}`);
    }
    const agent = createActor(idlFactory, { canisterId });

function App() {
  const [userId, setUserId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [subscriptionStatus, setSubscriptionStatus] = useState('');
  const [message, setMessage] = useState('');

  const checkSubscription = async () => {
    try {
      const status = await agent.checkSubscription(userId);
      setSubscriptionStatus(status);
      setMessage('');
    } catch (error) {
      setMessage('Error: ' + error);
    }
  };

  const processPayment = async () => {
    try {
      const result = await agent.processPayment(userId, paymentAmount);
      setMessage(result);
    } catch (error) {
      setMessage('Error: ' + error);
    }
  }
  };
 

  return (
    <div>
    <div class="login">
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
      <button onClick={handleLogin}>Login</button>
    </div>
    <div class>
    <h1>Content Management</h1>
    <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
    <input type="number" placeholder="Age Restriction" value={age} onChange={(e) => setAge(parseInt(e.target.value))} />
    <button onClick={uploadContent}>Upload Content</button>

    <hr />

    <input type="number" placeholder="Content ID" value={contentId} onChange={(e) => setContentId(parseInt(e.target.value))} />
    <button onClick={deleteContent}>Delete Content</button>

    <hr />

    <input type="number" placeholder="User Age" value={userAge} onChange={(e) => setUserAge(parseInt(e.target.value))} />
    <button onClick={checkAgeRestriction}>Check Age Restriction</button>

    <p>{message}</p>
  </div>
  <div class="subscriptions">
  <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} />
      <button onClick={checkSubscription}>Check Subscription</button>
      <p>Subscription Status: {subscriptionStatus}</p>
      <br />
      <input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} />
      <button onClick={processPayment}>Process Payment</button>
      <p>{message}</p>
  </div>
  </div>
  );
  };


export default App;
