// components/ContactForm.js
'use client';

import React, { useState } from 'react'; // Import useState for local component state
import { useRouter } from 'next/navigation';

const ContactForm = () => {
  const router = useRouter();
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
        console.log('Form submitted successfully!');
        setSubmissionStatus('success');
        event.target.reset(); // Reset form fields
        // Optionally, wait a bit before redirecting or show a modal
        setTimeout(() => {
          router.push('/contact/success');
        }, 3000); // Redirect after 3 seconds
      } else {
        console.error('Form submission failed:', response.statusText);
        setSubmissionStatus('error');
      }
    } catch (error) {
      console.error('Form submission failed (network error):', error);
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
      action="/contact/success"
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
          Don’t fill this out if you’re human: <input name="bot-field" />
        </label>
      </p>

      {/* Submission Feedback */}
      {submissionStatus === 'success' && (
        <div className="notification is-success">
          Thank you for your message! We'll get back to you soon. Redirecting...
        </div>
      )}
      {submissionStatus === 'error' && (
        <div className="notification is-danger">
          There was an error submitting your form. Please try again later.
        </div>
      )}

      {/* Form Fields */}
      <div className="field">
        <label className="label" htmlFor="name">
          Your Name
        </label>
        <div className="control">
          <input className="input" type="text" name="name" id="name" required={true} disabled={isSubmitting} />
        </div>
      </div>
      <div className="field">
        <label className="label" htmlFor="email">
          Email
        </label>
        <div className="control">
          <input className="input" type="email" name="email" id="email" required={true} disabled={isSubmitting} />
        </div>
      </div>
      <div className="field">
        <label className="label" htmlFor="message">
          Message
        </label>
        <div className="control">
          <textarea className="textarea" name="message" id="message" required={true} disabled={isSubmitting}></textarea>
        </div>
      </div>
      <div className="field">
        <button className="button is-link" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send'}
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
