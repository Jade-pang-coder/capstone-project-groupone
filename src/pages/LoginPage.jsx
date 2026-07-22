import React, { useState } from 'react';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        identifier: '', // Username or Email
        password: '',
    });

    const [errorMessage, setErrorMessage] = useState('');

    // Handle text input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMessage('');

        // Basic frontend validation
        if (!formData.identifier || !formData.password) {
            setErrorMessage('Please enter both username/email and password.');
            return;
        }

        console.log('Logging in with:', formData);

        // TODO: Connect to backend Express endpoint
        // Example:
        // fetch('/api/auth/login', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(formData),
        // })
        // .then(res => res.json())
        // .then(data => console.log(data));
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Member Login</h2>

                {errorMessage && <p style={styles.error}>{errorMessage}</p>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    {/* Username / Email Input */}
                    <div style={styles.inputGroup}>
                        <label htmlFor="identifier" style={styles.label}>
                            Username / Email
                        </label>
                        <input
                            type="text"
                            id="identifier"
                            name="identifier"
                            value={formData.identifier}
                            onChange={handleChange}
                            placeholder="Enter your username or email"
                            style={styles.input}
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div style={styles.inputGroup}>
                        <label htmlFor="password" style={styles.label}>
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            style={styles.input}
                            required
                        />
                    </div>

                    {/* Forgot Password Link */}
                    <div style={styles.forgotPasswordWrapper}>
                        <a href="#forgot-password" style={styles.link}>
                            Forgot Password?
                        </a>
                    </div>

                    {/* Login Action Button */}
                    <button type="submit" style={styles.loginButton}>
                        Login
                    </button>
                </form>

                <hr style={styles.divider} />

                {/* Join as Member Section */}
                <div style={styles.registerSection}>
                    <p style={styles.registerText}>Don't have an account?</p>
                    <button
                        type="button"
                        style={styles.secondaryButton}
                        onClick={() => alert('Navigate to Signup Page')}
                    >
                        Join as Member
                    </button>
                </div>
            </div>
        </div>
    );
};

// Inline styles for fast initial prototyping
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        padding: '20px',
        backgroundColor: '#f8f9fa',
    },
    card: {
        backgroundColor: '#ffffff',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center',
    },
    title: {
        marginBottom: '20px',
        fontSize: '1.5rem',
        color: '#333333',
    },
    error: {
        color: '#d9534f',
        fontSize: '0.875rem',
        marginBottom: '15px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        textAlign: 'left',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
    },
    label: {
        fontSize: '0.875rem',
        color: '#555555',
        fontWeight: 'bold',
    },
    input: {
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '1rem',
    },
    forgotPasswordWrapper: {
        textAlign: 'right',
    },
    link: {
        color: '#0066cc',
        fontSize: '0.85rem',
        textDecoration: 'none',
    },
    loginButton: {
        padding: '12px',
        backgroundColor: '#2b3a4a',
        color: '#ffffff',
        border: 'none',
        borderRadius: '4px',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginTop: '10px',
    },
    divider: {
        margin: '25px 0',
        border: 'none',
        borderTop: '1px solid #eee',
    },
    registerSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        alignItems: 'center',
    },
    registerText: {
        margin: 0,
        fontSize: '0.9rem',
        color: '#666666',
    },
    secondaryButton: {
        padding: '10px 20px',
        backgroundColor: 'transparent',
        color: '#2b3a4a',
        border: '1px solid #2b3a4a',
        borderRadius: '4px',
        fontWeight: 'bold',
        cursor: 'pointer',
        width: '100%',
    },
};

export default LoginPage;