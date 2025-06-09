// components/ContactForm.js (or wherever your form component lives)
import React, { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting...');

    try {
      const response = await fetch('/api/submit-form', { // <-- Target your API route
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('Form submitted successfully!');
        setFormData({ name: '', email: '', message: '' }); // Clear form
      } else {
        setStatus(`Error: ${data.message || 'Something went wrong.'}`);
      }
    } catch (error) {
      console.error('Form submission failed:', error);
      setStatus('An unexpected error occurred.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      name="contact-v2"
      method="POST"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      >
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="message">Message:</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
        ></textarea>
      </div>
      <button type="submit">Submit</button>
      {status && <p>{status}</p>}
    </form>
  );
}
