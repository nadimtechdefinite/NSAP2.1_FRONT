import CryptoJS from 'crypto-js';

const PasswordEncrypter = (props) => {
  function getPasswordDataEnc() {
    var secretKeySpec = CryptoJS.enc.Utf8.parse('ZOxhxKeDz3NAlCL3');
    var iv = CryptoJS.enc.Utf8.parse('userPassword@Encrypt$');
    const encryptedPasswordData = CryptoJS.AES.encrypt(props.password, secretKeySpec, {
      iv: iv,
      keySize: 128,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return encryptedPasswordData.toString();
  }

  return getPasswordDataEnc();
};

export default PasswordEncrypter;
