// // // // src/services/auth.js
// // // const USERS = [
// // //   { id: 1, email: 'jane.doe@gmail.com', password: 'janedoe@123' },
// // //   { id: 5, email: 'teja@gmail.com', password: 'teja@123' },
// // //   // Add more users up to id 17
// // // ];

// // // export const login = async (email, password) => {
// // //   try {
// // //     const user = USERS.find(u => u.email === email && u.password === password);
// // //     if (user) {
// // //       localStorage.setItem('userId', user.id.toString());
// // //       localStorage.setItem('userEmail', user.email);
// // //       return { userId: user.id, email: user.email };
// // //     }
// // //     throw new Error('Invalid email or password');
// // //   } catch (error) {
// // //     console.error('Login failed:', error);
// // //     throw error;
// // //   }
// // // };

// // // export const logout = () => {
// // //   localStorage.removeItem('userId');
// // //   localStorage.removeItem('userEmail');
// // // };

// // // export const getAuthHeaders = () => {
// // //   const userId = localStorage.getItem('userId') || '1';
// // //   return {
// // //     'Content-Type': 'application/json',
// // //     'x-hasura-admin-secret': 'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF',
// // //     'x-hasura-role': 'user',
// // //     'x-hasura-user-id': userId
// // //   };
// // // };

// // // export const isAuthenticated = () => {
// // //   return !!localStorage.getItem('userId');
// // // };

// // // export const getCurrentUser = () => {
// // //   return {
// // //     id: localStorage.getItem('userId'),
// // //     email: localStorage.getItem('userEmail')
// // //   };
// // // };

// // import { getUserId } from "./api";
// // export const login = async (email, password) => {
// //   try {
// //     // First get user ID from API
// //     const userId = await getUserId(email, password);
    
// //     if (!userId) {
// //       throw new Error('Invalid email or password');
// //     }

// //     // Store user info
// //     localStorage.setItem('userId', userId.toString());
// //     localStorage.setItem('userEmail', email);
    
// //     return { userId, email };
// //   } catch (error) {
// //     console.error('Login failed:', error);
// //     throw error;
// //   }
// // };

// // export const logout = () => {
// //   localStorage.removeItem('userId');
// //   localStorage.removeItem('userEmail');
// // };

// // export const getAuthHeaders = () => {
// //   const userId = localStorage.getItem('userId');
// //   return {
// //     'Content-Type': 'application/json',
// //     'x-hasura-admin-secret': 'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF',
// //     'x-hasura-role': 'user',
// //     'x-hasura-user-id': userId || ''
// //   };
// // };

// // export const isAuthenticated = () => {
// //   return !!localStorage.getItem('userId');
// // };

// // export const getCurrentUser = () => {
// //   return {
// //     id: localStorage.getItem('userId'),
// //     email: localStorage.getItem('userEmail')
// //   };
// // };

// export const login = async (email, password) => {
//   try {
//     // For this demo, we'll use a simple mapping since the get-user-id endpoint isn't working
//     // In a real app, this would come from your backend/API
//     const userMap = {
//       'jane.doe@gmail.com': { id: 1, password: 'janedoe@123' },
//       'teja@gmail.com': { id: 5, password: 'teja@123' }
//     };

//     const user = userMap[email];
    
//     if (user && user.password === password) {
//       localStorage.setItem('userId', user.id.toString());
//       localStorage.setItem('userEmail', email);
//       return { userId: user.id, email };
//     }
    
//     throw new Error('Invalid email or password');
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

export const login = async (email, password) => {
  try {
    // For this demo, we'll use a simple mapping
    const userMap = {
      'jane.doe@gmail.com': { id: 1, password: 'janedoe@123' },
      'teja@gmail.com': { id: 5, password: 'teja@123' }
    };

    const user = userMap[email];
    
    if (user && user.password === password) {
      localStorage.setItem('userId', user.id.toString());
      localStorage.setItem('userEmail', email);
      return { userId: user.id, email };
    }
    
    throw new Error('Invalid email or password');
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('userId');
  localStorage.removeItem('userEmail');
};

export const getAuthHeaders = () => {
  const userId = localStorage.getItem('userId') || '';
  return {
    'Content-Type': 'application/json',
    'x-hasura-admin-secret': 'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF',
    'x-hasura-role': 'user',
    'x-hasura-user-id': userId
  };
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('userId');
};

export const getCurrentUser = () => {
  return {
    id: localStorage.getItem('userId'),
    email: localStorage.getItem('userEmail')
  };
};