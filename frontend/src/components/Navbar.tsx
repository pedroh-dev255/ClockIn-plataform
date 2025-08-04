import { useState } from 'react';
import { FaHome, FaCogs, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import icon from '../assets/fav.png';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();
    const navigate = useNavigate();

    const items = [
        { label: t('navbar.home'), icon: <FaHome />, path: '/' },
        { label: t('navbar.registers'), icon: <FaCogs />, path: '/registers'},
        { label: t('navbar.config'), icon: <FaCogs />, path: '/configs' }
    ];

    const handleNavClick = (path: string) => {
        console.log(`Navigating to: ${path}`);
        setOpen(false);
        navigate(path);
    };

    const handleLogout = async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        navigate('/login');
    };

    return (
        <nav style={styles.navbar}>
            <img style={styles.iconF} src={icon} alt="project logo" />
            
            <button
                onClick={() => setOpen(!open)}
                className="navbar-menu-btn"
            >
                {open ? <FaTimes /> : <FaBars />}
            </button>

            <div className={`navbar-items ${open ? 'open' : 'closed'}`}>
                {items.map((item, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleNavClick(item.path)}
                        className="nav-item"
                        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1.0)')}
                    >
                        <span style={styles.icon}>{item.icon}</span>
                        {item.label}
                    </button>
                ))}
                <button
                    onClick={() => {
                        setOpen(false);
                        handleLogout();
                    }}
                    className="nav-item logout"
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1.0)')}
                >
                    <FaSignOutAlt style={styles.icon} />
                </button>
            </div>

            <style>{`
                .navbar-menu-btn {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 2rem;
                    cursor: pointer;
                    margin-left: 1rem;
                    z-index: 1100;
                    display: none;
                }

                .navbar-items {
                    display: flex;
                    gap: 1.5rem;
                    justify-content: flex-end;
                    align-items: center;
                    transition: all 0.3s ease;
                }

                .nav-item {
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    gap: 0.5rem;
                    color: white;
                    text-decoration: none;
                    font-size: 1rem;
                    font-weight: 500;
                    transition: transform 0.2s ease;
                    cursor: pointer;
                    padding: 0.5rem 1rem;
                    border-radius: 0.5rem;
                    background-color: transparent;
                    border: none;
                }

                .logout {
                    background-color: #dc2626;
                    font-weight: 600;
                }

                @media (max-width: 768px) {
                    .navbar-menu-btn {
                        display: block;
                    }

                    .navbar-items {
                        position: absolute;
                        top: 4.5rem;
                        right: 0;
                        background: #1f2937;
                        flex-direction: column;
                        width: 60vw;
                        min-width: 180px;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                        border-radius: 0 0 0.5rem 0.5rem;
                        z-index: 1001;
                        padding: 1rem 0;
                        display: none;
                    }

                    .navbar-items.open {
                        display: flex;
                    }

                    .navbar-items.closed {
                        display: none;
                    }
                }
            `}</style>
        </nav>
    );
}

const styles = {
    navbar: {
        position: 'fixed' as 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        backgroundColor: '#1f2937',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 2rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        zIndex: 1000,
    },
    icon: {
        fontSize: '1.2rem',
    },
    iconF: {
        width: '3rem',
    },
};
