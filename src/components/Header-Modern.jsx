import { Link, NavLink } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { useLocation } from "react-router-dom";
import { useState } from "react";

function Header() {
    const { pathname, hash } = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isHome = pathname === "/";
    const liAccueilActive = isHome && (hash === "" || hash === "#");
    const liSouscriptionActive = pathname === "/souscription";

    return (
        <header style={{
            background: 'var(--bg-primary)',
            boxShadow: 'var(--shadow-sm)',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            borderBottom: '1px solid var(--border-color)'
        }}>
            <div className="container">
                <nav style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem 0'
                }}>
                    {/* Logo */}
                    <Link 
                        to="/" 
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            textDecoration: 'none',
                            fontSize: '1.5rem',
                            fontWeight: '700',
                            color: 'var(--primary-color)'
                        }}
                    >
                        <div style={{
                            width: '40px',
                            height: '40px',
                            background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
                            borderRadius: '50%',
                            marginRight: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                            </svg>
                        </div>
                        VERDISSIA
                    </Link>

                    {/* Desktop Navigation */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2rem'
                    }}>
                        <div style={{
                            display: 'flex',
                            gap: '2rem',
                            listStyle: 'none',
                            margin: 0,
                            padding: 0
                        }}>
                            <li>
                                <HashLink
                                    to="/#home"
                                    className={liAccueilActive ? "active" : ""}
                                    style={{
                                        color: liAccueilActive ? 'var(--primary-color)' : 'var(--text-secondary)',
                                        textDecoration: 'none',
                                        fontWeight: '500',
                                        padding: '0.5rem 0',
                                        borderBottom: liAccueilActive ? '2px solid var(--primary-color)' : 'none',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    Accueil
                                </HashLink>
                            </li>
                            <li>
                                <HashLink
                                    to="/#about"
                                    style={{
                                        color: 'var(--text-secondary)',
                                        textDecoration: 'none',
                                        fontWeight: '500',
                                        padding: '0.5rem 0',
                                        borderBottom: '2px solid transparent',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.color = 'var(--primary-color)';
                                        e.target.style.borderColor = 'var(--primary-color)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.color = 'var(--text-secondary)';
                                        e.target.style.borderColor = 'transparent';
                                    }}
                                >
                                    Services
                                </HashLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/souscription"
                                    className={liSouscriptionActive ? "active" : ""}
                                    style={{
                                        color: liSouscriptionActive ? 'var(--primary-color)' : 'var(--text-secondary)',
                                        textDecoration: 'none',
                                        fontWeight: '500',
                                        padding: '0.5rem 0',
                                        borderBottom: liSouscriptionActive ? '2px solid var(--primary-color)' : 'none',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    Souscription
                                </NavLink>
                            </li>
                        </div>

                        <Link
                            to="/souscription"
                            className="btn btn-primary"
                            style={{
                                padding: '0.5rem 1.5rem',
                                fontSize: '0.875rem',
                                borderRadius: 'var(--radius-lg)'
                            }}
                        >
                            Commencer
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        style={{
                            display: 'none',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.5rem'
                        }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            {isMenuOpen ? (
                                <path d="M18 6L6 18M6 6l12 12"/>
                            ) : (
                                <path d="M3 12h18M3 6h18M3 18h18"/>
                            )}
                        </svg>
                    </button>
                </nav>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div style={{
                        display: 'none',
                        padding: '1rem 0',
                        borderTop: '1px solid var(--border-color)',
                        marginTop: '1rem'
                    }}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem'
                        }}>
                            <HashLink
                                to="/#home"
                                style={{
                                    color: liAccueilActive ? 'var(--primary-color)' : 'var(--text-secondary)',
                                    textDecoration: 'none',
                                    fontWeight: '500',
                                    padding: '0.75rem 0',
                                    borderBottom: liAccueilActive ? '2px solid var(--primary-color)' : 'none'
                                }}
                            >
                                Accueil
                            </HashLink>
                            <HashLink
                                to="/#about"
                                style={{
                                    color: 'var(--text-secondary)',
                                    textDecoration: 'none',
                                    fontWeight: '500',
                                    padding: '0.75rem 0'
                                }}
                            >
                                Services
                            </HashLink>
                            <NavLink
                                to="/souscription"
                                style={{
                                    color: liSouscriptionActive ? 'var(--primary-color)' : 'var(--text-secondary)',
                                    textDecoration: 'none',
                                    fontWeight: '500',
                                    padding: '0.75rem 0',
                                    borderBottom: liSouscriptionActive ? '2px solid var(--primary-color)' : 'none'
                                }}
                            >
                                Souscription
                            </NavLink>
                            <Link
                                to="/souscription"
                                className="btn btn-primary"
                                style={{
                                    marginTop: '1rem',
                                    textAlign: 'center'
                                }}
                            >
                                Commencer
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                @media (max-width: 768px) {
                    nav > div:nth-child(2) {
                        display: none;
                    }
                    
                    nav > button {
                        display: block !important;
                    }
                    
                    nav > div:last-child {
                        display: block !important;
                    }
                }
            `}</style>
        </header>
    );
}

export default Header;
