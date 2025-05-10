
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code } from "@/components/Code";
import { Download } from "lucide-react";

const BackendCode: React.FC = () => {
  const handleDownload = (filename: string, content: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const requirements = `
flask==2.0.1
mitmproxy==7.0.4
flask-cors==3.0.10
  `.trim();

  const appPy = `
import os
import json
import asyncio
from flask import Flask, request, jsonify
from flask_cors import CORS
from mitmproxy import options
from mitmproxy.tools.dump import DumpMaster
from mitmproxy.addons import core

app = Flask(__name__)
CORS(app)

# Global variables
proxy_running = False
proxy_master = None
proxy_mode = "recording"  # or "interception"
filter_domain = None
recorded_requests = {}
interception_request = None

class RequestRecorder:
    def __init__(self):
        self.recorded_requests = {}

    def request(self, flow):
        if filter_domain and filter_domain not in flow.request.host:
            return
        
        # In recording mode, just save the request
        if proxy_mode == "recording":
            request_id = str(len(self.recorded_requests) + 1)
            self.recorded_requests[request_id] = {
                "id": request_id,
                "method": flow.request.method,
                "url": flow.request.url,
                "headers": dict(flow.request.headers),
                "content": flow.request.content.decode('utf-8', 'ignore') if flow.request.content else "",
                "timestamp": flow.request.timestamp_start
            }
        
        # In interception mode, replace the request if it matches
        elif proxy_mode == "interception" and interception_request:
            if (filter_domain and filter_domain in flow.request.host and
                flow.request.method == interception_request["method"]):
                
                # Replace headers and body with the intercepted request
                flow.request.headers = interception_request["headers"]
                flow.request.content = interception_request["content"].encode('utf-8')
                print(f"Replaced request to {flow.request.url}")

# Initialize the addon
request_recorder = RequestRecorder()

def start_proxy():
    global proxy_master, proxy_running
    
    if proxy_running:
        return {"status": "already_running"}
    
    opts = options.Options(listen_host='0.0.0.0', listen_port=8080)
    proxy_master = DumpMaster(opts)
    proxy_master.addons.add(request_recorder)
    
    # Start the proxy in a separate thread
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    async def start():
        await proxy_master.run()
    
    proxy_running = True
    asyncio.ensure_future(start())
    return {"status": "started"}

def stop_proxy():
    global proxy_master, proxy_running
    
    if not proxy_running:
        return {"status": "not_running"}
    
    if proxy_master:
        proxy_master.shutdown()
        proxy_master = None
        
    proxy_running = False
    return {"status": "stopped"}

@app.route('/api/proxy/status', methods=['GET'])
def get_proxy_status():
    return jsonify({
        "running": proxy_running,
        "mode": proxy_mode,
        "domain": filter_domain
    })

@app.route('/api/proxy/toggle', methods=['POST'])
def toggle_proxy():
    global proxy_running
    
    if proxy_running:
        result = stop_proxy()
    else:
        result = start_proxy()
        
    return jsonify(result)

@app.route('/api/proxy/mode', methods=['POST'])
def set_mode():
    global proxy_mode
    
    data = request.json
    if not data or "mode" not in data:
        return jsonify({"error": "Mode not specified"}), 400
        
    mode = data["mode"]
    if mode not in ["recording", "interception"]:
        return jsonify({"error": "Invalid mode"}), 400
        
    proxy_mode = mode
    return jsonify({"status": "success", "mode": proxy_mode})

@app.route('/api/proxy/domain', methods=['POST'])
def set_domain():
    global filter_domain
    
    data = request.json
    if not data or "domain" not in data:
        return jsonify({"error": "Domain not specified"}), 400
        
    filter_domain = data["domain"]
    return jsonify({"status": "success", "domain": filter_domain})

@app.route('/api/requests', methods=['GET'])
def get_requests():
    # Convert the dictionary values to a list
    requests_list = list(request_recorder.recorded_requests.values())
    # Sort by timestamp, newest first
    requests_list.sort(key=lambda x: x["timestamp"], reverse=True)
    return jsonify(requests_list)

@app.route('/api/requests/<request_id>', methods=['GET'])
def get_request_details(request_id):
    if request_id not in request_recorder.recorded_requests:
        return jsonify({"error": "Request not found"}), 404
        
    return jsonify(request_recorder.recorded_requests[request_id])

@app.route('/api/interception', methods=['POST'])
def set_interception_request():
    global interception_request
    
    data = request.json
    if not data or "requestId" not in data:
        return jsonify({"error": "Request ID not specified"}), 400
        
    request_id = data["requestId"]
    if request_id not in request_recorder.recorded_requests:
        return jsonify({"error": "Request not found"}), 404
        
    interception_request = request_recorder.recorded_requests[request_id]
    return jsonify({"status": "success", "message": "Interception request set"})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
  `.trim();

  return (
    <Card className="bg-gray-800 border-gray-700 mb-8">
      <CardHeader>
        <CardTitle>Python Backend Implementation</CardTitle>
        <CardDescription className="text-gray-400">
          Download the Python backend files to run the proxy server
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">requirements.txt</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleDownload('requirements.txt', requirements)}
            >
              <Download className="h-4 w-4 mr-2" /> Download
            </Button>
          </div>
          <Code>{requirements}</Code>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">app.py</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleDownload('app.py', appPy)}
            >
              <Download className="h-4 w-4 mr-2" /> Download
            </Button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            <Code>{appPy}</Code>
          </div>
        </div>

        <div className="bg-blue-900/30 p-4 rounded-md border border-blue-900 text-blue-100">
          <h3 className="font-medium mb-2">How to run the backend:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Install Python 3.7+ if not already installed</li>
            <li>Download the files above</li>
            <li>Install dependencies: <code className="bg-blue-900/50 p-1 rounded">pip install -r requirements.txt</code></li>
            <li>Run the server: <code className="bg-blue-900/50 p-1 rounded">python app.py</code></li>
            <li>The backend API will be available at <code className="bg-blue-900/50 p-1 rounded">http://localhost:5000</code></li>
            <li>The proxy server will be available at <code className="bg-blue-900/50 p-1 rounded">http://localhost:8080</code> when started</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default BackendCode;
