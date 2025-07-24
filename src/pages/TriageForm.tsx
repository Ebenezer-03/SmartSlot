import { useState } from 'react';
import { ArrowLeft, ArrowRight, Heart, Thermometer, Activity, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQueue } from '@/contexts/QueueContext';
import { useAuth } from '@/contexts/AuthContext';
import { TriageData } from '@/types';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const TriageForm = () => {
  const { addPatient } = useQueue();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [triageData, setTriageData] = useState<TriageData>({
    age: 25,
    symptoms: [],
    painLevel: 0,
    duration: '',
    previousVisits: false,
    medications: [],
    allergies: [],
    emergencyContacts: [{ name: '', phone: '' }],
  });

  const commonSymptoms = [
    'Fever', 'Headache', 'Cough', 'Shortness of breath', 'Chest pain',
    'Abdominal pain', 'Nausea', 'Vomiting', 'Dizziness', 'Fatigue',
    'Joint pain', 'Back pain', 'Skin rash', 'Sore throat'
  ];

  const handleSymptomToggle = (symptom: string) => {
    setTriageData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const handleSubmit = () => {
    if (!user) return;

    if (triageData.symptoms.length === 0) {
      toast({
        title: "Please select symptoms",
        description: "You must select at least one symptom to continue.",
        variant: "destructive",
      });
      return;
    }

    const newPatient = addPatient({
      name: user.name,
      phone: user.phone,
      aadhaar: user.aadhaar,
      urgency: 'Low', // Will be calculated by AI
      symptoms: triageData.symptoms.join(', '),
      status: 'waiting',
      triageData,
    });

    toast({
      title: "Successfully Added to Queue",
      description: `Your token number is ${newPatient.tokenNumber}. Estimated wait time: ${newPatient.estimatedWaitTime} minutes.`,
    });

    navigate('/patient-dashboard');
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Heart className="h-12 w-12 mx-auto text-primary mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Basic Information</h2>
              <p className="text-muted-foreground">Help us understand your current condition</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={triageData.age}
                  onChange={(e) => setTriageData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                  min="0"
                  max="120"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="temperature">Body Temperature (°F) - Optional</Label>
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="temperature"
                    type="number"
                    placeholder="98.6"
                    value={triageData.temperature || ''}
                    onChange={(e) => setTriageData(prev => ({ 
                      ...prev, 
                      temperature: e.target.value ? parseFloat(e.target.value) : undefined 
                    }))}
                    min="90"
                    max="110"
                    step="0.1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bp">Blood Pressure - Optional</Label>
                <Input
                  id="bp"
                  placeholder="120/80"
                  value={triageData.bloodPressure || ''}
                  onChange={(e) => setTriageData(prev => ({ ...prev, bloodPressure: e.target.value }))}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Activity className="h-12 w-12 mx-auto text-primary mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Symptoms Assessment</h2>
              <p className="text-muted-foreground">Select all symptoms you're experiencing</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {commonSymptoms.map((symptom) => (
                  <div key={symptom} className="flex items-center space-x-2">
                    <Checkbox
                      id={symptom}
                      checked={triageData.symptoms.includes(symptom)}
                      onCheckedChange={() => handleSymptomToggle(symptom)}
                    />
                    <Label
                      htmlFor={symptom}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {symptom}
                    </Label>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="pain-level">Pain Level (0-10)</Label>
                <div className="px-4">
                  <Slider
                    value={[triageData.painLevel]}
                    onValueChange={(value) => setTriageData(prev => ({ ...prev, painLevel: value[0] }))}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>No Pain</span>
                    <span className="font-medium">{triageData.painLevel}/10</span>
                    <span>Severe Pain</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">How long have you had these symptoms?</Label>
                <Select onValueChange={(value) => setTriageData(prev => ({ ...prev, duration: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="less-than-hour">Less than 1 hour</SelectItem>
                    <SelectItem value="few-hours">A few hours</SelectItem>
                    <SelectItem value="today">Since today morning</SelectItem>
                    <SelectItem value="few-days">2-3 days</SelectItem>
                    <SelectItem value="week">About a week</SelectItem>
                    <SelectItem value="weeks">Several weeks</SelectItem>
                    <SelectItem value="months">Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Clock className="h-12 w-12 mx-auto text-primary mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Medical History</h2>
              <p className="text-muted-foreground">Additional information to help us serve you better</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="previous-visits"
                  checked={triageData.previousVisits}
                  onCheckedChange={(checked) => 
                    setTriageData(prev => ({ ...prev, previousVisits: !!checked }))
                  }
                />
                <Label htmlFor="previous-visits">
                  I have visited this hospital before for similar symptoms
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="medications">Current Medications (one per line)</Label>
                <Textarea
                  id="medications"
                  placeholder="List any medications you're currently taking..."
                  value={triageData.medications.join('\n')}
                  onChange={(e) => setTriageData(prev => ({ 
                    ...prev, 
                    medications: e.target.value.split('\n').filter(m => m.trim()) 
                  }))}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="allergies">Known Allergies (one per line)</Label>
                <Textarea
                  id="allergies"
                  placeholder="List any known allergies..."
                  value={triageData.allergies.join('\n')}
                  onChange={(e) => setTriageData(prev => ({ 
                    ...prev, 
                    allergies: e.target.value.split('\n').filter(a => a.trim()) 
                  }))}
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Heart className="h-12 w-12 mx-auto text-primary mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Emergency Contact</h2>
              <p className="text-muted-foreground">Who should we contact in case of emergency?</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emergency-name">Contact Name</Label>
                <Input
                  id="emergency-name"
                  placeholder="Full name of emergency contact"
                  value={triageData.emergencyContacts[0]?.name || ''}
                  onChange={(e) => setTriageData(prev => ({
                    ...prev,
                    emergencyContacts: [{ 
                      ...prev.emergencyContacts[0], 
                      name: e.target.value 
                    }]
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergency-phone">Contact Phone</Label>
                <Input
                  id="emergency-phone"
                  placeholder="10-digit phone number"
                  value={triageData.emergencyContacts[0]?.phone || ''}
                  onChange={(e) => setTriageData(prev => ({
                    ...prev,
                    emergencyContacts: [{ 
                      ...prev.emergencyContacts[0], 
                      phone: e.target.value 
                    }]
                  }))}
                  maxLength={10}
                />
              </div>

              <div className="p-4 bg-accent/10 rounded-lg">
                <h3 className="font-medium mb-2">Review Your Information</h3>
                <div className="text-sm space-y-1 text-muted-foreground">
                  <p>Age: {triageData.age} years</p>
                  <p>Symptoms: {triageData.symptoms.join(', ') || 'None selected'}</p>
                  <p>Pain Level: {triageData.painLevel}/10</p>
                  <p>Duration: {triageData.duration || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/patient-dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">AI Health Triage</h1>
            <p className="text-muted-foreground">
              Help our AI system prioritize your care based on your symptoms
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Step {step} of 4</span>
            <span>{Math.round((step / 4) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        <Card className="bg-gradient-card border-0 shadow-medium">
          <CardContent className="p-8">
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={step === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {step < 4 ? (
            <Button onClick={nextStep}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} size="lg">
              Join Queue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TriageForm;