import React, { useRef, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../../services/auth';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const createRipple = (e) => {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    ripple.classList.add('ripple-effect');
    
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      {isMobile && (
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <span className={`hamburger ${sidebarOpen ? 'open' : ''}`}></span>
        </button>
      )}
      
      <div 
        className={`sidebar ${sidebarOpen ? 'open' : ''}`} 
        ref={sidebarRef}
        onClick={() => isMobile && setSidebarOpen(false)}
      >
        <div className="sidebar-header">
          <div className="logo-container">
            <img 
              src="/logo.png" 
              alt="Money Matters Logo" 
              className="logo-img" 
            />
          </div>
          <div className="sidebar-header-decoration"></div>
        </div>
        
        <nav className="sidebar-nav">
          <div className="nav-decoration"></div>
          <ul>
            <li className={location.pathname === '/' ? 'active' : ''}>
              <Link to="/" className="nav-link" onClick={createRipple}>
                <div className="nav-icon dashboard-icon"></div>
                <span className="nav-text">Dashboard</span>
                <span className="nav-hover-effect"></span>
              </Link>
            </li>
            <li className={location.pathname === '/transactions' ? 'active' : ''}>
              <Link to="/transactions" className="nav-link" onClick={createRipple}>
                <div className="nav-icon transactions-icon"></div>
                <span className="nav-text">Transactions</span>
                <span className="nav-hover-effect"></span>
              </Link>
            </li>
            <li className={location.pathname === '/profile' ? 'active' : ''}>
              <Link to="/profile" className="nav-link" onClick={createRipple}>
                <div className="nav-icon profile-icon"></div>
                <span className="nav-text">Profile</span>
                <span className="nav-hover-effect"></span>
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <div className="footer-decoration"></div>
          <button onClick={(e) => {
            createRipple(e);
            handleLogout();
          }} className="logout-button">
            <div className="logout-icon"></div>
            <span>Logout</span>
            <span className="logout-hover-effect"></span>
          </button>
        </div>
        
        <div className="sidebar-background"></div>
      </div>
      
      {isMobile && sidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}
    </>
  );
};

export default Sidebar;