import Link from 'next/link';

export default function DriverPage() {
  return (
    <div>
      <h1>Driver Page</h1>
      <ul>
        <li>
          <Link href="/driver/trip">Trip</Link>
        </li>
        <li>
          <Link href="/driver/settings">Settings</Link>
        </li>
      </ul>
    </div>
  );
}
