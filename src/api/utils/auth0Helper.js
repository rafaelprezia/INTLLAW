//api/utils/auth0Helper.js

const axios = require("axios");

async function getAuth0ManagementApiToken() {
  const tokenUrl = "https://dev-rutnsxpydci36ykm.us.auth0.com/oauth/token";
  const clientId = "pN23PZBvPvUVo79U9souO4OYAuAx9vnc";
  const clientSecret =
    "uEU-JRODWzPqNI-oYYy36S8CJFaSa1rxl2I6_Vm_mMGRdzYPwR2FRiwH4PzWWByw";
  const audience = "https://dev-rutnsxpydci36ykm.us.auth0.com/api/v2/";

  const response = await axios.post(
    tokenUrl,
    {
      client_id: clientId,
      client_secret: clientSecret,
      audience: audience,
      grant_type: "client_credentials",
    },
    {
      headers: { "content-type": "application/json" },
    }
  );

  return response;
}

module.exports = getAuth0ManagementApiToken;
