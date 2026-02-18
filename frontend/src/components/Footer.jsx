export default function Footer() {
  return (
    <footer className="mt-auto bg-dark border-top border-secondary">
      <div className="container py-2 text-center text-light small">
          © {new Date().getFullYear()} PropertyConnect 🏠 | All rights reserved.
      </div>
    </footer>
  );
}