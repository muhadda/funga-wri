
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ProxyStatusProps {
  isRunning: boolean;
  onToggle: () => void;
}

const ProxyStatus: React.FC<ProxyStatusProps> = ({ isRunning, onToggle }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="proxy-status">Proxy Server</Label>
        <Switch
          id="proxy-status"
          checked={isRunning}
          onCheckedChange={onToggle}
        />
      </div>
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500' : 'bg-gray-500'}`}></div>
        <span className="text-sm text-gray-400">
          {isRunning ? 'Running on localhost:8080' : 'Stopped'}
        </span>
      </div>
    </div>
  );
};

export default ProxyStatus;
