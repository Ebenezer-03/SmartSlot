import { useState, useEffect } from 'react';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  BarChart3, 
  Settings,
  LogOut,
  RefreshCw,
  Heart,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useQueue } from '@/contexts/QueueContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { EmergencyBanner } from '@/components/EmergencyBanner';
import { toast } from '@/hooks/use-toast';
import { Patient } from '@/types';

const StaffDashboard = () => {
  const { user, logout } = useAuth();
  const { queueData, updatePatientStatus, getWaitingPatients, refreshQueue, updateEmergencyBroadcast } = useQueue();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastType, setBroadcastType] = useState<'info' | 'warning' | 'emergency'>('info');

  useEffect(() => {
    const timer = setInterval(() => {
      refreshQueue();
    }, 10000); // Refresh every 10 seconds for staff

    return () => clearInterval(timer);
  }, [refreshQueue]);

  const handleMarkServed = (patientId: string) => {
    updatePatientStatus(patientId, 'served');
    toast({
      title: "Patient Served",
      description: "Patient has been marked as served successfully",
    });
    setSelectedPatient(null);
  };

  const handleCallPatient = (patientId: string) => {
    updatePatientStatus(patientId, 'called');
    toast({
      title: "Patient Called",
      description: "Patient has been called for consultation",
    });
  };

  const handleMarkMissed = (patientId: string) => {
    updatePatientStatus(patientId, 'missed');
    toast({
      title: "Patient Marked as Missed",
      description: "Patient has been marked as missed",
      variant: "destructive",
    });
  };

  const handleEmergencyBroadcast = () => {
    if (!broadcastMessage.trim()) {
      toast({
        title: "Empty Message",
        description: "Please enter a broadcast message",
        variant: "destructive",
      });
      return;
    }

    updateEmergencyBroadcast(broadcastMessage, broadcastType);
    toast({
      title: "Broadcast Sent",
      description: "Emergency broadcast has been sent to all patients",
    });
    setBroadcastMessage('');
  };

  const waitingPatients = getWaitingPatients();
  const urgentCount = waitingPatients.filter(p => p.urgency === 'High').length;
  const averageWaitTime = queueData.averageWaitTime;

  const urgencyColors = {
    High: 'urgent',
    Medium: 'moderate',
    Low: 'low',
  } as const;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getWaitTime = (checkinTime: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - checkinTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    return diffMins;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      <EmergencyBanner />
      
      {/* Header */}
      <div className="bg-gradient-card border-b shadow-soft">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center shadow-glow">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">SmartSlot</h1>
                <p className="text-sm text-muted-foreground">Staff Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="ghost" onClick={() => logout()}>
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
          <h2 className="text-3xl font-bold mb-2">Good day, {user?.name}</h2>
          <p className="text-muted-foreground">
            Managing patient queue • {waitingPatients.length} patients waiting
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-card border-0 shadow-soft">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 mx-auto text-primary mb-3" />
              <div className="text-2xl font-bold mb-1">{waitingPatients.length}</div>
              <p className="text-sm text-muted-foreground">Waiting</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-soft">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-8 w-8 mx-auto text-medical-urgent mb-3" />
              <div className="text-2xl font-bold mb-1">{urgentCount}</div>
              <p className="text-sm text-muted-foreground">Urgent Cases</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-soft">
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 mx-auto text-accent mb-3" />
              <div className="text-2xl font-bold mb-1">{averageWaitTime}m</div>
              <p className="text-sm text-muted-foreground">Avg Wait</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-soft">
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-8 w-8 mx-auto text-success mb-3" />
              <div className="text-2xl font-bold mb-1">{queueData.totalServed}</div>
              <p className="text-sm text-muted-foreground">Served Today</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <Button onClick={refreshQueue} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Queue
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="warning">
                <MessageSquare className="h-4 w-4 mr-2" />
                Emergency Broadcast
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send Emergency Broadcast</DialogTitle>
                <DialogDescription>
                  Send important announcements to all patients in the queue
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="broadcast-type">Broadcast Type</Label>
                  <Select value={broadcastType} onValueChange={(value: any) => setBroadcastType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Information</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="broadcast-message">Message</Label>
                  <Textarea
                    id="broadcast-message"
                    placeholder="Enter your broadcast message..."
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    rows={3}
                  />
                </div>
                <Button onClick={handleEmergencyBroadcast} className="w-full">
                  Send Broadcast
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Patient Queue */}
        <Card className="bg-gradient-card border-0 shadow-medium">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Patient Queue ({waitingPatients.length})
                </CardTitle>
                <CardDescription>Manage patient flow and consultations</CardDescription>
              </div>
              <div className="text-sm text-muted-foreground">
                Auto-refresh: 10s
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {waitingPatients.map((patient, index) => (
                <div 
                  key={patient.id} 
                  className="flex items-center justify-between p-4 rounded-lg border bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="font-bold">#{patient.position}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{patient.tokenNumber}</h4>
                        <Badge variant={urgencyColors[patient.urgency]}>
                          {patient.urgency}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {patient.name} • {patient.phone}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Symptoms: {patient.symptoms} • Wait: {getWaitTime(patient.checkinTime)}m
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedPatient(patient)}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="medical"
                      size="sm"
                      onClick={() => handleCallPatient(patient.id)}
                    >
                      Call Patient
                    </Button>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleMarkServed(patient.id)}
                    >
                      Mark Served
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleMarkMissed(patient.id)}
                    >
                      Missed
                    </Button>
                  </div>
                </div>
              ))}
              
              {waitingPatients.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No patients in queue</h3>
                  <p>All patients have been served or the queue is empty</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Patient Details Modal */}
        {selectedPatient && (
          <Dialog open={!!selectedPatient} onOpenChange={() => setSelectedPatient(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Patient Details - {selectedPatient.tokenNumber}</DialogTitle>
                <DialogDescription>
                  Complete patient information and triage data
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Name</Label>
                    <p className="text-sm text-muted-foreground">{selectedPatient.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Phone</Label>
                    <p className="text-sm text-muted-foreground">{selectedPatient.phone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Check-in Time</Label>
                    <p className="text-sm text-muted-foreground">
                      {formatTime(selectedPatient.checkinTime)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Duration</Label>
                    <p className="text-sm text-muted-foreground">{selectedPatient.triageData.duration}</p>
                  </div>
                </div>

                {/* Triage Data */}
                <div className="space-y-4">
                  <h3 className="font-medium">Triage Assessment</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label>Age</Label>
                      <p className="text-muted-foreground">{selectedPatient.triageData.age} years</p>
                    </div>
                    {selectedPatient.triageData.temperature && (
                      <div>
                        <Label>Temperature</Label>
                        <p className="text-muted-foreground">{selectedPatient.triageData.temperature}°F</p>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label>Symptoms</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {[...selectedPatient.triageData.symptoms, selectedPatient.triageData.otherSymptom?.trim()]
                        .filter(Boolean)
                        .join(', ') || 'None selected'}
                    </p>
                  </div>
                  
                  {selectedPatient.triageData.medications.length > 0 && (
                    <div>
                      <Label>Current Medications</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedPatient.triageData.medications.join(', ')}
                      </p>
                    </div>
                  )}
                  
                  {selectedPatient.triageData.allergies.length > 0 && (
                    <div>
                      <Label>Allergies</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedPatient.triageData.allergies.join(', ')}
                      </p>
                    </div>
                  )}
                  
                  {selectedPatient.triageData.emergencyContacts[0]?.name && (
                    <div>
                      <Label>Emergency Contact</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedPatient.triageData.emergencyContacts[0].name} - {selectedPatient.triageData.emergencyContacts[0].phone}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleMarkServed(selectedPatient.id)}
                    className="flex-1"
                  >
                    Mark as Served
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setSelectedPatient(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;