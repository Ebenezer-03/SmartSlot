import { useState } from 'react';
import { User, Shield, Phone, Hash } from 'lucide-react';
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
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    aadhaar: '',
    otp: '',
  });
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const sendOTP = async () => {
    if (!formData.phone || formData.phone.length !== 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    // Simulate OTP sending
    setTimeout(() => {
      setOtpSent(true);
      setLoading(false);
      toast({
        title: "OTP Sent Successfully",
        description: "Please check your mobile for the verification code. Demo OTP: 123456",
      });
    }, 1500);
  };

  const verifyOTP = async () => {
    if (formData.otp !== '123456') {
      toast({
        title: "Invalid OTP",
        description: "Please enter the correct OTP. Demo OTP: 123456",
        variant: "destructive",
      });
      return;
    }

    const userData = {
      id: `user_${Date.now()}`,
      name: formData.name,
      phone: formData.phone,
      aadhaar: formData.aadhaar,
      type: 'patient' as const,
    };

    login(userData);
    toast({
      title: "Login Successful",
      description: "Welcome to SmartSlot!",
    });
  };

  const demoLogin = (type: 'patient' | 'staff') => {
    const userData = {
      id: `demo_${type}_${Date.now()}`,
      name: type === 'patient' ? 'Demo Patient' : 'Dr. Demo Staff',
      phone: '9876543210',
      type,
    };

    login(userData);
    toast({
      title: "Demo Login Successful",
      description: `Logged in as ${type === 'patient' ? 'Patient' : 'Hospital Staff'}`,
    });
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
            <Shield className="h-8 w-8 text-white" />
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
            <Tabs defaultValue="aadhaar" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="aadhaar">Aadhaar Login</TabsTrigger>
                <TabsTrigger value="demo">Demo Login</TabsTrigger>
              </TabsList>

              <TabsContent value="aadhaar" className="space-y-4">
                {!otpSent ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Mobile Number
                      </Label>
                      <Input
                        id="phone"
                        placeholder="Enter 10-digit mobile number"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        maxLength={10}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="aadhaar" className="flex items-center gap-2">
                        <Hash className="h-4 w-4" />
                        Aadhaar Number (Optional)
                      </Label>
                      <Input
                        id="aadhaar"
                        placeholder="Enter 12-digit Aadhaar number"
                        value={formData.aadhaar}
                        onChange={(e) => handleInputChange('aadhaar', e.target.value)}
                        maxLength={12}
                      />
                    </div>

                    <Button 
                      onClick={sendOTP} 
                      disabled={loading || !formData.name || !formData.phone}
                      className="w-full"
                      size="lg"
                    >
                      {loading ? 'Sending OTP...' : 'Send OTP'}
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="text-center p-4 bg-accent/10 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        OTP sent to +91 {formData.phone}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Demo OTP: <strong>123456</strong>
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="otp">Enter 6-digit OTP</Label>
                      <Input
                        id="otp"
                        placeholder="123456"
                        value={formData.otp}
                        onChange={(e) => handleInputChange('otp', e.target.value)}
                        maxLength={6}
                        className="text-center text-lg font-mono tracking-widest"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setOtpSent(false)}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button 
                        onClick={verifyOTP}
                        disabled={formData.otp.length !== 6}
                        className="flex-1"
                      >
                        Verify OTP
                      </Button>
                    </div>
                  </>
                )}
              </TabsContent>

              <TabsContent value="demo" className="space-y-4">
                <div className="text-center text-sm text-muted-foreground mb-4">
                  Quick access for demonstration
                </div>
                
                <div className="space-y-3">
                  <Button
                    onClick={() => demoLogin('patient')}
                    variant="outline"
                    className="w-full justify-start"
                    size="lg"
                  >
                    <User className="h-5 w-5 mr-3" />
                    Login as Patient
                  </Button>
                  
                  <Button
                    onClick={() => demoLogin('staff')}
                    variant="medical"
                    className="w-full justify-start"
                    size="lg"
                  >
                    <Shield className="h-5 w-5 mr-3" />
                    Login as Hospital Staff
                  </Button>
                </div>
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