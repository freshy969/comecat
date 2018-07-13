import sha1 from "sha1";

import api from "./api";
import * as config from "../config";
import * as constant from "../const";

export function callSignup({ email }) {
  return api
    .post(constant.ApiUrlSignUp, {
      email: email
    })
    .then(response => {

      if (!response.data) return Promise.reject("Failed to signup");
      if (!response.data.code) return Promise.reject("Failed to signup");

      return Promise.resolve(response.data);
    });

}
