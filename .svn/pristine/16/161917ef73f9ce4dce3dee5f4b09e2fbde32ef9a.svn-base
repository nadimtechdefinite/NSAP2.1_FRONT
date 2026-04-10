

export const setUserInfo = (userInfo) => {
  sessionStorage.setItem('userinfo', JSON.stringify(userInfo));
};

export const getAuthToken = () => {
  const userInfo = JSON.parse(sessionStorage.getItem('userinfo'));
  return userInfo ? userInfo.jwtToken : null;
};

export const getUserInfo = () => {
  return JSON.parse(sessionStorage.getItem('userinfo'));
};

export const checkValidToken = () => {
  const userInfo = JSON.parse(sessionStorage.getItem('userinfo'));
  if (!userInfo || !userInfo.jwtToken || !isTokenValid(userInfo.jwtToken)) {
    return false;
  }
  // alert(userInfo.jwtToken);
  return true;
};

export const removeOTPResponseInfo = (userInfo) => {
  delete userInfo.otpResponse;
};

const decodeJWT = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
};
export const isTokenValid = (token) => {
  if (!token) return false;
  const decodedToken = decodeJWT(token);
  const currentTime = Date.now() / 1000; // Get current time in seconds
  return decodedToken.exp > currentTime;
};


window.addEventListener('unload', () => {
  
  const userInfo = sessionStorage.getItem('userinfo');
  
  if (userInfo !== null) {
    sessionStorage.removeItem('userinfo');
  }
    

});

const checkForExpiredToken = () => {
  const userInfo = JSON.parse(sessionStorage.getItem('userinfo'));
  if (userInfo && !isTokenValid(userInfo.jwtToken)) {
    sessionStorage.removeItem('userinfo');  
  }
};


window.addEventListener('beforeunload', (event) => {
  const userInfo = sessionStorage.getItem('userinfo');
  
  if (userInfo !== null) {
    const confirmationMessage = 'Are you sure you want to leave? Your changes may not be saved.';

    event.returnValue = confirmationMessage; // Standard for most browsers
    return confirmationMessage; // For some older browsers (mostly legacy support)
  }
 
});



// // Call this function on page load to check for expired token
checkForExpiredToken();


