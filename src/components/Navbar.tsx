"use client";

import { useState, useEffect } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeOnMobile = () => {
    if (window.innerWidth <= 768) {
      setIsOpen(false);
    }
  };

  return (
    <header className={`navbar site-header${isOpen ? " is-open" : ""}`}>
      <div className="container navbar-inner">
        <a className="navbar-brand" href="#top">
          rezn1r
        </a>
        <button
          className="nav-toggle"
          type="button"
          aria-expanded={isOpen}
          aria-controls="site-nav"
          aria-label="Toggle navigation"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <nav id="site-nav">
          <ul className="navbar-nav">
            <li>
              <a href="#home" onClick={closeOnMobile}>
                Home
              </a>
            </li>
            <li>
              <a href="#contact" onClick={closeOnMobile}>
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
