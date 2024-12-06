export interface ClientDetails {
  name: string;
  address: string;
  taxId: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  currency: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  incoterms: string;
  paymentTerms: string;
  items: InvoiceItem[];
  subtotal: number;
  originalTotal: number;
  markupTotal: number;
  currency: string;
}

export interface ProcessedInvoice extends InvoiceData {
  clientDetails: ClientDetails;
  markupApplied: boolean;
}