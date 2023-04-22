export const getAuthHeader = () => {
  try {
    return localStorage.getItem('wonderToken') || null;
  } catch (error) {
    return null;
  }
};

export const getWaitlistAuthHeader = () => {
  try {
    return localStorage.getItem('waitlistToken') || null;
  } catch (error) {
    return null;
  }
};
