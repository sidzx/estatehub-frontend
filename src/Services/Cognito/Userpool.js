import { CognitoUserPool } from "amazon-cognito-identity-js";
const poolData={
    UserPoolId: "ap-south-2_AgnoYbxTU",
    ClientId: "2ol3r115oosf96plg3movq83s7",
    Storage:sessionStorage
    
}
const userPool=new CognitoUserPool(poolData)

export default userPool