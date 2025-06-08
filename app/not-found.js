// app/not-found.js
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="hero is-fullheight is-flex is-justify-content-center is-align-items-center" style={{ backgroundColor: '#f0f0f0' }}>
      <div className="container has-text-centered">
        <h1 className="title is-1 has-text-danger">404</h1>
        <h2 className="subtitle is-3">Pagina niet gevonden</h2>
        <p className="block">
          Helaas konden we de pagina die u zoekt niet vinden.
        </p>
        <Link href="/" className="button is-primary">
          Terug naar de homepage
        </Link>
      </div>
    </div>
  );
}
