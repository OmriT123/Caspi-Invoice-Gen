interface InvoiceResponse {
  invoice?: {
    number: string;
    date: string;
    proformaNumber?: string;
    lcNumber?: string;
  };
  delivery?: {
    terms: string;
    shipmentVia?: string;
    orderNumber?: string;
  };
  items: Array<{
    description: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    currency: string;
    total: number;
  }>;
  totals: {
    currency: string;
    amount: number;
  };
}

function sanitizeJSON(data: any): any {
  if (typeof data === 'object' && data !== null) {
    return data.data || data;
  }

  if (typeof data === 'string') {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(data);
      return parsed.data || parsed;
    } catch (error) {
      // Try to find JSON in the response
      const jsonStart = data.indexOf('{');
      const jsonEnd = data.lastIndexOf('}') + 1;
      if (jsonStart >= 0 && jsonEnd > jsonStart) {
        const jsonStr = data.slice(jsonStart, jsonEnd);
        try {
          const parsed = JSON.parse(jsonStr);
          return parsed.data || parsed;
        } catch {
          throw new Error('Invalid JSON in response');
        }
      }
      throw new Error('No valid JSON found in response');
    }
  }
  throw new Error('Unsupported invoice data format');
}

function calculateItemTotal(item: any): number {
  const quantity = Number(item.quantity) || 0;
  const unitPrice = Number(item.unitPrice) || 0;
  return Number((quantity * unitPrice).toFixed(2));
}

function applyMarkup(amount: number): number {
  return Number((amount * 1.025).toFixed(2));
}

export function processInvoiceData(data: any, userInput: any): ProcessedInvoice {
  try {
    const parsedData = sanitizeJSON(data) as InvoiceResponse;
    const invoiceData: Partial<ProcessedInvoice> = {
      incoterms: parsedData.delivery?.terms?.split(' ')[0] || 'FOB',
      date: new Date().toLocaleDateString('en-GB'),
      items: parsedData.items || [],
      currency: parsedData.items?.[0]?.currency || '€',
      invoiceNumber: userInput.invoiceNumber,
      paymentTerms: userInput.paymentTerms,
      clientDetails: userInput.clientDetails
    };
    
    if (!parsedData || !parsedData.items) {
      throw new Error('Invalid invoice data structure');
    }
  
    const currency = parsedData.items[0]?.currency || 'EUR';
    
    // Process items with proper calculations
    const items = parsedData.items.map(item => {
      const quantity = Number(item.quantity || 0);
      const unitPrice = Number(item.unitPrice || 0);
      const total = calculateItemTotal(item);
      
      return {
        description: item.description || '',
        quantity,
        unitPrice,
        total,
        currency: item.currency || currency
      };
    });

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const originalTotal = subtotal;
    const markupTotal = applyMarkup(originalTotal);

    return {
      ...invoiceData,
      items,
      subtotal,
      originalTotal,
      markupTotal,
      markupApplied: true,
    };
  } catch (error) {
    console.error('Error processing invoice data:', error);
    throw new Error('Failed to process invoice data: ' + (error as Error).message);
  }
}