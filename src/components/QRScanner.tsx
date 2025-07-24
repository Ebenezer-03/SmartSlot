import { useState } from 'react';
import { QrCode, Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

interface QRScannerProps {
  onScan: (tokenNumber: string) => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScan }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [manualToken, setManualToken] = useState('');

  const handleManualSubmit = () => {
    if (manualToken.trim()) {
      onScan(manualToken.trim());
      setManualToken('');
      setIsOpen(false);
    } else {
      toast({
        title: "Invalid Token",
        description: "Please enter a valid token number",
        variant: "destructive",
      });
    }
  };

  const simulateQRScan = () => {
    // Simulate QR code scanning with a random token
    const randomToken = `T${Math.floor(Math.random() * 100).toString().padStart(3, '0')}`;
    onScan(randomToken);
    setIsOpen(false);
    toast({
      title: "QR Code Scanned",
      description: `Token ${randomToken} scanned successfully`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <QrCode className="h-4 w-4" />
          QR Check-in
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code Check-in</DialogTitle>
          <DialogDescription>
            Scan your token QR code or enter manually
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Simulated Camera View */}
          <Card className="bg-black/5 border-dashed">
            <CardContent className="p-8 text-center">
              <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                Position QR code within the frame
              </p>
              <Button onClick={simulateQRScan} variant="medical">
                Simulate QR Scan
              </Button>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-muted-foreground">
            or
          </div>

          {/* Manual Entry */}
          <div className="space-y-2">
            <Input
              placeholder="Enter token number (e.g., T001)"
              value={manualToken}
              onChange={(e) => setManualToken(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && handleManualSubmit()}
            />
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleManualSubmit}
                disabled={!manualToken.trim()}
                className="flex-1"
              >
                Check In
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};