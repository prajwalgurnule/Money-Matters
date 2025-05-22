import React from 'react';
import { useAppContext } from '../../context/AppContext';
import './ProfilePage.css';

const ProfilePage = () => {
  const { profile, loading, error } = useAppContext();

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!profile) return <div>No profile data available</div>;

  const getInitial = (name) => name ? name.charAt(0).toUpperCase() : '?';

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1 className="profile-title">Profile</h1>
        {/* <button className="add-transaction-btn">+ Add Transaction</button> */}
      </div>

      <div className="profile-card glass">
        <div className="profile-card-header">
          <div className="avatar">{getInitial(profile.name)}</div>
          <h2>Personal Information</h2>
        </div>

        <div className="profile-info-grid">
          {[
            ['Your Name', profile.name],
            ['Email', profile.email],
            ['Date of Birth', profile.date_of_birth],
            ['Username', profile.username || profile.name],
            ['Password', '************'],
            ['Present Address', profile.present_address],
            ['Permanent Address', profile.permanent_address],
            ['City', profile.city],
            ['Postal Code', profile.postal_code],
            ['Country', profile.country],
          ].map(([label, value], index) => (
            <div className="info-item" key={index}>
              <label>{label}</label>
              <div>{value || 'Not provided'}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
