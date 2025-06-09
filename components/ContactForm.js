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
      name="contact-v2"
      method="POST"
      data-netlify="true"
      action="/contact/success"
      data-netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
    >
