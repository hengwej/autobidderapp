import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import Login from '../src/pages/Auth/Login/index.js';

// Mock the AuthProvider and other dependencies
jest.mock('../src/utils/AuthProvider', () => {
    return {
        useAuth: () => ({
            login: jest.fn(),
            user: null,
        }),
    };
});

describe('Login Form Tests', () => {
    test('Test if Login Form renders correctly', () => {
        render( <
            MemoryRouter >
            <
            Login / >
            <
            /MemoryRouter>
        );

        const usernameLabel = screen.getByText(/Username:/i);
        const passwordLabel = screen.getByText(/Password:/i);
        const loginButton = screen.getByRole('button', { name: /Login/i });

        expect(usernameLabel).toBeInTheDocument();
        expect(passwordLabel).toBeInTheDocument();
        expect(loginButton).toBeInTheDocument();
    });
    
});