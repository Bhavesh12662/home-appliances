import React, { useState } from 'react';


function Profile({ user, onUpdateProfile }) {
  const [profileData, setProfileData] = useState({
    name: user ? user.name : '',
    email: user ? user.email : '',
    phone: user ? user.phone || '9664977619' : '',
    streetAddress: user ? user.streetAddress || '' : '',
    city: user ? user.city || '' : '',
    state: user ? user.state || '' : '',
    pincode: user ? user.pincode || '' : ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile(profileData);
    }
    setMessage('Profile and delivery address updated successfully!');
  };

  if (!user) {
    return <div className="profile-container"><p>Please log in to view your profile.</p></div>;
  }

  return (
    <div className="profile-container">
      <h2 className="profile-title">User Profile</h2>
      {message && <div className="success-alert">{message}</div>}

      <form onSubmit={handleSubmit}>
        <h3 className="section-divider">Personal Details</h3>
        <div className="form-group">
          <label>Full Name:</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={profileData.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Email Address:</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={profileData.email}
            disabled
          />
        </div>

        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="text"
            name="phone"
            className="form-control"
            value={profileData.phone}
            onChange={handleChange}
          />
        </div>

        <h3 className="section-divider">Saved Address</h3>
        <div className="form-group">
          <label>Street Address:</label>
          <textarea
            name="streetAddress"
            className="form-control"
            rows="2"
            value={profileData.streetAddress}
            onChange={handleChange}
            placeholder="Flat/House No., Building, Street"
          />
        </div>

        <div className="form-group">
          <label>City:</label>
          <input
            type="text"
            name="city"
            className="form-control"
            value={profileData.city}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>State:</label>
          <input
            type="text"
            name="state"
            className="form-control"
            value={profileData.state}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Pincode:</label>
          <input
            type="text"
            name="pincode"
            className="form-control"
            value={profileData.pincode}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn-primary">
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default Profile;