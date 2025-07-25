export interface User {
  id: string;
  name: string;
  phone: string;
  aadhaar?: string;
  type: 'patient' | 'staff';
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  aadhaar?: string;
  tokenNumber: string;
  urgency: 'Low' | 'Medium' | 'High';
  symptoms: string;
  checkinTime: Date;
  estimatedWaitTime: number;
  position: number;
  status: 'waiting' | 'called' | 'served' | 'missed';
  triageData: TriageData;
}

export interface TriageData {
  age: number;
  temperature?: number;
  bloodPressure?: string;
  symptoms: string[];
  painLevel: number;
  duration: string;
  previousVisits: boolean;
  medications: string[];
  allergies: string[];
  emergencyContacts: { name: string; phone: string }[];
  otherSymptom?: string;
}

export interface QueueData {
  patients: Patient[];
  currentToken: number;
  averageWaitTime: number;
  totalServed: number;
  emergencyBroadcast?: {
    message: string;
    type: 'info' | 'warning' | 'emergency';
    timestamp: Date;
  };
}

export interface ChatMessage {
  id: string;
  message: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}