// components/ContactForm.js
'use client';

import React, { useState } from 'react';
// useRouter is no longer needed if we're not redirecting
// import { useRouter } from 'next/navigation';

const ContactForm = () => {
  // const router = useRouter(); // No longer needed
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null); // 'success' | 'error' | null

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true); // Set loading state
    setSubmissionStatus(null); // Reset status

    const formData = new FormData(event.target);

    try {
      const response = await fetch(event.target.action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(formData).toString(),
      });

      if (response.ok) {
        console.log('Formulier succesvol ingediend!');
        setSubmissionStatus('success');
        event.target.reset(); // Reset form fields
        // No redirect here, just display the success message
      } else {
        console.error('Formulierinzending mislukt:', response.statusText);
        setSubmissionStatus('error');
      }
    } catch (error) {
      console.error('Formulierinzending mislukt (netwerkfout):', error);
      setSubmissionStatus('error');
    } finally {
      setIsSubmitting(false); // Clear loading state
    }
  };

  return (
    <form
      name="contact"
      method="POST"
      data-netlify="true"
      action="/contact/success" // Netlify will still use this for its own redirect after its processing
      data-netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
    >
      {/* Hidden honeypot field for spam prevention using a CSS class */}
      {/* Add this CSS class to your global CSS:
            .visually-hidden {
                clip: rect(0 0 0 0);
                clip-path: inset(50%);
                height: 1px;
                overflow: hidden;
                position: absolute;
                white-space: nowrap;
                width: 1px;
            }
      */}
      <p className="visually-hidden">
        <label>
          Niet invullen als u een mens bent: <input name="bot-field" />
        </label>
      </p>

      {/* Submission Feedback */}
      {submissionStatus === 'success' && (
        <div className="notification is-success">
          Bedankt voor uw bericht! We nemen zo spoedig mogelijk contact met u op.
        </div>
      )}
      {submissionStatus === 'error' && (
        <div className="notification is-danger">
          Er is een fout opgetreden bij het indienen van uw formulier. Probeer het later opnieuw.
        </div>
      )}

      {/* Form Fields */}
      <div className="field">
        <label className="label" htmlFor="name">
          Uw Naam
        </label>
        <div className="control">
          <input className="input" type="text" name="name" id="name" required={true} disabled={isSubmitting} />
        </div>
      </div>
      <div className="field">
        <label className="label" htmlFor="email">
          E-mailadres
        </label>
        <div className="control">
          <input className="input" type="email" name="email" id="email" required={true} disabled={isSubmitting} />
        </div>
      </div>
      <div className="field">
        <label className="label" htmlFor="message">
          Bericht
        </label>
        <div className="control">
          <textarea className="textarea" name="message" id="message" required={true} disabled={isSubmitting}></textarea>
        </div>
      </div>
      <div className="field">
        <button className="button is-link" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Verzenden...' : 'Verzenden'}
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
