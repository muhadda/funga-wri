
import React from 'react';
import { Badge } from "@/components/ui/badge";

type Request = {
  id: string;
  method: string;
  url: string;
  timestamp: string;
};

interface RequestListProps {
  requests: Request[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const RequestList: React.FC<RequestListProps> = ({ requests, selectedId, onSelect }) => {
  if (requests.length === 0) {
    return <div className="p-4 text-center text-gray-400">No requests recorded yet</div>;
  }

  return (
    <div className="divide-y divide-gray-700">
      {requests.map((request) => {
        const isSelected = request.id === selectedId;
        const methodColor = 
          request.method === "GET" ? "bg-green-600" :
          request.method === "POST" ? "bg-blue-600" :
          request.method === "PUT" ? "bg-yellow-600" :
          request.method === "DELETE" ? "bg-red-600" : "bg-gray-600";
        
        return (
          <div 
            key={request.id} 
            className={`p-3 cursor-pointer hover:bg-gray-750 ${isSelected ? 'bg-gray-700' : ''}`}
            onClick={() => onSelect(request.id)}
          >
            <div className="flex items-center gap-2 mb-1">
              <Badge className={`${methodColor}`}>{request.method}</Badge>
              <span className="text-xs text-gray-400">{new Date(request.timestamp).toLocaleTimeString()}</span>
            </div>
            <div className="text-sm truncate">{new URL(request.url).pathname}</div>
            <div className="text-xs text-gray-400 truncate">{new URL(request.url).host}</div>
          </div>
        );
      })}
    </div>
  );
};

export default RequestList;
