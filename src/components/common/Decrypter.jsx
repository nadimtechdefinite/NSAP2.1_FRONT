import CryptoJS from 'crypto-js';

const Decrypter = (props) => {
  function getDataDec() {
    const SEC_KEY = process.env.REACT_APP_SECRET_KEY_UID;
    const IV_KEY = process.env.REACT_APP_IV_UID;

    try {
      const secretKeySpec = CryptoJS.enc.Utf8.parse(SEC_KEY);
      const iv = CryptoJS.enc.Utf8.parse(IV_KEY);

      // Ensure encrypted data is in Base64 format
      const decryptedData = CryptoJS.AES.decrypt(props.encryptedData, secretKeySpec, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      // Check if decryption was successful and return the decrypted text
      const decryptedText = decryptedData.toString(CryptoJS.enc.Utf8);
      if (!decryptedText) {
        throw new Error('Decryption failed: Invalid data or key');
      }
      return decryptedText;
    } catch (error) {
      console.error('Error decrypting data:', error);
      return 'Decryption failed';
    }
  }

  return getDataDec();
};

export default Decrypter;
