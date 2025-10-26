import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom"; 
import { Zap, Menu, X, TrendingUp, BarChart3, Users } from "lucide-react";
import "../styles/Header.css";
import logo from "../assets/logo.png";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Features", href: "#features", icon: <BarChart3 size={16} /> },
    { name: "How It Works", href: "#how-it-works", icon: <TrendingUp size={16} /> },
    { name: "Testimonials", href: "#testimonials", icon: <Users size={16} /> },
  ];

  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <Navbar
      expand="lg"
      fixed="top"
      className={`custom-navbar ${scrolled ? "scrolled" : ""} ${mobileOpen ? "mobile-open" : ""}`}
      expanded={mobileOpen}
    >
      <Container>
        {/* Logo */}
        <Navbar.Brand as={Link} to="/" className="brand-logo" onClick={closeMobileMenu}>
          <div className="logo-wrapper">
            <Zap size={28} className="logo-icon" />
            <span className="brand-text">
              SANCHAYA
            </span>
          </div>
        </Navbar.Brand>

        {/* Mobile toggle */}
        <Navbar.Toggle 
          aria-controls="basic-navbar-nav" 
          className="nav-toggle"
          onClick={toggleMobileMenu}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </Navbar.Toggle>

        {/* Nav links */}
        <Navbar.Collapse id="basic-navbar-nav" className="nav-collapse">
          <Nav className="nav-links">
            {navItems.map((item, index) => (
              <Nav.Link 
                key={index}
                href={item.href}
                className="nav-link"
                onClick={closeMobileMenu}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.name}
              </Nav.Link>
            ))}
            
            <Link to="/started" onClick={closeMobileMenu}>
              <Button
                variant="gradient"
                className="cta-button"
              >
                <Zap size={16} className="me-2" />
                Start Trading
              </Button>
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;