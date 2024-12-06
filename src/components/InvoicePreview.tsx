import React from 'react';
import { Download, Printer, Building } from 'lucide-react';
import type { ProcessedInvoice } from '../types/invoice';
import { ClientForm } from './ClientForm';
import { OMEGA_LOGO_URL, COMPANY_INFO } from '../utils/constants';

interface InvoicePreviewProps {
  invoice: ProcessedInvoice;
  onDownload: () => void;
  onPrint: () => void;
}

export function InvoicePreview({ invoice, onDownload, onPrint }: InvoicePreviewProps) {
  const [showClientForm, setShowClientForm] = React.useState(!invoice.clientDetails);

  if (showClientForm) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-6">
            <Building className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-2 text-lg font-semibold text-gray-900">
              Enter Client Details
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Please provide the Israeli client information
            </p>
          </div>
          <ClientForm 
            onSubmit={(details) => {
              invoice.clientDetails = details;
              setShowClientForm(false);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Processed Invoice
        </h2>
        <div className="flex gap-2">
          <button
            onClick={onPrint}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print
          </button>
          <button
            onClick={onDownload}
            className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </button>
        </div>
      </div>
      
      <div className="border rounded-lg p-8">
        <div className="flex justify-between mb-8">
          <div>
            <img src={OMEGA_LOGO_URL} alt="Omega Logo" className="h-12 mb-4" />
            <div className="text-sm">
              <p className="font-semibold">{COMPANY_INFO.name}</p>
              <p>{COMPANY_INFO.subname}</p>
              <p>{COMPANY_INFO.address}</p>
              <p>{COMPANY_INFO.city}</p>
              <p>VAT: {COMPANY_INFO.vat}</p>
              <p>EMAIL: {COMPANY_INFO.email}</p>
            </div>
          </div>
          <div className="text-right">
            <h1 className="text-2xl font-bold mb-4">INVOICE</h1>
            <div className="text-sm">
              <p><span className="font-medium">Invoice No:</span> {invoice.invoiceNumber}</p>
              <p><span className="font-medium">Date:</span> {invoice.date}</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="font-semibold mb-2">Bill To:</h2>
          <div className="text-sm">
            <p>{invoice.clientDetails.name}</p>
            <p>{invoice.clientDetails.address}</p>
            <p>Tax ID: {invoice.clientDetails.taxId}</p>
            <p>{invoice.clientDetails.email}</p>
          </div>
        </div>

        <table className="w-full mb-8">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Description</th>
              <th className="text-right py-2">Quantity</th>
              <th className="text-right py-2">Unit Price</th>
              <th className="text-right py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="py-2">{item.description}</td>
                <td className="text-right py-2">{item.quantity}</td>
                <td className="text-right py-2">{invoice.currency} {item.unitPrice.toFixed(2)}</td>
                <td className="text-right py-2">{invoice.currency} {item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-64">
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>{invoice.currency} {invoice.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Markup (2.5%):</span>
              <span>{invoice.currency} {(invoice.markupTotal - invoice.originalTotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold border-t pt-2">
              <span>Total:</span>
              <span>{invoice.currency} {invoice.markupTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}