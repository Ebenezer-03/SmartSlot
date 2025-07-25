import { useState } from 'react';
import { User, Hospital, Phone, Mail, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { toast } from '@/hooks/use-toast';

const Login = () => {
  const { login } = useAuth();

  // State for SignUp tab
  const [signUpFormData, setSignUpFormData] = useState({
    name: '',
    phone: '',
    dob: '',
    email: ''
  });
  const [signUpLoading, setSignUpLoading] = useState(false);

  // State for Patient Login tab
  const [patientLoginFormData, setPatientLoginFormData] = useState({
    identifier: '', // Can be email or phone
    otp: ''
  });
  const [patientLoginOtpSent, setPatientLoginOtpSent] = useState(false);
  const [patientLoginLoading, setPatientLoginLoading] = useState(false);
  const [isPatientEmailLogin, setIsPatientEmailLogin] = useState(false); // To track if patient login is by email or phone

  // State for Staff Login tab
  const [staffLoginFormData, setStaffLoginFormData] = useState({
    email: '',
    password: '',
    otp: ''
  });
  const [staffLoginOtpSent, setStaffLoginOtpSent] = useState(false);
  const [staffLoginLoading, setStaffLoginLoading] = useState(false);


  // Handle input change for SignUp tab
  const handleSignUpInputChange = (field: string, value: string) => {
    setSignUpFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle input change for Patient Login tab
  const handlePatientLoginInputChange = (field: string, value: string) => {
    setPatientLoginFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle input change for Staff Login tab
  const handleStaffLoginInputChange = (field: string, value: string) => {
    setStaffLoginFormData(prev => ({ ...prev, [field]: value }));
  };

  // Sign Up handler (no OTP)
  const handleSignUp = async () => {
    // Basic validation for phone number
    if (!signUpFormData.phone || signUpFormData.phone.length !== 10 || isNaN(Number(signUpFormData.phone))) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number for signup.",
        variant: "destructive",
      });
      return;
    }
    // Basic validation for email
    if (!signUpFormData.email || !/\S+@\S+\.\S+/.test(signUpFormData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address for signup.",
        variant: "destructive",
      });
      return;
    }
    // Basic validation for name and dob
    if (!signUpFormData.name || !signUpFormData.dob) {
      toast({
        title: "Missing Information",
        description: "Please fill in your full name and date of birth for signup.",
        variant: "destructive",
      });
      return;
    }
    setSignUpLoading(true);
    setTimeout(() => {
      setSignUpLoading(false);
      const userData = {
        id: `user_${Date.now()}`,
        name: signUpFormData.name,
        phone: signUpFormData.phone,
        dob: signUpFormData.dob,
        email: signUpFormData.email,
        type: 'patient' as const,
      };
      login(userData);
      toast({
        title: "Signup & Login Successful",
        description: "Welcome to SmartSlot!",
      });
    }, 1200);
  };

  // Send OTP for Patient Login tab
  const sendPatientLoginOTP = async () => {
    const identifier = patientLoginFormData.identifier;
    const isEmail = identifier.includes('@');

    if (isEmail) {
      if (!identifier || !/\S+@\S+\.\S+/.test(identifier)) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address.",
          variant: "destructive",
        });
        return;
      }
      setIsPatientEmailLogin(true);
    } else {
      if (!identifier || identifier.length !== 10 || isNaN(Number(identifier))) {
        toast({
          title: "Invalid Phone Number",
          description: "Please enter a valid 10-digit phone number.",
          variant: "destructive",
        });
        return;
      }
      setIsPatientEmailLogin(false);
    }

    setPatientLoginLoading(true);
    // Simulate OTP sending
    setTimeout(() => {
      setPatientLoginOtpSent(true);
      setPatientLoginLoading(false);
      toast({
        title: "OTP Sent Successfully",
        description: `Please check your ${isEmail ? 'email' : 'mobile'} for the verification code. Demo OTP: 123456`,
      });
    }, 1500);
  };

  // Verify OTP for Patient Login tab
  const verifyPatientLoginOTP = async () => {
    if (patientLoginFormData.otp !== '123456') {
      toast({
        title: "Invalid OTP",
        description: "Please enter the correct OTP. Demo OTP: 123456",
        variant: "destructive",
      });
      return;
    }

    // Simulate fetching user data based on identifier
    const userData = {
      id: `patient_${Date.now()}`,
      name: 'Logged-in Patient', // Placeholder name for login flow
      phone: isPatientEmailLogin ? '' : patientLoginFormData.identifier, // Set phone if it was a phone login
      email: isPatientEmailLogin ? patientLoginFormData.identifier : '', // Set email if it was an email login
      type: 'patient' as const,
      dob: '' // DOB is not collected in this login flow
    };

    login(userData); // This should trigger navigation to patient dashboard in a real app
    toast({
      title: "Login Successful",
      description: "Redirecting to Patient Dashboard!",
    });
  };

  // Send OTP for Staff Login tab (after email & password)
  const sendStaffLoginOTP = async () => {
    if (!staffLoginFormData.email || !/\S+@\S+\.\S+/.test(staffLoginFormData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    if (!staffLoginFormData.password) {
      toast({
        title: "Missing Password",
        description: "Please enter your password.",
        variant: "destructive",
      });
      return;
    }
    setStaffLoginLoading(true);
    // Simulate OTP sending
    setTimeout(() => {
      setStaffLoginOtpSent(true);
      setStaffLoginLoading(false);
      toast({
        title: "OTP Sent Successfully",
        description: `Please check your email for the verification code. Demo OTP: 123456`,
      });
    }, 1500);
  };

  // Verify OTP for Staff Login tab
  const verifyStaffLoginOTP = async () => {
    if (staffLoginFormData.otp !== '123456') {
      toast({
        title: "Invalid OTP",
        description: "Please enter the correct OTP. Demo OTP: 123456",
        variant: "destructive",
      });
      return;
    }
    // Simulate fetching staff data based on email
    const userData = {
      id: `staff_${Date.now()}`,
      name: 'Logged-in Staff',
      phone: '',
      email: staffLoginFormData.email,
      type: 'staff' as const,
      dob: ''
    };
    login(userData);
    toast({
      title: "Login Successful",
      description: "Redirecting to Staff Dashboard!",
    });
    // Simulate navigation (replace with your router logic if needed)
    window.location.href = '/staff-dashboard';
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
            <Hospital className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            SmartSlot
          </h1>
          <p className="text-muted-foreground">AI Hospital Queue System</p>
        </div>

        <Card className="bg-gradient-card border-0 shadow-medium">
          <CardHeader className="text-center pb-4">
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>
              Sign in to access your queue dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signup" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                <TabsTrigger value="patientLogin">Patient Login</TabsTrigger>
                <TabsTrigger value="staffLogin">Staff Login</TabsTrigger>
              </TabsList>

              {/* Sign Up Tab Content */}
              <TabsContent value="signup" className="space-y-4">
                <>
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Full Name
                    </Label>
                    <Input
                      id="signup-name"
                      placeholder="Enter your full name"
                      value={signUpFormData.name}
                      onChange={(e) => handleSignUpInputChange('name', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-dob" className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z"/></svg>
                      Date of Birth
                    </Label>
                    <Input
                      id="signup-dob"
                      type="date"
                      value={signUpFormData.dob}
                      onChange={(e) => handleSignUpInputChange('dob', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Mobile Number
                    </Label>
                    <Input
                      id="signup-phone"
                      placeholder="Enter 10-digit mobile number"
                      value={signUpFormData.phone}
                      onChange={(e) => handleSignUpInputChange('phone', e.target.value)}
                      maxLength={10}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Id
                    </Label>
                    <Input
                      id="signup-email"
                      placeholder="Enter your Email address"
                      value={signUpFormData.email}
                      onChange={(e) => handleSignUpInputChange('email', e.target.value)}
                      type="email"
                    />
                  </div>

                  <Button
                    onClick={handleSignUp}
                    disabled={signUpLoading || !signUpFormData.name || !signUpFormData.phone || !signUpFormData.dob || !signUpFormData.email}
                    className="w-full"
                    size="lg"
                  >
                    {signUpLoading ? 'Signing Up...' : 'Sign Up'}
                  </Button>
                </>
              </TabsContent>

              {/* Patient Login Tab Content */}
              <TabsContent value="patientLogin" className="space-y-4">
                {!patientLoginOtpSent ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="patient-identifier" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" /> / <Phone className="h-4 w-4" />
                        Email or Mobile Number
                      </Label>
                      <Input
                        id="patient-identifier"
                        placeholder="Enter your email or 10-digit mobile number"
                        value={patientLoginFormData.identifier}
                        onChange={(e) => handlePatientLoginInputChange('identifier', e.target.value)}
                        type="text"
                      />
                    </div>

                    <Button
                      onClick={sendPatientLoginOTP}
                      disabled={patientLoginLoading || !patientLoginFormData.identifier}
                      className="w-full"
                      size="lg"
                    >
                      {patientLoginLoading ? 'Sending OTP...' : 'Send OTP'}
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="text-center p-4 bg-accent/10 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        OTP sent to {patientLoginFormData.identifier}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Demo OTP: <strong>123456</strong>
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="patient-otp">Enter 6-digit OTP</Label>
                      <Input
                        id="patient-otp"
                        placeholder="123456"
                        value={patientLoginFormData.otp}
                        onChange={(e) => handlePatientLoginInputChange('otp', e.target.value)}
                        maxLength={6}
                        className="text-center text-lg font-mono tracking-widest"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setPatientLoginOtpSent(false)}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={verifyPatientLoginOTP}
                        disabled={patientLoginFormData.otp.length !== 6}
                        className="flex-1"
                      >
                        Login
                      </Button>
                    </div>
                  </>
                )}
              </TabsContent>

              {/* Staff Login Tab Content */}
              <TabsContent value="staffLogin" className="space-y-4">
                {!staffLoginOtpSent ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="staff-email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </Label>
                      <Input
                        id="staff-email"
                        placeholder="Enter your email address"
                        value={staffLoginFormData.email}
                        onChange={(e) => handleStaffLoginInputChange('email', e.target.value)}
                        type="email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="staff-password" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Password
                      </Label>
                      <Input
                        id="staff-password"
                        placeholder="Enter your password"
                        value={staffLoginFormData.password}
                        onChange={(e) => handleStaffLoginInputChange('password', e.target.value)}
                        type="password"
                      />
                    </div>
                    <Button
                      onClick={sendStaffLoginOTP}
                      disabled={staffLoginLoading || !staffLoginFormData.email || !staffLoginFormData.password}
                      className="w-full"
                      size="lg"
                    >
                      {staffLoginLoading ? 'Sending OTP...' : 'Send OTP'}
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="text-center p-4 bg-accent/10 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        OTP sent to {staffLoginFormData.email}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Demo OTP: <strong>123456</strong>
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="staff-otp">Enter 6-digit OTP</Label>
                      <Input
                        id="staff-otp"
                        placeholder="123456"
                        value={staffLoginFormData.otp}
                        onChange={(e) => handleStaffLoginInputChange('otp', e.target.value)}
                        maxLength={6}
                        className="text-center text-lg font-mono tracking-widest"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setStaffLoginOtpSent(false)}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={verifyStaffLoginOTP}
                        disabled={staffLoginFormData.otp.length !== 6}
                        className="flex-1"
                      >
                        Login
                      </Button>
                    </div>
                  </>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-muted-foreground">
          Secure authentication powered by SmartSlot AI
        </div>
      </div>
    </div>
  );
};

export default Login;