import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  Users, 
  AlertCircle, 
  Calendar, 
  QrCode, 
  LogOut, 
  RefreshCw,
  Heart,
  Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useQueue } from '@/contexts/QueueContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { EmergencyBanner } from '@/components/EmergencyBanner';
import { ChatBot } from '@/components/ChatBot';
import { QRScanner } from '@/components/QRScanner';
import { toast } from '@/hooks/use-toast';
import ScheduleAppointment from '@/pages/ScheduleAppointment';

const PatientDashboard = () => {
  const { user, logout } = useAuth();
  const { queueData, getPatientByToken, refreshQueue } = useQueue();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Find current user's active patient record
  const userPatient = queueData.patients.find(
    p => p.phone === user?.phone && p.status === 'waiting'
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      refreshQueue();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(timer);
  }, [refreshQueue]);

  const handleQRScan = (tokenNumber: string) => {
    const patient = getPatientByToken(tokenNumber);
    if (patient) {
      toast({
        title: "Token Found",
        description: `Patient: ${patient.name}, Position: ${patient.position}, Wait Time: ${patient.estimatedWaitTime} min`,
      });
    } else {
      toast({
        title: "Token Not Found",
        description: "Please check the token number and try again",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  const urgencyColors = {
    High: 'urgent',
    Medium: 'moderate',
    Low: 'low',
  } as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      <EmergencyBanner />
      
      {/* Header */}
      <div className="bg-gradient-card border-b shadow-soft">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">SmartSlot</h1>
                <p className="text-sm text-muted-foreground">Patient Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <QRScanner onScan={handleQRScan} />
              <ThemeToggle />
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.name}</h2>
          <p className="text-muted-foreground">
            {currentTime.toLocaleString()} • Hospital Queue Management
          </p>
        </div>

        {/* Current Status */}
        {userPatient ? (
          <Card className="mb-8 bg-gradient-card border-0 shadow-medium">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Your Current Status
                  </CardTitle>
                  <CardDescription>Real-time queue position and updates</CardDescription>
                </div>
                <Badge variant={urgencyColors[userPatient.urgency]} className="text-sm">
                  {userPatient.urgency} Priority
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {userPatient.tokenNumber}
                  </div>
                  <p className="text-sm text-muted-foreground">Your Token</p>
                </div>
                <div className="text-center p-4 bg-accent/5 rounded-lg">
                  <div className="text-3xl font-bold text-accent mb-2">
                    #{userPatient.position}
                  </div>
                  <p className="text-sm text-muted-foreground">Position in Queue</p>
                </div>
                <div className="text-center p-4 bg-warning/5 rounded-lg">
                  <div className="text-3xl font-bold text-warning mb-2">
                    {userPatient.estimatedWaitTime}m
                  </div>
                  <p className="text-sm text-muted-foreground">Estimated Wait</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
                <h4 className="font-medium mb-2">Visit Summary</h4>
                <div className="text-sm space-y-1 text-muted-foreground">
                  <p>
                    Symptoms: {[...userPatient.triageData.symptoms, userPatient.triageData.otherSymptom?.trim()]
                      .filter(Boolean)
                      .join(', ') || 'None selected'}
                  </p>
                  <p>Check-in: {userPatient.checkinTime.toLocaleTimeString()}</p>
                  <p>Emergency Contact: {userPatient.triageData.emergencyContacts[0]?.name}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8 bg-gradient-card border-0 shadow-medium">
            <CardHeader>
              <CardTitle>No Active Queue Status</CardTitle>
              <CardDescription>You are not currently in any queue</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/triage')} size="lg">
                Join Queue - Start Triage
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-shadow">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 mx-auto text-primary mb-3" />
              <div className="text-2xl font-bold mb-1">
                {queueData.patients.filter(p => p.status === 'waiting').length}
              </div>
              <p className="text-sm text-muted-foreground">Patients Waiting</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-shadow">
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 mx-auto text-accent mb-3" />
              <div className="text-2xl font-bold mb-1">{queueData.averageWaitTime}m</div>
              <p className="text-sm text-muted-foreground">Avg Wait Time</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-shadow">
            <CardContent className="p-6 text-center">
              <Heart className="h-8 w-8 mx-auto text-success mb-3" />
              <div className="text-2xl font-bold mb-1">{queueData.totalServed}</div>
              <p className="text-sm text-muted-foreground">Patients Served</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-shadow">
            <CardContent className="p-6 text-center">
              <AlertCircle className="h-8 w-8 mx-auto text-warning mb-3" />
              <div className="text-2xl font-bold mb-1">
                {queueData.patients.filter(p => p.urgency === 'High' && p.status === 'waiting').length}
              </div>
              <p className="text-sm text-muted-foreground">High Priority</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => navigate('/triage')}
            className="h-16"
          >
            <Heart className="h-5 w-5 mr-3" />
            New Health Assessment
          </Button>
          
          <Button 
  variant="outline" 
  size="lg" 
  onClick={() => navigate('/schedule-appointment')}
  className="h-16"
>
  <Calendar className="h-5 w-5 mr-3" />
  Schedule Appointment
</Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => toast({ title: "Emergency Contact", description: "For emergencies, call 108 immediately" })}
            className="h-16"
          >
            <Phone className="h-5 w-5 mr-3" />
            Emergency Contact
          </Button>
        </div>

        {/* Live Queue Display */}
        <Card className="bg-gradient-card border-0 shadow-medium">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" />
                  Live Queue Status
                </CardTitle>
                <CardDescription>Real-time updates every 30 seconds</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={refreshQueue}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {queueData.patients
                .filter(p => p.status === 'waiting')
                .sort((a, b) => a.position - b.position)
                .slice(0, 10)
                .map((patient) => (
                  <div 
                    key={patient.id} 
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      patient.phone === user?.phone ? 'bg-primary/10 border-primary' : 'bg-secondary/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">#{patient.position}</span>
                      </div>
                      <div>
                        <p className="font-medium">
                          {patient.phone === user?.phone ? 'You' : patient.tokenNumber}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Wait: {patient.estimatedWaitTime}m
                        </p>
                      </div>
                    </div>
                    <Badge variant={urgencyColors[patient.urgency]} className="text-xs">
                      {patient.urgency}
                    </Badge>
                  </div>
                ))}
              
              {queueData.patients.filter(p => p.status === 'waiting').length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No patients currently in queue</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floating Chat Bot */}
      <ChatBot />
    </div>
  );
};

export default PatientDashboard;