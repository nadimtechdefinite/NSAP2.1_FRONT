export const showalertwhenObjectretrnvalidation = (e) => {
  try {
    const responseData = e.response.data;

    // Initialize an array to collect error messages
    const errorMessages = [];

    // Check if the responseData is an object
    if (typeof responseData === 'object') {
      // Iterate over the properties of the object
      for (const field in responseData) {
        // Check the HTTP status code
        const status = e.response.status;
       
        if (status === 500) {
          // Handle Internal Server Error (500) separately
          const msg = e.response.data.message;
          errorMessages.push(msg);
          return errorMessages;
        }else{
          if (Object.prototype.hasOwnProperty.call(responseData, field)) {
            const errorMessage = `${field}: ${responseData[field]}`;
            errorMessages.push(errorMessage);
          }
        }

        
      }
    } else {
      // Handle the case where the response data is not an object
      console.error('Invalid data format. Expected an object.');
      return null; // Exit early if response data is not an object
    }

    // Combine error messages into a single string with new lines
    const errorMessageString = errorMessages.join('\n');

    // Display or log the error message string
    console.log(errorMessageString);

    // Return error messages array if needed for further processing
    return errorMessages;
  } catch (error) {
    // Handle parsing errors or other exceptions
    console.error('Error parsing JSON data:', error);
    return null; // Return null or handle the error as appropriate
  }
};
