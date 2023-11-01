import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // Import this for additional matchers
import Login from '../src/pages/Auth/Login/index.js';

test('renders login form', () => {
    render( < Login / > );
    // Check if the form elements are rendered
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
});

test('disables login button initially', () => {
    render( < Login / > );
    // Check if the login button is disabled initially
    expect(screen.getByRole('button', { name: /Login/i })).toBeDisabled();
});

test('enables login button when form is filled', async() => {
    render( < Login / > );
    // Fill out the form fields
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    // Wait for the re-render due to state changes
    await waitFor(() => {
        // Check if the login button is enabled after filling out the form
        expect(screen.getByRole('button', { name: /Login/i })).toBeEnabled();
    });
});

// Add more test cases for other scenarios as needed