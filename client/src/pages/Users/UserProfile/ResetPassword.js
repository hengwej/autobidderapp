import React, { useState } from "react";
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import './styles.css';
import * as api from '../../../utils/UserProfileAPI';
import { useAuth } from '../../../utils/AuthProvider';

const ResetPassword = () => {
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  // CSRF Token
  const { csrfToken } = useAuth();
  // Define state variables for the form
  const [newPassword, setNewPassword] = useState(""); // New password
  // Get the navigate function from the hook
  const navigate = useNavigate();
  const initialValues = {
    password: ''
  };

  const validationSchema = Yup.object().shape({
    password: Yup.string().required("You must enter a password.").min(8, "Password must be at least 8 characters."),
    confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match.').required("Please confirm your password."),
  });

  // Function to show the edit password modal
  const handleShowResetPassword = () => {
    setShowResetPasswordModal(true);
  };

  // Function to close the edit password modal
  const handleCloseResetPassword = () => {
    setShowResetPasswordModal(false);
  };

  // Function to show the confirmation modal
  const handleShowConfirmModal = () => {
    setShowConfirmModal(true);
    setShowResetPasswordModal(false);
  };

  // Function to handle resetting password
  const handleResetPassword = (data) => {
    // Update newValues with the form data
    setNewPassword(data);
    // Display the confirmation modal
    handleShowConfirmModal();
  };

  const handleCloseSuccessModal = () => {
    // Close the success message modal
    setShowSuccessModal(false);

    // Redirect to the login page
    navigate('/auth/login');
  };

  const handleReset = async (requestData) => {
    while (!csrfToken) {
      // Wait until csrfToken becomes available for 1 second
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    try {
      const response = await api.resetPassword(requestData, csrfToken);
      if (response.status === 200) {
        console.log("Password Reset successful");
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error("Failed to reset password:", error);
    }
  };

  // Function to handle user confirmation
  const handleConfirmChanges = (data) => {
    // Close the confirmation and reset password modal
    setShowConfirmModal(false);
    setShowResetPasswordModal(false);

    // Set the new password in the state variable
    setNewPassword(data);

    const requestData = { password: newPassword.password };

    // Send an HTTP request to save the updated password in the database
    handleReset(requestData);
  };

  return (
    <div>
      <Button variant="primary" onClick={handleShowResetPassword} className="UserProfile-button">Reset Password</Button>
      <Modal show={showResetPasswordModal} onHide={handleCloseResetPassword}>
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleResetPassword}>
            {() => (
              <Form>
                <div className="UserProfileForm">
                  <label htmlFor="newPassword">New Password:</label>
                  <Field id="newPassword" type="password" name="password" placeholder="New Password" className="form-control" />
                  <ErrorMessage className="error-message" name="password" component="span" />
                </div>

                <div className="UserProfileForm">
                  <label htmlFor="confirmPassword">Confirm New Password:</label>
                  <Field id="confirmPassword" type="password" name="confirmPassword" placeholder="Confrim New Password" className="form-control" />
                  <ErrorMessage className="error-message" name="confirmPassword" component="span" />
                </div>

                <Modal.Footer className="d-flex justify-content-center">
                  <Button variant="secondary" onClick={handleCloseResetPassword}>Cancel</Button>
                  <Button variant="primary" type="submit" className="UserProfileForm-button">Reset Password</Button>
                </Modal.Footer>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Changes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to reset your password?</p>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>Cancel</Button>
          <Button variant="primary" className="UserProfileForm-button" onClick={handleConfirmChanges}>Confirm</Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Password reset successful! You will be logged out after closing this message.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" className="UserProfileForm-button" onClick={handleCloseSuccessModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ResetPassword;