import React from 'react';
import { FileUp } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileUp className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Invoice Converter</h1>
              <p className="text-sm text-gray-500">Turkish to Omega Invoice Conversion</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Omega Solutions
          </div>
        </div>
      </div>
    </header>
  );
}