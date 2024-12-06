import React from 'react';
import { Upload, FileUp, AlertCircle } from 'lucide-react';
import { FileUploader } from './components/FileUploader';
import { Header } from './components/Header';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <FileUploader />
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">How it works:</p>
                <ol className="list-decimal ml-4 space-y-1">
                  <li>Upload your Turkish invoice PDF</li>
                  <li>Our system converts it to base64 format</li>
                  <li>The data is securely sent to Make.com</li>
                  <li>Make.com processes it with Claude AI</li>
                  <li>A new Omega invoice is generated automatically</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
