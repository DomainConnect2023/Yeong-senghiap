import * as Keychain from 'react-native-keychain';
import { Platform } from "react-native";

export const setCredentials = async (username: string, password: string) => {
   return new Promise((resolve, reject) => {
       // Store the credentials
       Keychain.setGenericPassword(username, password)
        .then(resp => {
            resolve(true)
        })
        .catch(err => {
            console.log("err: ", err);
            reject(err);
        });
   });
}