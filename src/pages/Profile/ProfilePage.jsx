import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { FiUser, FiMail, FiCalendar, FiHome, FiMapPin, FiLock } from 'react-icons/fi';
import './ProfilePage.css';

const ProfilePage = () => {
  const { profile, loading, error } = useAppContext();

  if (loading) return (
    <div className="profile-loading">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="profile-error">
      <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-md w-full">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">Error loading profile: {error}</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (!profile) return (
    <div className="profile-empty">
      <div className="text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">No profile found</h3>
        <p className="mt-1 text-gray-500">We couldn't find any user data.</p>
      </div>
    </div>
  );

  const getInitial = (name) => name ? name.charAt(0).toUpperCase() : 'U';

  const formatDate = (dateString) => {
    if (!dateString) return "Not provided";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div>
          <h1 className="profile-title">My Profile</h1>
          <p className="profile-subtitle">Manage your personal information</p>
        </div>
        {/* <button className="profile-edit-btn">
          <FiEdit className="mr-2" />
          Edit Profile
        </button> */}
      </div>

      <div className="profile-grid">
        {/* Personal Info Card */}
        <div className="profile-card profile-personal-card">
          <div className="profile-card-header">
            <div className="profile-avatar">
              {getInitial(profile.name)}
            </div>
            <div>
              <h2 className="profile-name">{profile.name}</h2>
              <p className="profile-email">{profile.email}</p>
            </div>
          </div>

          <div className="profile-info-section">
            <h3 className="profile-section-title">Personal Info</h3>
            
            <div className="profile-info-item">
              <div className="profile-info-icon">
                <FiUser />
              </div>
              <div>
                <p className="profile-info-label">Full Name</p>
                <p className="profile-info-value">{profile.name || 'Not provided'}</p>
              </div>
            </div>
            
            <div className="profile-info-item">
              <div className="profile-info-icon">
                <FiMail />
              </div>
              <div>
                <p className="profile-info-label">Email</p>
                <p className="profile-info-value">{profile.email || 'Not provided'}</p>
              </div>
            </div>
            
            <div className="profile-info-item">
              <div className="profile-info-icon">
                <FiCalendar />
              </div>
              <div>
                <p className="profile-info-label">Date of Birth</p>
                <p className="profile-info-value">{formatDate(profile.date_of_birth)}</p>
              </div>
            </div>
            
            <div className="profile-info-item">
              <div className="profile-info-icon">
                <FiLock />
              </div>
              <div>
                <p className="profile-info-label">Password</p>
                <p className="profile-info-value">•••••••••••</p>
              </div>
            </div>
          </div>
        </div>

        {/* Address Info Card */}
        <div className="profile-card profile-address-card">
          <div className="profile-card-header">
            <h2 className="profile-section-title1">Address Information</h2>
          </div>
          
          <div className="profile-address-grid">
            <div className="profile-address-column">
              <div className="profile-info-item">
                <div className="profile-info-icon">
                  <FiHome />
                </div>
                <div>
                  <p className="profile-info-label">Present Address</p>
                  <p className="profile-info-value">{profile.present_address || 'Not provided'}</p>
                </div>
              </div>
              
              <div className="profile-info-item">
                <div className="profile-info-icon">
                  <FiHome />
                </div>
                <div>
                  <p className="profile-info-label">Permanent Address</p>
                  <p className="profile-info-value">{profile.permanent_address || 'Not provided'}</p>
                </div>
              </div>
            </div>
            
            <div className="profile-address-column">
              <div className="profile-info-item">
                <div className="profile-info-icon">
                  <FiMapPin />
                </div>
                <div>
                  <p className="profile-info-label">City</p>
                  <p className="profile-info-value">{profile.city || 'Not provided'}</p>
                </div>
              </div>
              
              <div className="profile-info-item">
                <div className="profile-info-icon">
                  <FiMapPin />
                </div>
                <div>
                  <p className="profile-info-label">Postal Code</p>
                  <p className="profile-info-value">{profile.postal_code || 'Not provided'}</p>
                </div>
              </div>
              
              <div className="profile-info-item">
                <div className="profile-info-icon">
                  <FiMapPin />
                </div>
                <div>
                  <p className="profile-info-label">Country</p>
                  <p className="profile-info-value">{profile.country || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;