import { useState, } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';
import log from '../../Services/Cognito/auth';
import userPool from '../../Services/Cognito/Userpool';
import { useNavigate } from 'react-router-dom'
import { CognitoUser, CognitoUserAttribute } from 'amazon-cognito-identity-js';


export function AuthDialog({ open, onOpenChange, setUser}) {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  
const [showForgot, setShowForgot] = useState(false);
const [forgotData, setForgotData] = useState({
  email: "",
  otp: "",
  newPassword: ""
});

const handleForgotPassword = (e) => {
  e.preventDefault();

  const user = new CognitoUser({
    Username: forgotData.email,
    Pool: userPool
  });

  user.forgotPassword({
    onSuccess: () => {
      toast.success("Password reset successful");
      setShowForgot(false);
    },
    onFailure: (err) => {
      console.error(err);
      toast.error(err.message);
    },
    inputVerificationCode: () => {
      toast.success("OTP sent to your email");
      setForgotPasswordshowOtp(true);
    }
  });
};

const handleConfirmPassword = (e) => {
  e.preventDefault();

  const user = new CognitoUser({
    Username: forgotData.email,
    Pool: userPool
  });

  user.confirmPassword(
    forgotData.otp,
    forgotData.newPassword,
    {
      onSuccess: () => {
        toast.success("Password reset successful");
        setShowForgot(false);
        setForgotPasswordshowOtp(false);
      },
      onFailure: (err) => {
        console.error(err);
        toast.error(err.message);
      }
    }
  );
};

 
  //const navigate = useNavigate()
  const [showOtp, setShowOtp] = useState(false);
  const [forgotPasswordshowOtp,setForgotPasswordshowOtp]=useState(false)
  const [otp, setOtp] = useState("");
  const [userCheck,setUserCheck]=useState()
const handleLogin = (e) => {
  e.preventDefault();

  log(loginData.email, loginData.password, (err, session) => {

    if (err) {
      toast.error("Login failed");
      return;
    }

    toast.success("Logged in successfully");

    console.log("User session:", session);

    // Decode ID token payload
    const payload =
      session.getIdToken().decodePayload();

    const userData = {
      email: payload.email,
      name: payload.name,
      sub: payload.sub,
      role:
        payload["cognito:groups"]?.[0] || "user"
    };

    console.log("Setting user:", userData);

    setUser(userData);   // ✅ GLOBAL STATE SET

    onOpenChange(false); // Close dialog

  });
};


  const handleRegister = (e) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    const attributeList = [];

                const fullName = new CognitoUserAttribute({
                    Name: "name",
                    Value: registerData.fullName,
                });

                const email = new CognitoUserAttribute({
                    Name: "email",
                    Value: registerData.email,
                });

                const phoneNumber = new CognitoUserAttribute({
                    Name: "phone_number",
                    Value: registerData.phone,
                });
    attributeList.push(fullName,email,phoneNumber)

    userPool.signUp(registerData.email, registerData.password, attributeList, null, (err, data) => {
                    if (err) {
                        console.error(err);
                        toast.error("email already in use or something went wrong")

                    }
                    if (data) {
                        console.log(data);
                        toast.success("OTP sent to your email")
                        setShowOtp(true);
                    }
                });

    console.log('Register:', registerData);
    toast.success('Registration successful! Welcome to EstateHub.');
    
  };

      const handleVerifyOtp = (e) => {
        e.preventDefault();
        const User = new CognitoUser({
            Username: registerData.email,
            Pool: userPool,
        });

        User.confirmRegistration(otp, true, (err, result) => {
            if (err) {
                console.error('OTP verification failed:', err);
                toast.error('OTP verification failed,Try Again')
            } else {
                console.log('OTP verification successful:', result);
               // navigate('/login'); // Redirect to login after verification
               // onOpenChange(false);
                setShowOtp(false);
                toast.success("Account verified! You can now log in. ")
            }
        });

    }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to EstateHub</DialogTitle>
        </DialogHeader>
      {!showOtp && (
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                  placeholder="••••••••"
                />
              </div>

              <Button type="submit" className="w-full">
                Sign In
              </Button>

              <div className="text-center text-sm text-gray-600">
                <a href="#" onClick={() => setShowForgot(true)} className="text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>
            </form>
          </TabsContent>

          {/* Register Tab */}
          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="register-name">Full Name</Label>
                <Input
                  id="register-name"
                  type="text"
                  value={registerData.fullName}
                  onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                  required
                  placeholder="John Doe"
                />
              </div>

              <div>
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  required
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <Label htmlFor="register-phone">Phone Number</Label>
                <Input
                  id="register-phone"
                  type="tel"
                  value={registerData.phone}
                  onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                  required
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              
              <div>
                <Label htmlFor="register-password">Password</Label>
                <Input
                  id="register-password"
                  type="password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  required
                  placeholder="••••••••"
                />
              </div>

              <div>
                <Label htmlFor="register-confirm">Confirm Password</Label>
                <Input
                  id="register-confirm"
                  type="password"
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                  required
                  placeholder="••••••••"
                />
              </div>

              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </form>
          </TabsContent>
        </Tabs>)}

          {showOtp && (
          <div className="space-y-4">
            <Label>Enter OTP</Label>
            <Input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Verification code"
            />
            <Button onClick={handleVerifyOtp} className="w-full">
              Verify OTP
            </Button>
          </div>
        )}
        {showForgot && !forgotPasswordshowOtp && (
  <form onSubmit={handleForgotPassword} className="space-y-4">
    <Label>Email</Label>
    <Input
      type="email"
      value={forgotData.email}
      onChange={(e) =>
        setForgotData({ ...forgotData, email: e.target.value })
      }
      required
    />
    <Button type="submit" className="w-full">
      Send OTP
    </Button>
  </form>
)}
{showForgot && forgotPasswordshowOtp && (
  <form onSubmit={handleConfirmPassword} className="space-y-4">
    <Label>OTP</Label>
    <Input
      value={forgotData.otp}
      onChange={(e) =>
        setForgotData({ ...forgotData, otp: e.target.value })
      }
      required
    />

    <Label>New Password</Label>
    <Input
      type="password"
      value={forgotData.newPassword}
      onChange={(e) =>
        setForgotData({
          ...forgotData,
          newPassword: e.target.value
        })
      }
      required
    />

    <Button type="submit" className="w-full">
      Reset Password
    </Button>
  </form>
)}


      </DialogContent>
    </Dialog>
  );
}
