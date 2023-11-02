import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

test('renders login form', () => {
    render( < Login / > );
    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByText(/Login/i);

    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
});

test('validates the login form with invalid data', async() => {
    render( < Login / > );
    const loginButton = screen.getByText(/Login/i);

    // Try submitting the form without filling in any fields
    userEvent.click(loginButton);

    const errorMessage = await screen.findAllByRole('alert');
    expect(errorMessage).toHaveLength(2); // Two error messages for 'username' and 'password'
});

test('submits the login form with valid data', async() => {
    render( < Login / > );
    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByText(/Login/i);

    // Fill in valid data
    userEvent.type(usernameInput, 'testuser');
    userEvent.type(passwordInput, 'password123');
    userEvent.click(loginButton);

    // You may need to await some async actions if any
    // For example, if the login function is asynchronous.
    // await waitFor(() => {
    //   expect(someElement).toBeInTheDocument();
    // });
});