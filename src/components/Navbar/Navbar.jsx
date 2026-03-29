import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar glass animate-slide-down">
      <Link to="/" className="navbar-brand">BITRA</Link>
      <div className="navbar-links">
        <Link 
          to="/" 
          className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
        >
          Works
        </Link>
        <Link 
          to="/blog" 
          className={`nav-link ${location.pathname === '/blog' ? 'active' : ''}`}
        >
          Blog
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
