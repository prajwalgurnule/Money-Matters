export const formatError = (error) => {
  if (error.response) {
    // Server responded with a status code that falls out of 2xx
    return `Server error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`;
  } else if (error.request) {
    // Request was made but no response received
    return 'Network error: Please check your internet connection';
  } else {
    // Something happened in setting up the request
    return `Request error: ${error.message}`;
  }
};

export const retry = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 1) throw error;
    await new Promise(res => setTimeout(res, delay));
    return retry(fn, retries - 1, delay);
  }
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};