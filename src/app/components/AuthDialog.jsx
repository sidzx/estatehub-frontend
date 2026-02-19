
import { useState, useEffect } from 'react';
import { Building2, UserCircle, Briefcase, Shield, Upload, Eye, EyeOff, RefreshCw, FileText, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';
import log from '../../Services/Cognito/auth';
import { useNavigate } from 'react-router-dom';
import { CognitoUser, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import userPool from '../../Services/Cognito/Userpool';
import { addUser } from '../../Services/api/apicalls';
export function AuthDialog({ setUser}) {

const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview,setProfileImagePreview] =useState(null)
  const [documentFront, setDocumentFront] = useState(null);
  const [documentFrontPreview, setDocumentFrontPreview] = useState(null);
  const [documentBack, setDocumentBack] = useState(null);
  const [documentBackPreview, setDocumentBackPreview] = useState(null);
  const [agencyLogo, setAgencyLogo] = useState(null);
  const [agencyLogoPreview, setAgencyLogoPreview] = useState(null);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaCode, setCaptchaCode] = useState('');
  const [userCaptchaInput, setUserCaptchaInput] = useState('');
  const [userRole,setUserRole]=useState()
  const [test,setTest]=useState()
  const navigate = useNavigate()
  const [showOtp, setShowOtp] = useState(false);
  const [otp,setOtp]=useState()
  const [formData, setFormData] = useState({
    // Basic Fields
    firstName: '',
    lastName: '',
    //username: '',
    email: '',
    password: '',
    confirmPassword: '',
    
    // Personal Information
    dateOfBirth: '',
    gender: '',
    phoneNumber: '',
    
    // Address Fields
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    
    // Identification Document Fields
    documentType: '',
    documentNumber: '',
    issuingCountry: '',
    issueDate: '',
    expiryDate: '',
    
    // Security Fields
    securityQuestion: '',
    securityAnswer: '',
    
    // Optional Fields
    occupation: '',
    companyName: '',
    website: '',
    bio: '',
    
    // Agency Fields (Optional - fills this means user becomes agent)
    agencyName: '',
    agencyLicenseNumber: '',
    agencyAddress: '',
    agencyPhone: '',
    agencyEmail: '',
    agencyWebsite: '',
    yearsInBusiness: '',
    agencySpecialization: '',
    
    // Terms
    acceptTerms: false,
    
    // Role
    //role: 'buyer'
  });


  const securityQuestions = [
    "What was the name of your first pet?",
    "What is your mother's maiden name?",
    "What city were you born in?",
    "What is your favorite book?",
    "What was the name of your elementary school?"
  ];

  const documentTypes = [
    { value: 'national-id', label: 'National ID' },
    { value: 'passport', label: 'Passport' },
    { value: 'drivers-license', label: "Driver's License" },
    { value: 'voter-id', label: 'Voter ID' },
    { value: 'other', label: 'Other' }
  ];

  // Generate simple CAPTCHA on component mount
  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setCaptchaVerified(false);
    setUserCaptchaInput('');
  };

  const verifyCaptcha = () => {
    if (userCaptchaInput === captchaCode) {
      setCaptchaVerified(true);
      toast.success('CAPTCHA verified successfully!');
    } else {
      toast.error('CAPTCHA verification failed. Please try again.');
      generateCaptcha();
    }
  };

  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const base64 = e.target.result.split(",")[1];
        setProfileImagePreview(e.target.result)
        setProfileImage(base64);
        toast.success('Profile picture uploaded!');
      };
      reader.readAsDataURL(file);
      
    }
  };

  const handleDocumentUpload = (e, side) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only JPG, PNG, and PDF files are allowed');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size should be less than 10MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result.split(",")[1];
        if (side === 'front') {
          setDocumentFrontPreview({ url: e.target.result, name: file.name, type: file.type })
          setDocumentFront( base64);
          toast.success('Document front uploaded!');
        } else {
          setDocumentBack( base64);
          setDocumentBackPreview({ url: e.target.result, name: file.name, type: file.type })
          toast.success('Document back uploaded!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeDocument = (side) => {
    if (side === 'front') {
      setDocumentFront(null);
      setDocumentFrontPreview(null)
      toast.info('Document front removed');
    } else {
      setDocumentBack(null);
      setDocumentBackPreview(null)
      toast.info('Document back removed');
    }
  };

  const handleAgencyLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Logo size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result.split(",")[1];
        setAgencyLogoPreview(e.target.result)
        setAgencyLogo(base64);
        toast.success('Agency logo uploaded!');
      };
      reader.readAsDataURL(file);
    }
  };

    const handleVerifyOtp = async (e) => {

  e.preventDefault();

  const User = new CognitoUser({
    Username: formData.email,
    Pool: userPool,
  });

  User.confirmRegistration(otp, true, async (err, result) => {

    if (err) {
      console.error("OTP verification failed:", err);
      toast.error("OTP verification failed, Try Again");
      return;
    }

    console.log("OTP verification successful:", result);

    /* ------------------------------
       FETCH PENDING PROFILE
    ------------------------------ */

    // const pendingProfile = JSON.parse(
    //   sessionStorage.getItem("pendingProfile")
    // );

    if (!test) {
      console.warn("No pending profile found");
    } else {

      try {

        //console.log("Sending profile to backend:", test);

        //const result=await addUser(test);   
        //console.log(result)
        if (result.success===True){

            setFormData=({
                // Basic Fields
                firstName: '',
                lastName: '',
                //username: '',
                email: '',
                password: '',
                confirmPassword: '',
                
                // Personal Information
                dateOfBirth: '',
                gender: '',
                phoneNumber: '',
                
                // Address Fields
                streetAddress: '',
                city: '',
                state: '',
                zipCode: '',
                country: '',
                
                // Identification Document Fields
                documentType: '',
                documentNumber: '',
                issuingCountry: '',
                issueDate: '',
                expiryDate: '',
                
                // Security Fields
                securityQuestion: '',
                securityAnswer: '',
                
                // Optional Fields
                occupation: '',
                companyName: '',
                website: '',
                bio: '',
                
                // Agency Fields (Optional - fills this means user becomes agent)
                agencyName: '',
                agencyLicenseNumber: '',
                agencyAddress: '',
                agencyPhone: '',
                agencyEmail: '',
                agencyWebsite: '',
                yearsInBusiness: '',
                agencySpecialization: '',
                
                // Terms
                acceptTerms: false,
                
                // Role
                //role: 'buyer'
              });
               toast.success("Profile created successfully");
        }

        // sessionStorage.removeItem("pendingProfile");

       

      } catch (backendErr) {

        console.error("Backend profile error:", backendErr);

        toast.error(
          "Account verified but profile creation failed"
        );
      }
    }

    /* ------------------------------
       UI STATE
    ------------------------------ */

    setShowOtp(false);
    setIsLogin(true);

    toast.success(
      "Account verified! You can now log in."
    );
  });
};


  const handleSubmit =async (e) => {
    e.preventDefault();
    console.log("formdata",formData)
    if (isLogin) {
      // Simple login validation
      if (!formData.email || !formData.password) {
        toast.error('Please enter email and password');
        return;
      }
      else{
        log(formData.email, formData.password, (err, session) => {

            if (err) {
              toast.error("Login failed");
              return;
            }

            toast.success("Logged in successfully");

            navigate("/")
            // Decode ID token payload
            const payload =
              session.getIdToken().decodePayload();

            const userData = {
              email: payload.email,
              name: payload["custom:firstName"] ,
              sub: payload.sub,
              role:
                payload["custom:Role"]
            };

            console.log("Setting user:", userData);

            setUser(userData);  

            

          });
      }

    } else {
      
      // Sign up validation
      if (!formData.firstName || !formData.lastName ||  !formData.email || !formData.password) {
        toast.error('Please fill in all required fields');
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

      if (formData.password.length < 8) {
        toast.error('Password must be at least 6 characters');
        return;
      }

      if (!formData.acceptTerms) {
        toast.error('You must accept the Terms & Conditions');
        return;
      }

      // if (!captchaVerified) {
      //   toast.error('Please verify the CAPTCHA');
      //   return;
      // }
      
      const isAgent =
                    formData.agencyName ||
                    formData.agencyLicenseNumber ||
                    formData.agencyAddress ||
                    formData.agencyPhone ||
                    formData.agencyEmail ||
                    formData.agencyWebsite ||
                    formData.yearsInBusiness ||
                    formData.agencySpecialization ||
                    agencyLogo;
      const role = isAgent ? "agent" : "user";
      
      console.log("userrole",role)

      const attributeList = [
                new  CognitoUserAttribute({
                    Name: "custom:firstName",
                    Value: formData.firstName,
                }),
                 new CognitoUserAttribute({
                    Name: "custom:lastName",
                    Value: formData.lastName,
                }),

                 new CognitoUserAttribute({
                    Name: "email",
                    Value: formData.email,
                }),

                 new CognitoUserAttribute({
                    Name: "phone_number",
                    Value: formData.phoneNumber,
                }),

                 new CognitoUserAttribute({
                    Name: "custom:dateOfBirth",
                    Value: formData.dateOfBirth,
                }),
                
                 new CognitoUserAttribute({
                    Name: "custom:gender",
                    Value: formData.gender,
                }),

                 new CognitoUserAttribute({
                    Name: "custom:streetAddress",
                    Value: formData.streetAddress,
                }),

                 new CognitoUserAttribute({
                    Name: "custom:city",
                    Value: formData.city,
                }),

                 new CognitoUserAttribute({
                    Name: "custom:state",
                    Value: formData.state,
                }),

                 new CognitoUserAttribute({
                    Name: "custom:zipCode",
                    Value: formData.zipCode,
                }),

                 new CognitoUserAttribute({
                    Name: "custom:country",
                    Value: formData.country,
                }),

                 new CognitoUserAttribute({
                    Name: "custom:Role",
                    Value: role,
                }),

                  new CognitoUserAttribute({
                    Name:"custom:occupation",
                    Value: formData.occupation,
                }),

                  new CognitoUserAttribute({
                    Name:"custom:bio",
                    Value: formData.bio,
                }),

                new CognitoUserAttribute({
                    Name:"custom:companyName",
                    Value: formData.companyName,
                }),

                new CognitoUserAttribute({
                    Name:"custom:website",
                    Value: formData.website,
                }),
                  
                ];
              
      console.log("attributeList",attributeList)
      userPool.signUp(formData.email, formData.password, attributeList, null, (err, data) => {
                      console.log("entering cognito singup")
                      if (err) {
                          console.error(err);
                          toast.error("email already in use or something went wrong")

                      }
                      if (data) {
                          console.log(data);
                          toast.success("OTP sent to your email")

                          
                          const {
                                password,
                                confirmPassword,
                                ...safeFormData
                              } = formData;
                               const formDataObj=new FormData();
                              formDataObj.append("profileImage", profileImage);
                              formDataObj.append("documentFront", documentFront);
                              formDataObj.append("documentBack", documentBack);
                              formDataObj.append("agencyLogo", agencyLogo);
                              formDataObj.append("Role",role)
                              // Add JSON fields
                              formDataObj.append("data", JSON.stringify(safeFormData));
                              // const payload = {
                              //   ...safeFormData,
                              //   Role:userRole,
                              //   images: {
                              //     profileImage,
                              //     documentFront,
                              //     documentBack,
                              //     agencyLogo
                              //   }
                                
                              // };
                              setTest(formDataObj)
                              console.log('Register:', test);
                              // sessionStorage.setItem(
                              //   "pendingProfile",
                              //   JSON.stringify(payload)
                              // );

                          setShowOtp(true);
                      }
                  });
        
      }
  };


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log(name,value)
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // const handleRoleSelect = (role) => {
  //   setFormData({
  //     ...formData,
  //     role
  //   });
  // };

  return(
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-4">
      <div className={`container mx-auto ${isLogin ? 'max-w-md' : 'max-w-4xl'}`}>
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Building2 className="h-12 w-12 text-blue-600" />
            <span className="text-3xl font-bold text-gray-900">EstateHub</span>
          </div>
          <p className="text-gray-600">Your trusted real estate platform</p>
        </div>

        {/* Login/Register Form */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-center mb-6">
            {isLogin ? 'Sign In' : 'Create Account'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* LOGIN FORM */}
            {isLogin && (
              <>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="relative">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-9 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </>
            )}

            {/* SIGN UP FORM */}
            {!isLogin && !showOtp &&  (
              <>
                {/* Basic Information Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="John"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Doe"
                          required
                        />
                      </div>
                    </div>

                    {/* <div>
                      <Label htmlFor="username">Username *</Label>
                      <Input
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="johndoe123"
                        required
                      />
                    </div> */}

                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                      />
                    </div>

                    <div className="relative">
                      <Label htmlFor="password">Password *</Label>
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-9 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>

                    <div className="relative">
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-9 text-gray-500"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </CardContent>
                </Card>

                {/* Personal Information Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          max={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div>
                        <Label htmlFor="gender">Gender</Label>
                        <Select
                          value={formData.gender}
                          onValueChange={(value) => setFormData({ ...formData, gender: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                     <div>
                      <Label htmlFor="streetAddress">Street Address</Label>
                      <Input
                        id="streetAddress"
                        name="streetAddress"
                        value={formData.streetAddress}
                        onChange={handleChange}
                        placeholder="123 Main Street"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="New York"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State/Province</Label>
                        <Input
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          placeholder="NY"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="zipCode">Zip/Postal Code</Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          placeholder="10001"
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          placeholder="United States"
                        />
                      </div>
                    </div>

                    {/* <div>
                      <Label htmlFor="profilePicture">Profile Picture</Label>
                      <input
                        id="profilePicture"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfileImageUpload}
                      />
                      <label
                        htmlFor="profilePicture"
                        className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors"
                      >
                        {profileImagePreview ? (
                          <div className="flex items-center gap-3">
                            <img src={profileImagePreview} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
                            <span className="text-sm text-gray-600">Click to change image</span>
                          </div>
                        ) : (
                          <>
                            <Upload className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-600">Upload profile picture</span>
                          </>
                        )}
                      </label>
                    </div> */}
                  </CardContent>
                </Card>

                {/* Address Information Section */}
                {/* <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Address Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="streetAddress">Street Address</Label>
                      <Input
                        id="streetAddress"
                        name="streetAddress"
                        value={formData.streetAddress}
                        onChange={handleChange}
                        placeholder="123 Main Street"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="New York"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State/Province</Label>
                        <Input
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          placeholder="NY"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="zipCode">Zip/Postal Code</Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          placeholder="10001"
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          placeholder="United States"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card> */}
{/* 
                Identification Document Section */}
                {/* <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Identification Document</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="documentType">Document Type</Label>
                      <Select
                        value={formData.documentType}
                        onValueChange={(value) => setFormData({ ...formData, documentType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                        <SelectContent>
                          {documentTypes.map((doc) => (
                            <SelectItem key={doc.value} value={doc.value}>
                              {doc.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="documentNumber">Document Number</Label>
                        <Input
                          id="documentNumber"
                          name="documentNumber"
                          value={formData.documentNumber}
                          onChange={handleChange}
                          placeholder="ABC123456789"
                        />
                      </div>
                      <div>
                        <Label htmlFor="issuingCountry">Issuing Country</Label>
                        <Input
                          id="issuingCountry"
                          name="issuingCountry"
                          value={formData.issuingCountry}
                          onChange={handleChange}
                          placeholder="United States"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="issueDate">Issue Date</Label>
                        <Input
                          id="issueDate"
                          type="date"
                          name="issueDate"
                          value={formData.issueDate}
                          onChange={handleChange}
                          max={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          type="date"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleChange}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>

                  
                    <div>
                      <Label htmlFor="documentFront">Document Upload - Front Side</Label>
                      <input
                        id="documentFront"
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        className="hidden"
                        onChange={(e) => handleDocumentUpload(e, 'front')}
                      />
                      {documentFrontPreview ? (
                        <div className="border-2 border-gray-300 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FileText className="h-8 w-8 text-blue-600" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{documentFrontPreview.name}</p>
                                <p className="text-xs text-gray-500">
                                  {documentFrontPreview.type.includes('pdf') ? 'PDF Document' : 'Image File'}
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeDocument('front')}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          {documentFrontPreview.type.includes('image') && (
                            <img
                              src={documentFrontPreview.url}
                              alt="Document Front"
                              className="mt-3 w-full h-32 object-cover rounded"
                            />
                          )}
                        </div>
                      ) : (
                        <label
                          htmlFor="documentFront"
                          className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-blue-500 transition-colors"
                        >
                          <Upload className="h-5 w-5 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            Upload front side (JPG, PNG, PDF - Max 10MB)
                          </span>
                        </label>
                      )}
                    </div>

                    
                    <div>
                      <Label htmlFor="documentBack">Document Upload - Back Side (Optional)</Label>
                      <input
                        id="documentBack"
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        className="hidden"
                        onChange={(e) => handleDocumentUpload(e, 'back')}
                      />
                      {documentBackPreview ? (
                        <div className="border-2 border-gray-300 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FileText className="h-8 w-8 text-blue-600" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{documentBackPreview.name}</p>
                                <p className="text-xs text-gray-500">
                                  {documentBackPreview.type.includes('pdf') ? 'PDF Document' : 'Image File'}
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeDocument('back')}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          {documentBackPreview.type.includes('image') && (
                            <img
                              src={documentBackPreview.url}
                              alt="Document Back"
                              className="mt-3 w-full h-32 object-cover rounded"
                            />
                          )}
                        </div>
                      ) : (
                        <label
                          htmlFor="documentBack"
                          className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-blue-500 transition-colors"
                        >
                          <Upload className="h-5 w-5 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            Upload back side (JPG, PNG, PDF - Max 10MB)
                          </span>
                        </label>
                      )}
                    </div>
                  </CardContent>
                </Card> */}

                {/* Security Section */}
                {/* <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Security Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="securityQuestion">Security Question</Label>
                      <Select
                        value={formData.securityQuestion}
                        onValueChange={(value) => setFormData({ ...formData, securityQuestion: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a security question" />
                        </SelectTrigger>
                        <SelectContent>
                          {securityQuestions.map((question, index) => (
                            <SelectItem key={index} value={question}>
                              {question}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="securityAnswer">Security Answer</Label>
                      <Input
                        id="securityAnswer"
                        name="securityAnswer"
                        value={formData.securityAnswer}
                        onChange={handleChange}
                        placeholder="Your answer"
                      />
                    </div> */}

                    {/* CAPTCHA */}
                    {/* <div>
                      <Label>CAPTCHA Verification *</Label>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-gray-200 px-4 py-3 rounded font-mono text-xl tracking-wider select-none">
                          {captchaCode}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={generateCaptcha}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={userCaptchaInput}
                          onChange={(e) => setUserCaptchaInput(e.target.value)}
                          placeholder="Enter CAPTCHA"
                          disabled={captchaVerified}
                        />
                        <Button
                          type="button"
                          onClick={verifyCaptcha}
                          disabled={captchaVerified}
                          variant={captchaVerified ? "default" : "outline"}
                        >
                          {captchaVerified ? '✓ Verified' : 'Verify'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card> */}

                {/* Optional Information Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Optional Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="occupation">Occupation</Label>
                        <Input
                          id="occupation"
                          name="occupation"
                          value={formData.occupation}
                          onChange={handleChange}
                          placeholder="Software Engineer"
                        />
                      </div>
                      <div>
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input
                          id="companyName"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleChange}
                          placeholder="Acme Corp"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        placeholder="https://example.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="bio">Bio/About Me</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Tell us about yourself..."
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Agency Information Section (Optional - Fills this makes user an agent) */}
                <Card className="border-2 border-blue-200 bg-blue-50/30">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-blue-600" />
                      Agency Information (Optional)
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      Fill in these details if you're registering as a real estate agent. Your account will be automatically upgraded to an agent role.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="agencyName">Agency Name</Label>
                        <Input
                          id="agencyName"
                          name="agencyName"
                          value={formData.agencyName}
                          onChange={handleChange}
                          placeholder="Premium Realty Group"
                        />
                      </div>
                      <div>
                        <Label htmlFor="agencyLicenseNumber">License Number</Label>
                        <Input
                          id="agencyLicenseNumber"
                          name="agencyLicenseNumber"
                          value={formData.agencyLicenseNumber}
                          onChange={handleChange}
                          placeholder="RE-123456"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="agencyAddress">Agency Address</Label>
                      <Input
                        id="agencyAddress"
                        name="agencyAddress"
                        value={formData.agencyAddress}
                        onChange={handleChange}
                        placeholder="456 Business Ave, Suite 100"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="agencyPhone">Agency Phone</Label>
                        <Input
                          id="agencyPhone"
                          type="tel"
                          name="agencyPhone"
                          value={formData.agencyPhone}
                          onChange={handleChange}
                          placeholder="+1 (555) 987-6543"
                        />
                      </div>
                      <div>
                        <Label htmlFor="agencyEmail">Agency Email</Label>
                        <Input
                          id="agencyEmail"
                          type="email"
                          name="agencyEmail"
                          value={formData.agencyEmail}
                          onChange={handleChange}
                          placeholder="info@premiumrealty.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="agencyWebsite">Agency Website</Label>
                        <Input
                          id="agencyWebsite"
                          type="url"
                          name="agencyWebsite"
                          value={formData.agencyWebsite}
                          onChange={handleChange}
                          placeholder="https://premiumrealty.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="yearsInBusiness">Years in Business</Label>
                        <Input
                          id="yearsInBusiness"
                          type="number"
                          name="yearsInBusiness"
                          value={formData.yearsInBusiness}
                          onChange={handleChange}
                          placeholder="5"
                          min="0"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="agencySpecialization">Specialization/Services</Label>
                      <Textarea
                        id="agencySpecialization"
                        name="agencySpecialization"
                        value={formData.agencySpecialization}
                        onChange={handleChange}
                        placeholder="Residential properties, Commercial real estate, Property management..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="agencyLogo">Agency Logo</Label>
                      <input
                        id="agencyLogo"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAgencyLogoUpload}
                      />
                      <label
                        htmlFor="agencyLogo"
                        className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors bg-white"
                      >
                        {agencyLogoPreview ? (
                          <div className="flex items-center gap-3">
                            <img src={agencyLogoPreview} alt="Agency Logo" className="w-16 h-16 object-contain rounded" />
                            <span className="text-sm text-gray-600">Click to change logo</span>
                          </div>
                        ) : (
                          <>
                            <Upload className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-600">Upload agency logo</span>
                          </>
                        )}
                      </label>
                    </div>
                  </CardContent>
                </Card>

                {/* Terms and Conditions */}
                <div className="flex items-start gap-2 p-4 bg-gray-50 rounded-lg">
                  <Checkbox
                    id="acceptTerms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => setFormData({ ...formData, acceptTerms: checked })}
                  />
                  <label htmlFor="acceptTerms" className="text-sm text-gray-700 cursor-pointer">
                    I accept the{' '}
                    <a href="#" className="text-blue-600 hover:underline">
                      Terms & Conditions
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>
              </>
            )}

          {!isLogin && showOtp &&(
             
              <div className="space-y-4">
                <Label>Enter OTP</Label>
                <Input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Verification code"
                />
              </div>

          )}

           { !showOtp ? (<Button type="submit" className="w-full" size="lg">
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>):(<Button onClick={handleVerifyOtp} className="w-full">
              Verify OTP
            </Button>)}
          </form>

          {/* Toggle Login/Register */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>

  );}