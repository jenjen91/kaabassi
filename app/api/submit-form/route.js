// app/api/submit-form/route.js

import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json(); // Get the JSON body for POST requests
    const { name, email, message } = body;

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    console.log('Form Submission Data:', { name, email, message });

    // --- Handle the form data as described above ---

    return NextResponse.json({ message: 'Form submitted successfully!' }, { status: 200 });

  } catch (error) {
    console.error('Form submission error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// You can also define other HTTP methods if needed, e.g., GET, PUT, DELETE
// export async function GET(request) {
//   return NextResponse.json({ message: 'GET request received' });
// }
