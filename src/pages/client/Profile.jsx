import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const Profile = () => {
  const { user, token } = useContext(AuthContext);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validatePassword = () => {
    const newErrors = {};
    if (!passwordData.currentPassword) newErrors.currentPassword = 'Current password is required';
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      newErrors.confirmNewPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setStatusMessage({ type: '', text: '' });

    const validationErrors = validatePassword();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      await axios.put('http://localhost:5000/api/auth/update-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, config);

      setStatusMessage({ type: 'success', text: 'Password updated successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err) {
      setStatusMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to update password.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <h2>My Account Profile</h2>

      {statusMessage.text && (
        <div className={statusMessage.type === 'success' ? 'success-banner' : 'error-banner'}>
          {statusMessage.text}
        </div>
      )}

      <div className="profile-grid">
        {/* User Info Overview */}
        <div className="profile-card">
          <h3>Personal Details</h3>
          <div className="profile-field">
            <label>Name:</label>
            <p>{user?.name || 'N/A'}</p>
          </div>
          <div className="profile-field">
            <label>Email:</label>
            <p>{user?.email || 'N/A'}</p>
          </div>
          <div className="profile-field">
            <label>Phone Number:</label>
            <p>{user?.phone || 'N/A'}</p>
          </div>
          <div className="profile-field">
            <label>User ID:</label>
            <p>{user?.id || 'Customer'}</p>
          </div>
        </div>

        {/* Change Password Box */}
        <div className="profile-card">
          <h3>Change Password</h3>
          <form onSubmit={handlePasswordUpdate} noValidate>
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handleChange}
                placeholder="••••••••"
              />
              {errors.currentPassword && <span className="field-error">{errors.currentPassword}</span>}
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handleChange}
                placeholder="••••••••"
              />
              {errors.newPassword && <span className="field-error">{errors.newPassword}</span>}
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                name="confirmNewPassword"
                value={passwordData.confirmNewPassword}
                onChange={handleChange}
                placeholder="••••••••"
              />
              {errors.confirmNewPassword && <span className="field-error">{errors.confirmNewPassword}</span>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;