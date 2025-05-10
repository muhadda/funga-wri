
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import RequestList from "@/components/RequestList";
import RequestDetails from "@/components/RequestDetails";
import ProxyStatus from "@/components/ProxyStatus";
import SetupInstructions from "@/components/SetupInstructions";
import BackendCode from "@/components/BackendCode";

const Index = () => {
  const [mode, setMode] = useState<"recording" | "interception">("recording");
  const [domain, setDomain] = useState<string>("");
  const [isProxyRunning, setIsProxyRunning] = useState<boolean>(false);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("proxy");
  const { toast } = useToast();

  // Mock data - this would come from the backend API
  const recordedRequests = [
    { id: "1", method: "GET", url: "https://example.com/api/users", timestamp: "2023-05-10T12:34:56" },
    { id: "2", method: "POST", url: "https://example.com/api/login", timestamp: "2023-05-10T12:35:20" },
    { id: "3", method: "PUT", url: "https://example.com/api/users/1", timestamp: "2023-05-10T12:36:05" },
  ];

  const toggleProxyStatus = () => {
    // In a real implementation, this would make an API call to start/stop the proxy
    setIsProxyRunning(!isProxyRunning);
    toast({
      title: isProxyRunning ? "Proxy Stopped" : "Proxy Started",
      description: isProxyRunning 
        ? "The proxy server has been stopped." 
        : "The proxy server is now running on localhost:8080.",
    });
  };

  const handleModeChange = (newMode: "recording" | "interception") => {
    // In a real implementation, this would make an API call to change the proxy mode
    setMode(newMode);
    toast({
      title: `Mode Changed to ${newMode === "recording" ? "Recording" : "Interception"}`,
      description: newMode === "recording" 
        ? "Now recording all requests to the specified domain." 
        : "Now intercepting requests. Select a recorded request to replay it.",
    });
  };

  const handleDomainChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDomain(event.target.value);
  };

  const handleDomainSubmit = () => {
    if (!domain) {
      toast({
        title: "Error",
        description: "Please enter a domain to filter.",
        variant: "destructive",
      });
      return;
    }

    // In a real implementation, this would make an API call to set the filter domain
    toast({
      title: "Domain Filter Updated",
      description: `Now ${mode === "recording" ? "recording" : "intercepting"} requests to ${domain}`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Web Request Interceptor
        </h1>
        <p className="text-gray-400 mt-2">
          Analyze, intercept and modify web requests with ease
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>Control Panel</CardTitle>
              <CardDescription className="text-gray-400">
                Configure proxy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ProxyStatus isRunning={isProxyRunning} onToggle={toggleProxyStatus} />

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Mode</h3>
                <div className="flex space-x-4">
                  <Button 
                    variant={mode === "recording" ? "default" : "outline"}
                    onClick={() => handleModeChange("recording")}
                    className={mode === "recording" ? "bg-blue-600 hover:bg-blue-700" : ""}
                  >
                    Recording
                  </Button>
                  <Button 
                    variant={mode === "interception" ? "default" : "outline"}
                    onClick={() => handleModeChange("interception")}
                    className={mode === "interception" ? "bg-purple-600 hover:bg-purple-700" : ""}
                  >
                    Interception
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="domain">Domain Filter</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="domain" 
                    placeholder="example.com" 
                    value={domain}
                    onChange={handleDomainChange}
                    className="bg-gray-700 border-gray-600"
                  />
                  <Button onClick={handleDomainSubmit}>Set</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="proxy">Requests</TabsTrigger>
              <TabsTrigger value="setup">Setup</TabsTrigger>
              <TabsTrigger value="backend">Backend Code</TabsTrigger>
            </TabsList>
            
            <TabsContent value="proxy" className="mt-0">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>
                      {mode === "recording" ? "Recorded Requests" : "Interception Mode"}
                    </span>
                    <Badge variant={mode === "recording" ? "default" : "secondary"} className={mode === "recording" ? "bg-blue-600" : "bg-purple-600"}>
                      {mode === "recording" ? "Recording" : "Interception"}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    {mode === "recording" 
                      ? "Capturing requests for the specified domain" 
                      : "Select a request to use for interception"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-700 rounded-md overflow-hidden">
                      <div className="bg-gray-700 px-4 py-2 font-medium">Request List</div>
                      <ScrollArea className="h-80">
                        <RequestList 
                          requests={recordedRequests}
                          selectedId={selectedRequest}
                          onSelect={setSelectedRequest}
                        />
                      </ScrollArea>
                    </div>
                    
                    <div className="border border-gray-700 rounded-md overflow-hidden">
                      <div className="bg-gray-700 px-4 py-2 font-medium">Request Details</div>
                      <ScrollArea className="h-80">
                        <RequestDetails requestId={selectedRequest} />
                      </ScrollArea>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="setup" className="mt-0">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle>Setup Instructions</CardTitle>
                  <CardDescription className="text-gray-400">
                    Configure your browser to use the proxy
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SetupInstructions />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="backend" className="mt-0">
              <BackendCode />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
