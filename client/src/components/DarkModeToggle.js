import React, { useState, useEffect } from 'react';
import './DarkModeToggle.css';

const DarkModeToggle = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Check local storage for theme preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark-mode');
        }
    }, []);

    const toggleDarkMode = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
            setIsDarkMode(true);
        }
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
