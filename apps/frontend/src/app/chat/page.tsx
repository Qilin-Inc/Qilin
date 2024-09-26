'use client'
import { useSocket } from '../../helpers/SocketProvider';
import { useState } from 'react';
import styles from '../../app/page.module.css'

export default function Home() {
  const { sendMessage, messages } = useSocket();
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Message to send:', message); // Debugging log
      sendMessage(message);
      setMessage(''); // Clear the input after sending the message
    } else {
      console.warn('Message is empty'); // Debugging log
    }
  };

  return (
    <div>
      <div>
        <input
          type="text"
          className={styles.chatInput}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className={styles.button} onClick={handleSendMessage}>
          Send Message
        </button>
      </div>
      <div>
        <ul>
          {messages.map((e, index) => (
            <li key={index}>{e}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}