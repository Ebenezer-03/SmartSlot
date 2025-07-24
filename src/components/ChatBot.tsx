import { useState } from 'react';
import { MessageCircle, Send, X, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ChatMessage } from '@/types';
import { useQueue } from '@/contexts/QueueContext';

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      message: "Hello! I'm SmartSlot Assistant. I can help you with queue information, estimated wait times, and general queries. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const { queueData, getWaitingPatients } = useQueue();

  const botResponses = {
    queue: "There are currently {count} patients waiting in the queue. The average wait time is {avgTime} minutes.",
    wait: "Based on current queue status, the estimated wait time is approximately {time} minutes.",
    urgent: "High priority patients are seen first, followed by medium and low priority cases based on check-in time.",
    reschedule: "You can reschedule your appointment by contacting our reception at +91-1234567890 or through the patient portal.",
    emergency: "For medical emergencies, please call 108 immediately or visit our emergency department directly.",
    location: "Our hospital is located at [Hospital Address]. We have parking available and are wheelchair accessible.",
    visiting: "Visiting hours are 10:00 AM - 8:00 PM daily. Maximum 2 visitors per patient are allowed.",
    default: "I understand you're asking about {query}. For specific medical questions, please consult with our medical staff. For general inquiries, you can contact our help desk."
  };

  const processMessage = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    const waitingCount = getWaitingPatients().length;
    const avgTime = queueData.averageWaitTime;

    if (message.includes('queue') || message.includes('how many')) {
      return botResponses.queue
        .replace('{count}', waitingCount.toString())
        .replace('{avgTime}', avgTime.toString());
    }
    
    if (message.includes('wait') || message.includes('time')) {
      return botResponses.wait.replace('{time}', avgTime.toString());
    }
    
    if (message.includes('urgent') || message.includes('priority')) {
      return botResponses.urgent;
    }
    
    if (message.includes('reschedule') || message.includes('change')) {
      return botResponses.reschedule;
    }
    
    if (message.includes('emergency') || message.includes('urgent care')) {
      return botResponses.emergency;
    }
    
    if (message.includes('location') || message.includes('address') || message.includes('where')) {
      return botResponses.location;
    }
    
    if (message.includes('visit') || message.includes('visitor')) {
      return botResponses.visiting;
    }
    
    return botResponses.default.replace('{query}', userMessage);
  };

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: processMessage(inputMessage),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);

    setInputMessage('');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="medical" className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-glow">
          <MessageCircle className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            SmartSlot Assistant
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.sender === 'bot' && (
                        <Bot className="h-4 w-4 mt-0.5 text-primary" />
                      )}
                      {message.sender === 'user' && (
                        <User className="h-4 w-4 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm">{message.message}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="mt-4 flex gap-2">
            <Input
              placeholder="Type your question..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1"
            />
            <Button onClick={sendMessage} disabled={!inputMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-2 text-xs text-muted-foreground text-center">
            For medical emergencies, call 108 immediately
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};