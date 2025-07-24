import React, { createContext, useContext, useEffect, useState } from 'react';
import { Patient, QueueData, TriageData } from '@/types';

interface QueueContextType {
  queueData: QueueData;
  addPatient: (patientData: Omit<Patient, 'id' | 'tokenNumber' | 'position' | 'estimatedWaitTime' | 'checkinTime'>) => Patient;
  updatePatientStatus: (patientId: string, status: Patient['status']) => void;
  getPatientByToken: (tokenNumber: string) => Patient | undefined;
  getCurrentPatient: () => Patient | undefined;
  getWaitingPatients: () => Patient[];
  refreshQueue: () => void;
  updateEmergencyBroadcast: (message: string, type: 'info' | 'warning' | 'emergency') => void;
  clearEmergencyBroadcast: () => void;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (context === undefined) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
};

// AI Triage Logic - Simple rule-based system
const calculateUrgency = (triageData: TriageData): 'Low' | 'Medium' | 'High' => {
  let urgencyScore = 0;

  // Age factors
  if (triageData.age >= 65 || triageData.age <= 5) urgencyScore += 2;
  else if (triageData.age >= 50) urgencyScore += 1;

  // Temperature
  if (triageData.temperature && triageData.temperature >= 103) urgencyScore += 3;
  else if (triageData.temperature && triageData.temperature >= 101) urgencyScore += 2;
  else if (triageData.temperature && triageData.temperature >= 99.5) urgencyScore += 1;

  // Pain level
  urgencyScore += Math.floor(triageData.painLevel / 3);

  // High-priority symptoms
  const emergencySymptoms = ['chest pain', 'difficulty breathing', 'severe bleeding', 'unconscious', 'stroke symptoms'];
  const moderateSymptoms = ['severe headache', 'high fever', 'persistent vomiting', 'severe pain'];
  
  if (triageData.symptoms.some(symptom => emergencySymptoms.some(es => symptom.toLowerCase().includes(es)))) {
    urgencyScore += 4;
  } else if (triageData.symptoms.some(symptom => moderateSymptoms.some(ms => symptom.toLowerCase().includes(ms)))) {
    urgencyScore += 2;
  }

  // Duration of symptoms
  if (triageData.duration.includes('hours') || triageData.duration.includes('minutes')) {
    urgencyScore += 1;
  }

  if (urgencyScore >= 6) return 'High';
  if (urgencyScore >= 3) return 'Medium';
  return 'Low';
};

const calculateEstimatedWaitTime = (position: number, urgency: string): number => {
  const baseTime = 15; // 15 minutes per patient average
  const urgencyMultiplier = urgency === 'High' ? 0.5 : urgency === 'Medium' ? 0.8 : 1;
  return Math.round(position * baseTime * urgencyMultiplier);
};

export const QueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queueData, setQueueData] = useState<QueueData>({
    patients: [],
    currentToken: 1,
    averageWaitTime: 15,
    totalServed: 0,
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const storedQueue = localStorage.getItem('smartslot_queue');
    if (storedQueue) {
      const parsed = JSON.parse(storedQueue);
      // Convert date strings back to Date objects
      parsed.patients = parsed.patients.map((p: any) => ({
        ...p,
        checkinTime: new Date(p.checkinTime),
      }));
      if (parsed.emergencyBroadcast?.timestamp) {
        parsed.emergencyBroadcast.timestamp = new Date(parsed.emergencyBroadcast.timestamp);
      }
      setQueueData(parsed);
    }
  }, []);

  // Save to localStorage whenever queue data changes
  useEffect(() => {
    localStorage.setItem('smartslot_queue', JSON.stringify(queueData));
  }, [queueData]);

  const addPatient = (patientData: Omit<Patient, 'id' | 'tokenNumber' | 'position' | 'estimatedWaitTime' | 'checkinTime'>): Patient => {
    const urgency = calculateUrgency(patientData.triageData);
    const tokenNumber = `T${queueData.currentToken.toString().padStart(3, '0')}`;
    
    const newPatient: Patient = {
      ...patientData,
      id: `patient_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tokenNumber,
      urgency,
      checkinTime: new Date(),
      position: 0, // Will be calculated below
      estimatedWaitTime: 0, // Will be calculated below
    };

    setQueueData(prev => {
      const updatedPatients = [...prev.patients, newPatient];
      
      // Sort patients by urgency and check-in time
      const sortedPatients = updatedPatients
        .filter(p => p.status === 'waiting')
        .sort((a, b) => {
          const urgencyOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
          if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
            return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
          }
          return a.checkinTime.getTime() - b.checkinTime.getTime();
        });

      // Update positions and estimated wait times
      const processedPatients = updatedPatients.map(patient => {
        if (patient.status !== 'waiting') return patient;
        
        const position = sortedPatients.findIndex(p => p.id === patient.id) + 1;
        const estimatedWaitTime = calculateEstimatedWaitTime(position, patient.urgency);
        
        return { ...patient, position, estimatedWaitTime };
      });

      return {
        ...prev,
        patients: processedPatients,
        currentToken: prev.currentToken + 1,
      };
    });

    return newPatient;
  };

  const updatePatientStatus = (patientId: string, status: Patient['status']) => {
    setQueueData(prev => {
      const updatedPatients = prev.patients.map(patient =>
        patient.id === patientId ? { ...patient, status } : patient
      );

      let totalServed = prev.totalServed;
      if (status === 'served') {
        totalServed += 1;
      }

      return {
        ...prev,
        patients: updatedPatients,
        totalServed,
      };
    });
  };

  const getPatientByToken = (tokenNumber: string): Patient | undefined => {
    return queueData.patients.find(p => p.tokenNumber === tokenNumber);
  };

  const getCurrentPatient = (): Patient | undefined => {
    return queueData.patients
      .filter(p => p.status === 'waiting')
      .sort((a, b) => {
        const urgencyOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
        if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
          return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
        }
        return a.checkinTime.getTime() - b.checkinTime.getTime();
      })[0];
  };

  const getWaitingPatients = (): Patient[] => {
    return queueData.patients
      .filter(p => p.status === 'waiting')
      .sort((a, b) => {
        const urgencyOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
        if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
          return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
        }
        return a.checkinTime.getTime() - b.checkinTime.getTime();
      });
  };

  const refreshQueue = () => {
    // Simulate real-time updates
    setQueueData(prev => ({ ...prev }));
  };

  const updateEmergencyBroadcast = (message: string, type: 'info' | 'warning' | 'emergency') => {
    setQueueData(prev => ({
      ...prev,
      emergencyBroadcast: {
        message,
        type,
        timestamp: new Date(),
      },
    }));
  };

  const clearEmergencyBroadcast = () => {
    setQueueData(prev => ({
      ...prev,
      emergencyBroadcast: undefined,
    }));
  };

  return (
    <QueueContext.Provider value={{
      queueData,
      addPatient,
      updatePatientStatus,
      getPatientByToken,
      getCurrentPatient,
      getWaitingPatients,
      refreshQueue,
      updateEmergencyBroadcast,
      clearEmergencyBroadcast,
    }}>
      {children}
    </QueueContext.Provider>
  );
};