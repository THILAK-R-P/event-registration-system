import React, { useState, useEffect } from 'react';
import './DarkModeToggle.css';

const DarkModeToggle = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark-mode');
            setIsDarkMode(true);
        } else {
            document.documentElement.classList.remove('dark-mode');
            setIsDarkMode(false);
        }
    };

    useEffect(() => {
        const handleStorageChange = () => {
            const savedTheme = localStorage.getItem('theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            applyTheme(savedTheme === 'dark' || (!savedTheme && prefersDark) ? 'dark' : 'light');
        };

        handleStorageChange(); // Initial check
        
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('theme-change', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('theme-change', handleStorageChange);
        };
    }, []);

    const toggleDarkMode = () => {
        const newTheme = isDarkMode ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
        window.dispatchEvent(new Event('theme-change'));
    };

    return (
        <button
            className="dark-mode-toggle"
            onClick={toggleDarkMode}
            aria-label="Toggle Dark Mode"
            title="Toggle Dark Mode"
        >
            {isDarkMode ? '☀️' : '🌙'}
        </button>
    );
};

export default DarkModeToggle;
