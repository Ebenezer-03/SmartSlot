import { AlertTriangle, Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQueue } from '@/contexts/QueueContext';
import { cn } from '@/lib/utils';

export const EmergencyBanner = () => {
  const { queueData, clearEmergencyBroadcast } = useQueue();

  if (!queueData.emergencyBroadcast) return null;

  const { message, type } = queueData.emergencyBroadcast;

  const bgColor = {
    info: 'bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    warning: 'bg-yellow-100 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    emergency: 'bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800'
  };

  const textColor = {
    info: 'text-blue-800 dark:text-blue-200',
    warning: 'text-yellow-800 dark:text-yellow-200',
    emergency: 'text-red-800 dark:text-red-200'
  };

  return (
    <div className={cn(
      "w-full border-l-4 p-4 flex items-center justify-between animate-in slide-in-from-top duration-300",
      bgColor[type]
    )}>
      <div className="flex items-center gap-3">
        {type === 'emergency' ? (
          <AlertTriangle className={cn("h-5 w-5", textColor[type])} />
        ) : (
          <Info className={cn("h-5 w-5", textColor[type])} />
        )}
        <p className={cn("font-medium", textColor[type])}>
          {message}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={clearEmergencyBroadcast}
        className={cn("h-6 w-6", textColor[type])}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};