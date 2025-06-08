// components/ContactForm.js
'use client'; // <--- THIS IS CRUCIAL: Declares this a Client Component

import React from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

// Assuming your ContactForm had some state and submission logic
const ContactForm = () => {
  const router = useRouter(); // Initialize the router hook

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Your form submission logic here (e.g., sending data to an API)

    // After successful submission, you would typically redirect
    // Replace Gatsby's navigate('/success') with router.push('/success')
    try {
      // Example: Simulate an API call
      console.log('Form submitted!');
      // await fetch('/api/submit-contact', { method: 'POST', body: new FormData(event.target) });

      // Redirect to a success page or display a success message
      router.push('/contact/success'); // Or wherever your success page is located
      console.log('Redirecting to /contact/success');

    } catch (error) {
      console.error('Form submission failed:', error);
      // Handle error, e.g., display an error message to the user
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Your existing form fields */}
      <div className="field">
        <label className="label" htmlFor={"name"}>
          Your Name
        </label>
        <div className="control">
          <input className="input" type={"text"} name={"name"} id={"name"} required={true} />
        </div>
      </div>
      <div className="field">
        <label className="label" htmlFor={"email"}>
          Email
        </label>
        <div className="control">
          <input className="input" type={"email"} name={"email"} id={"email"} required={true} />
        </div>
      </div>
      <div className="field">
        <label className="label" htmlFor={"message"}>
          Message
        </label>
        <div className="control">
          <textarea className="textarea" name={"message"} id={"message"} required={true}></textarea>
        </div>
      </div>
      <div className="field">
        <button className="button is-link" type="submit">
          Send
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
