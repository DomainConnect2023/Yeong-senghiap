// import { Platform } from 'react-native';
// import TouchID from 'react-native-touch-id';
// import { setCredentials } from './keychainService';
// import { getGenericPassword } from 'react-native-keychain';

// // check can use or not
// export const checkBiometricSupportednEnrolled = async () => {
//     const optionalConfigObject = await {
//         unifiedErrors: false, // use unified error messages (default false)
//         passcodeFallback: false // if true is passed, it will allow isSupported to return an error if the device is not enrolled in touch id/face id etc. Otherwise, it will just tell you what method is supported, even if the user is not enrolled.  (default false)
//     }

//     return new Promise((resolve, reject) => {
//         TouchID.isSupported(optionalConfigObject).then(biometryType => {
//             console.log("biometryType: "+biometryType);
//             // Success code.
//             if (biometryType && biometryType != 'FaceID') {
//                 // console.log('Supported.');
//                 resolve(true);
//             } else {
//                 let fingerprintLableForOS = Platform.OS == "ios" ? "Touch ID" : "Fingerprint";
//                 reject( fingerprintLableForOS + " is not available on this device");
//             }
//         })
//         .catch(error => {
//             let errorCode = Platform.OS == "ios" ? error.name : error.code;
//             if (errorCode === "LAErrorTouchIDNotEnrolled" || errorCode === "NOT_AVAILABLE" || errorCode === "NOT_ENROLLED") {
//             let fingerprintLableForOS = Platform.OS == "ios" ? "Touch ID" : "Fingerprint";
//                 resolve(fingerprintLableForOS + " has no enrolled fingers. Please go to settings and enable " + fingerprintLableForOS + " on this device.");
//             } else {
//                 //    reject(Platform.OS == "ios" ? error.message : translations.t(error.code));
//             }
//         });
//     });
// }

// // using fingerprint login function
// export const authenticateFingerPrint = (username: string, password: string) => {
//     return new Promise((resolve, reject) => {
//     let fingerprintLableForOS = Platform.OS == "ios" ? "Touch ID" : "Fingerprint";

//         TouchID.authenticate('Login to Domain using ' + fingerprintLableForOS)
//         .then(async (success: unknown) => {
//             const credentials = await getGenericPassword();
//             if (credentials) {
//                 resolve(success)
//                 setCredentials(username,password);
//                 // console.log('Authenticated Successfully', success);
//                 // console.log(credentials);
//             }else {
//                 console.log('No credentials stored');
//             }   
//         })
//         .catch((error: { code: any; }) => {
//             console.log('Authentication Failed', error.code);
//             reject(error);
//         });
//     });
//  }