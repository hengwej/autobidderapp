import React, { useState } from "react";
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import './styles.css';
import * as api from '../../../utils/UserProfileAPI';

const UserAccountDeletion = () => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  // Get the navigate function from the hook
  const navigate = useNavigate();

  const showDeleteConfirmation = () => {
    setShowConfirmationModal(true);
  };

  const handleDeleteAccount = async () => {
    // Make an HTTP DELETE request to delete the account
    try {
      const response = await api.deleteUser();
      if (response.status === 200) {
        console.log("Account deleted successfully");
        setShowSuccessModal(true);
      }

    } catch (error) {
      console.error("Failed to delete account:", error);
    }

    // Close the confirmation modal
    setShowConfirmationModal(false);
  };


  const handleCloseConfirmation = () => {
    // Close the confirmation modal
    setShowConfirmationModal(false);
  };

  const handleCloseSuccessModal = () => {
    // Close the success message modal
    setShowSuccessModal(false);

    // Redirect to the login page
    navigate('/auth/login');
  };

  return (
    <div>
      <Button variant="danger" onClick={showDeleteConfirmation} className="UserProfile-button">Delete Account</Button>
      <Modal show={showConfirmationModal} onHide={handleCloseConfirmation}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete your account? This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirmation}>Cancel</Button>
          <Button variant="danger" className="UserProfileForm-button" onClick={handleDeleteAccount}>Delete Account</Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Account deleted successfully! Close this message to be redirected to Login.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" className="UserProfileForm-button" onClick={handleCloseSuccessModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserAccountDeletion;