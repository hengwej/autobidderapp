import React, { useState } from "react";
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Modal, Button } from 'react-bootstrap';
import './styles.css';
import * as api from '../../../utils/UserProfileAPI';
import { useAuth } from '../../../utils/AuthProvider';

const EditUserProfile = ({ user, account }) => {
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  // CSRF Token
  const { csrfToken } = useAuth();
  const initialValues = {
    username: account.username || '',
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    emailAddress: user.emailAddress || '',
    address: user.address || '',
    phoneNumber: user.phoneNumber || ''
  };
  const [newValues, setNewValues] = useState({ ...initialValues });
  const validationSchema = Yup.object().shape({
    username: Yup.string().required("You must enter a username."),
    emailAddress: Yup.string().email("Invalid email.").required("You must enter an email."),
    firstName: Yup.string().required("You must enter a first name."),
    lastName: Yup.string().required("You must enter a last name."),
    address: Yup.string().required("You must enter an address."),
    phoneNumber: Yup.string().required("You must enter a phone number.")
  });

  // Function to show the edit profile modal
  const handleShowEditProfile = () => {
    setShowEditProfileModal(true);
  };

  // Function to close the edit profile modal
  const handleCloseEditProfile = () => {
    setShowEditProfileModal(false);
    // Reset the new values to the initial values
    setNewValues({ ...initialValues });
  };

  // Function to show the confirmation modal
  const handleShowConfirmModal = () => {
    setShowConfirmModal(true);
    setShowEditProfileModal(false);
  };

  // Function to handle saving profile
  const handleSaveProfile = (data) => {
    // Update newValues with the form data
    setNewValues(data);
    // Display the confirmation modal
    handleShowConfirmModal();
  };

  const handleCloseSuccessModal = () => {
    // Close the success message modal
    setShowSuccessModal(false);
    // Reload the page
    window.location.reload();
  };

  const handleUpdate = async (requestData) => {
    while (!csrfToken) {
      // Wait until csrfToken becomes available for 1 second
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    try {
      const response = await api.updateUser(requestData, csrfToken);
      if (response.status === 200) {
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error("Failed to edit profile");
    }
  };

  // Function to handle user confirmation
  const handleConfirmChanges = () => {
    // Close the confirmation and edit profile modal
    setShowConfirmModal(false);
    setShowEditProfileModal(false);
    const requestData = {
      newUserData: {
        firstName: newValues.firstName,
        lastName: newValues.lastName,
        address: newValues.address,
        phoneNumber: newValues.phoneNumber,
        emailAddress: newValues.emailAddress
      },
      newAccountData: {
        username: newValues.username,
      },
    };
    // Send an HTTP request to save the updated profile data in the database
    handleUpdate(requestData);
  };

  return (
    <div>
      <Button variant="primary" onClick={handleShowEditProfile} className="UserProfile-button">Edit Profile</Button>
      <Modal show={showEditProfileModal} onHide={handleCloseEditProfile}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik initialValues={newValues} validationSchema={validationSchema} onSubmit={handleSaveProfile}>
            {() => (
              <Form>
                <div className="UserProfileForm">
                  <label htmlFor="editUsername">Username:</label>
                  <Field id="editUsername" type="text" name="username" placeholder="Username" className="form-control" />
                  <ErrorMessage className="error-message" name="username" component="span" />
                </div>
                <div className="UserProfileForm">
                  <label htmlFor="editFirstName">First Name:</label>
                  <Field id="editFirstName" type="text" name="firstName" placeholder="First Name" className="form-control" />
                  <ErrorMessage className="error-message" name="firstName" component="span" />
                </div>
                <div className="UserProfileForm">
                  <label htmlFor="editLastName">Last Name:</label>
                  <Field id="editLastName" type="text" name="lastName" placeholder="Last Name" className="form-control" />
                  <ErrorMessage className="error-message" name="lastName" component="span" />
                </div>
                <div className="UserProfileForm">
                  <label htmlFor="editEmail">Email:</label>
                  <Field id="editEmail" type="email" name="emailAddress" placeholder="Email" className="form-control" />
                  <ErrorMessage className="error-message" name="emailAddress" component="span" />
                </div>
                <div className="UserProfileForm">
                  <label htmlFor="editAddress">Address:</label>
                  <Field id="editAddress" type="text" name="address" placeholder="Address" className="form-control" />
                  <ErrorMessage className="error-message" name="address" component="span" />
                </div>
                <div className="UserProfileForm">
                  <label htmlFor="editPhoneNumber">Phone Number:</label>
                  <Field id="editPhoneNumber" type="text" name="phoneNumber" placeholder="Phone Number" className="form-control" />
                  <ErrorMessage className="error-message" name="phoneNumber" component="span" />
                </div>
                <Modal.Footer className="d-flex justify-content-center">
                  <Button variant="secondary" onClick={handleCloseEditProfile}>Cancel</Button>
                  <Button variant="primary" type="submit" className="UserProfileForm-button">Save Changes</Button>
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
        <Modal.Body className="UserProfileDetails">
          <p>Are you sure you want to save the following changes?</p>
          <p><span>Username:</span> {newValues.username}</p>
          <p><span>First Name:</span> {newValues.firstName}</p>
          <p><span>Last Name:</span> {newValues.lastName}</p>
          <p><span>Email:</span> {newValues.emailAddress}</p>
          <p><span>Address:</span> {newValues.address}</p>
          <p><span>Phone Number:</span> {newValues.phoneNumber}</p>
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
          <p>Profile eddited successfully! Close this message to apply the changes.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" className="UserProfileForm-button" onClick={handleCloseSuccessModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditUserProfile;