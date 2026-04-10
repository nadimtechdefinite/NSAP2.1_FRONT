import axiosInstance from 'hooks/useAuthTokenUrl';

export async function getSignedXMLFile(xmlData) {
    try {
        const response = await fetch('http://localhost:8019/signer/initialize', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json, text/javascript, */*; q=0.01', // Add any other required headers here
              'Accept-Language': 'en-US,en;q=0.5',
              'Accept-Encoding': 'gzip, deflate, br',
              'Origin': null,
              'Sec-Fetch-Dest': 'empty',
              'Sec-Fetch-Mode': 'cors',
              'Sec-Fetch-Site': 'cross-site'
          }
          });
          const jsonData = await response.json();
          // console.log("step1----");
      // console.log(jsonData);
      if(jsonData.status==="error"){
        setSnackbar({ children: ""+JSON.stringify(jsonData.errorMessage), severity: 'error' });
        await new Promise(resolve => setTimeout(resolve, 1250)); 
        // alert(jsonData.errorMessage);
      }
    //   const data = await response.json();
    //   return data;
    if(jsonData.initialized){
        // console.log("step2----");
        const data=listCertificate(xmlData);
        return data;
    }
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error; // Rethrow the error to handle it in the component
    }
  }

  async function listCertificate(xmlData){
    try{
        // console.log("step3----");
        const response = await fetch('http://localhost:8019/signer/listCertificates', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json, text/javascript, */*; q=0.01', // Add any other required headers here
              'Accept-Language': 'en-US,en;q=0.5',
              'Accept-Encoding': 'gzip, deflate, br',
              'Origin': null,
              'Sec-Fetch-Dest': 'empty',
              'Sec-Fetch-Mode': 'cors',
              'Sec-Fetch-Site': 'cross-site'
          }
          });
          const jsonData = await response.json();
          // console.log("step4----");
          var flag = false;
          for (var i in jsonData.certificates) {
            if (xmlData.certificate === jsonData.certificates[i].certificateData) {
                const verStatus= await verifyCertificate(xmlData);
                // console.log("verstatus----"+verStatus);
                if(verStatus===1){
                    // console.log("step5----");
                    // console.log("----------"+jsonData.certificates[i].alias);
                return doSign(jsonData.certificates[i].alias,xmlData );

                }
                flag = true;
            }
          }
          if (!flag) {
            alert("No token found matching the registered certificate.\nMake sure you have plugged in the correct token and try again.");
           return;
        }
        return flag;
    }
    catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Rethrow the error to handle it in the component
      }

  }

  async function doSign(alias,xmlData){
    // console.log("step7----");
    const verStatus=await verifyCertificate(xmlData);
    // console.log("step8----");
    // console.log("verify----"+verStatus);
    if(verStatus===1){
        var data=utoa(xmlData.xmlFile);
        // console.log("data----"+data);
        const response = await fetch('http://localhost:8019/signer/signXMLData', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json, text/javascript, */*; q=0.01', // Add any other required headers here
              'Accept-Language': 'en-US,en;q=0.5',
              'Accept-Encoding': 'gzip, deflate, br',
              'Origin': null,
              'Sec-Fetch-Dest': 'empty',
              'Sec-Fetch-Mode': 'cors',
              'Sec-Fetch-Site': 'cross-site'
          },
          body: JSON.stringify({ alias: alias, data: data })
          });
          
          const jsonData = await response.json();
          const xml=await xmlSignature(xmlData,jsonData.token,jsonData.sign);
          // console.log(JSON.stringify(jsonData.sign)+"-------------------------"+JSON.stringify(jsonData.token));
          return xml;
    }
    else{
        return ;
    }
  }
//this method used to verify certificate
  async function verifyCertificate(xmlData){
    try{
    const body={action:"VERIFY",cert_data:xmlData.certificate};
    // console.log("form data-------"+JSON.stringify(body));
    const getUrl=`/dscServiceController/certificate`;
    const response = await axiosInstance.post(getUrl,JSON.stringify(body));
    if (response.status >= 200 && response.status < 300) {
        // setDigitalSignatureData(response.data);
        // console.log("step6----"+response.data);
        return response.data.status_cd

      } else {
        
        return false;
      }
    }
    catch(error){
        console.error("An error occurred while verify certificate:", error);
        return false;
    }
  }
// token is ek, sign is en_sig
//this method used to verify the data
   async function xmlSignature(xmlData,ek,en_sig){
    try{
      //  console.log("step10----"+ek);
    const body={action:"DECRYPT_VERIFY_WITH_CERT",certificate:xmlData.certificate,ek:ek,en_sig:en_sig};
    // console.log("form data-------"+JSON.stringify(body));
    // console.log(xmlData.certificate);
    // console.log("123   "+ek);
    // console.log("---------"+en_sig);
    const getUrl=`/dscServiceController/xmlsignature`;
    // console.log("step11----");
    const response = await axiosInstance.post(getUrl,JSON.stringify(body));
    if (response.status >= 200 && response.status < 300) {
        // setDigitalSignatureData(response.data);
        // console.log("step12----"+JSON.stringify(response.data));
        if(response.data.status_cd==1){
        // console.log("xml----"+atou(response.data.data));
        const jsonData=JSON.parse(atou(response.data.data));
        if(jsonData.status=="SUCCESS"){
          const xml=atou(jsonData.sig);
          // console.log("xml----"+atou(jsonData.sig));
          return xml;
        }
        else{
          alert("There is a problem to verify Signature");
          return false;
        }
      
      } else{
      alert("There is a problem to verify Signature");
      return false;
        }
   
      } else {
        
        return false;
      }
    }
    catch(error){
        console.error("An error occurred while verify certificate:", error);
        return false;
    }
  }

//   / Encode UCS-2 string to base64
function utoa(str) {
    // const encoder = new TextEncoder();
    // const encodedBytes = encoder.encode(str);
    // alert(str);
    // const base64String = btoa(String.fromCharCode(...encodedBytes));
    // return base64String;
        return window.btoa(unescape(encodeURIComponent(str)));
}

// Decode base64 to UCS-2 string
function atou(str) {
    // const decodedString = atob(str);
    // const decodedBytes = Array.from(decodedString, c => c.charCodeAt(0));
    // const decoder = new TextDecoder('utf-8');
    // const decodedUCS2String = decoder.decode(Uint8Array.from(decodedBytes));
    // return decodedUCS2String;
    return decodeURIComponent(escape(window.atob(str)));
}


// Dsc NICD Signer application need to run on java 1.8 version, it will support 1.8 version only
// need to import --> import {getSignedXMLFile} from 'components/digitalSignature/getSignedXMLFile'
// then call the method --> const xml=await getSignedXMLFile(xmlData);