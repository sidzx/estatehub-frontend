import { CognitoUserPool } from "amazon-cognito-identity-js";
const poolData={
    UserPoolId: "eu-north-1_TQnjonVOu",
    ClientId: "4vierhpaba3f3uieajhifuc2lo",
    Storage:sessionStorage
    
}
const userPool=new CognitoUserPool(poolData)

export default userPool