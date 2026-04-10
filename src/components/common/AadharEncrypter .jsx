import CryptoJS from 'crypto-js';

const AadharEncrypter = (props) => {
  function getAaddarDataEnc() {
    const SEC_KEY = process.env.REACT_APP_SECRET_KEY_UID;
    const IV_KEY = process.env.REACT_APP_IV_UID;
   

    try {
        var secretKeySpec = CryptoJS.enc.Utf8.parse(SEC_KEY);
        var iv = CryptoJS.enc.Utf8.parse(IV_KEY);

      const encryptedUidData = CryptoJS.AES.encrypt(props.uidNumber, secretKeySpec, {
        iv: iv,
        keySize: 128,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      return encryptedUidData.toString();
    } catch (error) {
      console.error('Error parsing keys:', error);
    }
  }

  return getAaddarDataEnc();
};

export default AadharEncrypter;
