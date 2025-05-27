// const API_BASE_URL = 'https://bursting-gelding-24.hasura.app/api/rest';

// export const login = async (email, password) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/get-user-id`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'x-hasura-admin-secret': 'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF',
//       },
//       body: JSON.stringify({ email, password })
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.message || 'Login failed');
//     }

//     if (data.get_user_id?.length > 0) {
//       const userId = data.get_user_id[0].id;
//       localStorage.setItem('userId', userId.toString());
//       localStorage.setItem('userEmail', email);
//       return { userId, email };
//     }

//     throw new Error('User not found');
//   } catch (error) {
//     console.error('Login failed:', error);
//     throw error;
//   }
// };

// export const logout = () => {
//   localStorage.removeItem('userId');
//   localStorage.removeItem('userEmail');
// };

// export const getAuthHeaders = () => {
//   const userId = localStorage.getItem('userId') || '';
//   return {
//     'Content-Type': 'application/json',
//     'x-hasura-admin-secret': 'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF',
//     'x-hasura-role': 'user',
//     'x-hasura-user-id': userId
//   };
// };

// export const isAuthenticated = () => {
//   return !!localStorage.getItem('userId');
// };

// export const getCurrentUser = () => {
//   return {
//     id: localStorage.getItem('userId'),
//     email: localStorage.getItem('userEmail')
//   };
// };

// ------------

// src/services/auth.js
const API_BASE_URL = 'https://bursting-gelding-24.hasura.app/api/rest';

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/get-user-id`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': 'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF',
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    if (data.get_user_id?.length > 0) {
      const userId = data.get_user_id[0].id;
      const isAdmin = userId === 3; // Check if user is admin
      
      localStorage.setItem('userId', userId.toString());
      localStorage.setItem('userEmail', email);
      localStorage.setItem('isAdmin', isAdmin.toString());
      
      window.location.reload(); // Force refresh to trigger data fetch
      return { userId, email, isAdmin };
    }

    throw new Error('User not found');
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('userId');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('isAdmin');
  window.location.href = '/login';
};

export const getAuthHeaders = () => {
  const userId = localStorage.getItem('userId') || '';
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  
  return {
    'Content-Type': 'application/json',
    'x-hasura-admin-secret': 'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF',
    'x-hasura-role': isAdmin ? 'admin' : 'user',
    'x-hasura-user-id': userId
  };
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('userId');
};

export const isAdmin = () => {
  return localStorage.getItem('isAdmin') === 'true';
};

export const getCurrentUser = () => {
  return {
    id: localStorage.getItem('userId'),
    email: localStorage.getItem('userEmail'),
    isAdmin: localStorage.getItem('isAdmin') === 'true'
  };
};