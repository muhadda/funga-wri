
import React, { useState } from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface ProxyStatusProps {
  isRunning: boolean;
  onToggle: () => void;
}

const ProxyStatus: React.FC<ProxyStatusProps> = ({ isRunning, onToggle }) => {
  const [isToggling, setIsToggling] = useState(false);
  const { toast } = useToast();

  const handleToggle = async () => {
    try {
      setIsToggling(true);
      // Call the toggle API endpoint directly from the component
      const response = await fetch('http://localhost:5000/api/proxy/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to toggle proxy: ${response.status}`);
      }

      const result = await response.json();
      
      // Call the provided onToggle callback to update parent state
      onToggle();
      
      toast({
        title: isRunning ? "Proxy Stopped" : "Proxy Started",
        description: isRunning 
          ? "The proxy server has been stopped." 
          : "The proxy server is now running on localhost:8080.",
      });
    } catch (error) {
      console.error("Error toggling proxy:", error);
      toast({
        title: "Error",
        description: `Failed to ${isRunning ? "stop" : "start"} proxy server. Make sure the backend is running on http://localhost:5000.`,
        variant: "destructive",
      });
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="proxy-status">Proxy Server</Label>
        <Switch
          id="proxy-status"
          checked={isRunning}
          onCheckedChange={handleToggle}
          disabled={isToggling}
        />
      </div>
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500' : 'bg-gray-500'}`}></div>
        <span className="text-sm text-gray-400">
          {isToggling 
            ? 'Processing...' 
            : isRunning 
              ? 'Running on localhost:8080' 
              : 'Stopped'}
        </span>
      </div>
      <div className="text-xs text-gray-500 mt-1">
        Backend API: http://localhost:5000
      </div>
    </div>
  );
};

export default ProxyStatus;
