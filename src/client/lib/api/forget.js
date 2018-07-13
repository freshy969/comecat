import sha1 from "sha1";

import api from "./api";
import * as config from "../config";
import * as constant from "../const";

export function callForget({ email }) {
  return api
    .post(constant.ApiUrlForget, {
      email: email
    })
    .then(response => {

      if (!response.data) return Promise.reject("Failed to reset password");
      if (!response.data.code) return Promise.reject("Failed to reset password");

      return Promise.resolve(response.data);
    });

}
