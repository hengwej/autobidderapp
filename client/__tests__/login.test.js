import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import Login from '../src/pages/Auth/Login/index.js';

// Mock the AuthProvider and other dependencies
jest.mock('../src/utils/AuthProvider', () => {
    return {
        useAuth: () => ({
            login: jest.fn(() => ({ status: 200 })),
            user: null,
        }),
    };
});

describe('Login Form Tests', () => {
    test('Test if Login Form renders correctly', () => {
        render(
            <MemoryRouter>
                <Login />npm
            </MemoryRouter>
        );

        const usernameLabel = screen.getByText(/Username:/i);
        const passwordLabel = screen.getByText(/Password:/i);
        const loginButton = screen.getByRole('button', { name: /Login/i });

        expect(usernameLabel).toBeInTheDocument();
        expect(passwordLabel).toBeInTheDocument();
        expect(loginButton).toBeInTheDocument();
        expect(loginButton).toBeDisabled();
    });

    test('validates the login form with valid data', async () => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        // Use a more specific query for the button element
        const usernameField = screen.getByTestId('inputLoginUsername')
        const passwordField = screen.getByTestId('inputLoginPassword');
        const loginButton = screen.getByRole('button', { name: /Login/i });
        const recaptchaRef = screen.getByTestId('reCAPTCHA');

        await act(async () => {
            // Try submitting the form without filling in any fields
            userEvent.type(usernameField, 'byleft555');
            userEvent.type(passwordField, 'byleft555');
            userEvent.click(loginButton);
        });

        await act(async () => {
            // Trigger onChange handler manually to enable the button
            recaptchaRef.props.onChange('mock-recaptcha-value');
        });

        expect(loginButton).toBeEnabled();
        //expect(window.location.pathname).toBe('/auth/confirmation');
    });
});