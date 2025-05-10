
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Code } from "@/components/Code";

const SetupInstructions: React.FC = () => {
  return (
    <div className="space-y-6">
      <Alert className="bg-blue-900/30 border-blue-900 text-blue-100">
        <AlertTitle>SSL Certificate Required</AlertTitle>
        <AlertDescription>
          To intercept HTTPS traffic, you need to install the mitmproxy certificate.
        </AlertDescription>
      </Alert>
      
      <Tabs defaultValue="certificate">
        <TabsList className="grid grid-cols-3 w-full md:w-auto">
          <TabsTrigger value="certificate">SSL Certificate</TabsTrigger>
          <TabsTrigger value="browser">Browser Setup</TabsTrigger>
          <TabsTrigger value="api">API Usage</TabsTrigger>
        </TabsList>
        
        <TabsContent value="certificate" className="p-4 bg-gray-750 rounded-md mt-4">
          <h3 className="font-medium mb-2">Install mitmproxy Certificate</h3>
          <ol className="list-decimal list-inside space-y-3 text-gray-300">
            <li>Ensure the proxy is running</li>
            <li>
              Visit <span className="text-blue-400">mitm.it</span> in your browser while the proxy is active
            </li>
            <li>Select your operating system and follow the installation instructions</li>
            <li>For macOS, double-click the certificate and set to "Always Trust" in Keychain</li>
            <li>For Windows, install to "Trusted Root Certification Authorities"</li>
          </ol>
          
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Manual Installation</h4>
            <Code>
              {`# Certificate is located at:
~/.mitmproxy/mitmproxy-ca-cert.pem

# For Linux/Ubuntu:
sudo cp ~/.mitmproxy/mitmproxy-ca-cert.pem /usr/local/share/ca-certificates/mitmproxy.crt
sudo update-ca-certificates`}
            </Code>
          </div>
        </TabsContent>
        
        <TabsContent value="browser" className="p-4 bg-gray-750 rounded-md mt-4">
          <h3 className="font-medium mb-2">Configure Browser Proxy Settings</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-1">Chrome / Edge</h4>
              <ol className="list-decimal list-inside space-y-1 text-gray-300">
                <li>Go to Settings → System → Network → Open proxy settings</li>
                <li>Set HTTP Proxy and HTTPS Proxy to 127.0.0.1 and Port 8080</li>
              </ol>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">Firefox</h4>
              <ol className="list-decimal list-inside space-y-1 text-gray-300">
                <li>Go to Settings → Network Settings → Settings</li>
                <li>Select "Manual proxy configuration"</li>
                <li>Set HTTP Proxy and HTTPS Proxy to 127.0.0.1 and Port 8080</li>
              </ol>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="api" className="p-4 bg-gray-750 rounded-md mt-4">
          <h3 className="font-medium mb-2">API Endpoints</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-1">Control Proxy</h4>
              <Code>
                {`# Start/Stop proxy
POST /api/proxy/toggle

# Change mode
POST /api/proxy/mode
{
  "mode": "recording" | "interception"
}

# Set domain filter
POST /api/proxy/domain
{
  "domain": "example.com"
}`}
              </Code>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">Manage Requests</h4>
              <Code>
                {`# Get all recorded requests
GET /api/requests

# Get request details
GET /api/requests/{id}

# Set request for interception
POST /api/interception
{
  "requestId": "123"
}`}
              </Code>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SetupInstructions;
