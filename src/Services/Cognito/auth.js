
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import userPool from "./Userpool";
import { jwtDecode } from "jwt-decode";

const log = (email, password, callback) => {
    const authDetails = new AuthenticationDetails({
        Username: email,
        Password: password,
    });

    const user = new CognitoUser({
        Username: email,
        Pool: userPool,
        Storage: sessionStorage
    });

    user.authenticateUser(authDetails, {
        onSuccess: (session) => {
            const accessToken = session.getAccessToken().getJwtToken();
            const idToken = session.getIdToken().getJwtToken();

            console.log('✅ Login successful!');
            console.log('🔑 Access Token:', accessToken);
            console.log('🆔 ID Token:', idToken);

            const decodedToken = jwtDecode(idToken);
            const userGroups = decodedToken["cognito:groups"] || [];
            console.log(userGroups)
            sessionStorage.setItem("Role", userGroups[0])

            callback(null, session);
            
        },

        onFailure: (err) => {
            console.error('❌ Login failed:', err.message);

            callback(err, null);
        }


    });
};

export default log;
