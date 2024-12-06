import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { ProcessedInvoice } from '../types/invoice';
import { OMEGA_LOGO_URL, COMPANY_INFO } from './constants';

export function generateInvoicePDF(invoice: ProcessedInvoice): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Add logo
  doc.addImage(OMEGA_LOGO_URL, 'JPEG', 15, 15, 60, 25);
  
  // Company details
  doc.setFontSize(10);
  doc.text(COMPANY_INFO.name, 15, 50);
  doc.text(COMPANY_INFO.subname, 15, 55);
  doc.text(COMPANY_INFO.address, 15, 60);
  doc.text(COMPANY_INFO.city, 15, 65);
  doc.text(`VAT NM: ${COMPANY_INFO.vat}`, 15, 70);
  doc.text(`EMAIL: ${COMPANY_INFO.email}`, 15, 75);
  
  // Invoice header
  doc.setFontSize(24);
  doc.text('INVOICE', 195, 30, { align: 'right' });
  doc.setFontSize(10);
  doc.text(`Invoice No: ${invoice.invoiceNumber}`, 195, 50, { align: 'right' });
  doc.text(`Date: ${new Date().toLocaleDateString('en-GB')}`, 195, 55, { align: 'right' });
  doc.text(`Incoterms: ${invoice.incoterms.split(' ')[0]}`, 195, 60, { align: 'right' });
  doc.text('Country of Origin: Turkey', 195, 65, { align: 'right' });
  doc.text(`Payment Terms: ${invoice.paymentTerms}`, 195, 70, { align: 'right' });
  
  // Bill To section
  doc.setFontSize(12);
  doc.text('Bill To:', 15, 95);
  doc.setFontSize(10);
  doc.text(invoice.clientDetails.name, 15, 102);
  doc.text(invoice.clientDetails.address, 15, 109);
  doc.text(`VAT: ${invoice.clientDetails.taxId}`, 15, 116);

  // Items table
  const tableBody = invoice.items.map(item => [
    item.description,
    item.quantity.toString(),
    `${invoice.currency} ${item.unitPrice.toFixed(2)}`,
    `${invoice.currency} ${item.total.toFixed(2)}`
  ]);

  autoTable(doc, {
    startY: 135,
    margin: { left: 15, right: 15 },
    head: [['Description', 'Quantity', 'Unit Price', 'Total']],
    body: tableBody,
    theme: 'grid',
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold',
      halign: 'center'
    },
    columnStyles: {
      0: { cellWidth: 'auto', minCellWidth: 80 },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 40, halign: 'right' },
      3: { cellWidth: 40, halign: 'right' }
    },
    styles: {
      fontSize: 9,
      cellPadding: 5,
      lineWidth: 0.1,
      lineColor: [80, 80, 80],
      textColor: [50, 50, 50]
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    }
  });

  // Add totals section
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  const totalsX = 195;

  doc.setFontSize(10);
  doc.text(`Subtotal: ${invoice.currency} ${invoice.subtotal.toFixed(2)}`, totalsX, finalY, { align: 'right' });
  doc.text(`Markup (2.5%): ${invoice.currency} ${(invoice.markupTotal - invoice.originalTotal).toFixed(2)}`, totalsX, finalY + 7, { align: 'right' });
  
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text(`Total: ${invoice.currency} ${invoice.markupTotal.toFixed(2)}`, totalsX, finalY + 15, { align: 'right' });

  // Save the PDF
  doc.save(`omega-invoice-${invoice.invoiceNumber}.pdf`);
}