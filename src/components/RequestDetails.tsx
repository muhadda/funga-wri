
import React from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface RequestDetailsProps {
  requestId: string | null;
}

const RequestDetails: React.FC<RequestDetailsProps> = ({ requestId }) => {
  const { toast } = useToast();

  if (!requestId) {
    return (
      <div className="p-4 text-center text-gray-400">
        Select a request to view details
      </div>
    );
  }

  // In a real implementation, this would fetch request details from the backend
  const request = {
    id: requestId,
    method: "GET",
    url: "https://example.com/api/users",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer token123",
      "User-Agent": "Mozilla/5.0",
    },
    body: requestId === "2" ? JSON.stringify({ username: "user", password: "pass" }, null, 2) : "",
  };

  const handleUseForInterception = () => {
    // In a real implementation, this would make an API call to set this request for interception
    toast({
      title: "Request Set for Interception",
      description: "This request will be used to replace matching requests",
    });
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">URL</h3>
        <div className="bg-gray-700 p-2 rounded text-sm overflow-x-auto">
          <span className="text-blue-400">{request.method}</span> {request.url}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Headers</h3>
        <div className="bg-gray-700 p-2 rounded text-sm overflow-x-auto">
          {Object.entries(request.headers).map(([key, value]) => (
            <div key={key} className="mb-1">
              <span className="text-purple-400">{key}</span>: {value}
            </div>
          ))}
        </div>
      </div>

      {request.body && (
        <div>
          <h3 className="text-sm font-medium mb-2">Body</h3>
          <div className="bg-gray-700 p-2 rounded text-sm overflow-x-auto">
            <pre className="text-green-400">{request.body}</pre>
          </div>
        </div>
      )}

      <div className="pt-2">
        <Button onClick={handleUseForInterception} className="w-full bg-purple-600 hover:bg-purple-700">
          Use for Interception
        </Button>
      </div>
    </div>
  );
};

export default RequestDetails;
