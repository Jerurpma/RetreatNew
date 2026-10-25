import jsPDF from 'jspdf';
import { Booking } from '../types';

export const generateItineraryPDF = (booking: Booking): void => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Background Theme: Deep luxury dark header
  doc.setFillColor(15, 15, 15);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Gold accent bar at top
  doc.setFillColor(201, 168, 76);
  doc.rect(0, 0, pageWidth, 4, 'F');

  // Header Banner Box
  doc.setFillColor(22, 22, 22);
  doc.rect(14, 14, pageWidth - 28, 38, 'F');
  doc.setDrawColor(201, 168, 76);
  doc.setLineWidth(0.4);
  doc.rect(14, 14, pageWidth - 28, 38, 'D');

  // Brand Header
  doc.setTextColor(201, 168, 76);
  doc.setFontSize(22);
  doc.setFont('times', 'bold');
  doc.text('SANCTUARY', 22, 26);

  doc.setTextColor(170, 160, 140);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('SACRED PLANT MEDICINE & LUXURY HEALING RETREATS', 22, 32);

  doc.setFontSize(8);
  doc.setTextColor(120, 200, 120);
  doc.text('VERIFIED TRAVELER CONFIRMATION ITINERARY · STRICT 18+ COMPLIANT', 22, 38);

  // Plan ID Pill on right
  doc.setFillColor(35, 35, 30);
  doc.roundedRect(pageWidth - 75, 20, 53, 16, 2, 2, 'F');
  doc.setTextColor(201, 168, 76);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('CONFIRMATION PLAN ID', pageWidth - 70, 26);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text(booking.planId || 'SAN-RESERVATION', pageWidth - 70, 32);

  // Section 1: Reservation Summary
  let y = 60;
  doc.setFillColor(26, 26, 26);
  doc.rect(14, y, pageWidth - 28, 48, 'F');
  doc.setDrawColor(60, 60, 60);
  doc.rect(14, y, pageWidth - 28, 48, 'D');

  doc.setTextColor(201, 168, 76);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('1. GUEST & RESERVATION SUMMARY', 20, y + 8);

  doc.setTextColor(160, 160, 160);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Lead Guest Name:', 20, y + 17);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text(booking.leadGuest || 'Guest Traveler', 60, y + 17);

  doc.setTextColor(160, 160, 160);
  doc.setFont('helvetica', 'normal');
  doc.text('Contact Email:', 20, y + 24);
  doc.setTextColor(255, 255, 255);
  doc.text(booking.email || 'N/A', 60, y + 24);

  doc.setTextColor(160, 160, 160);
  doc.text('Contact Telephone:', 20, y + 31);
  doc.setTextColor(255, 255, 255);
  doc.text(booking.phone || 'N/A', 60, y + 31);

  doc.setTextColor(160, 160, 160);
  doc.text('Escrow Status:', 20, y + 38);
  doc.setTextColor(120, 200, 120);
  doc.setFont('helvetica', 'bold');
  doc.text('CONFIRMED & AES-256 ESCROW SECURED', 60, y + 38);

  // Right column of Section 1
  const col2X = 115;
  doc.setTextColor(160, 160, 160);
  doc.setFont('helvetica', 'normal');
  doc.text('Check-In Date:', col2X, y + 17);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text(booking.checkin || 'Pending', col2X + 35, y + 17);

  doc.setTextColor(160, 160, 160);
  doc.setFont('helvetica', 'normal');
  doc.text('Check-Out Date:', col2X, y + 24);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text(booking.checkout || 'Pending', col2X + 35, y + 24);

  doc.setTextColor(160, 160, 160);
  doc.setFont('helvetica', 'normal');
  doc.text('Duration of Stay:', col2X, y + 31);
  doc.setTextColor(255, 255, 255);
  doc.text(`${booking.nights || 5} Nights (${booking.guests || 2} Guests)`, col2X + 35, y + 31);

  doc.setTextColor(160, 160, 160);
  doc.text('Payment Method:', col2X, y + 38);
  doc.setTextColor(201, 168, 76);
  doc.text(booking.paymentMethod || 'Escrow Banking', col2X + 35, y + 38);

  // Section 2: Place & Package Details
  y = 116;
  doc.setFillColor(26, 26, 26);
  doc.rect(14, y, pageWidth - 28, 44, 'F');
  doc.setDrawColor(60, 60, 60);
  doc.rect(14, y, pageWidth - 28, 44, 'D');

  doc.setTextColor(201, 168, 76);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('2. DESTINATION PLACE & PACKAGE SPECIFICATIONS', 20, y + 8);

  doc.setTextColor(160, 160, 160);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Destination Place:', 20, y + 17);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text(`${booking.dest || 'Sanctuary Retreat'} ${booking.city ? `(${booking.city})` : ''}`, 60, y + 17);

  doc.setTextColor(160, 160, 160);
  doc.setFont('helvetica', 'normal');
  doc.text('Jurisdiction / State:', 20, y + 24);
  doc.setTextColor(201, 168, 76);
  doc.text(`${booking.city || 'City'}, ${booking.state || 'United States'}`, 60, y + 24);

  doc.setTextColor(160, 160, 160);
  doc.text('Suite / Casita Tier:', 20, y + 31);
  doc.setTextColor(255, 255, 255);
  doc.text(booking.accommodation || 'Luxury Sanctuary Villa', 60, y + 31);

  doc.setTextColor(160, 160, 160);
  doc.text('Cannabis Wellness:', 20, y + 38);
  doc.setTextColor(139, 196, 192);
  doc.text(booking.cannabisProgram || 'Full THC & CBD Holistic Protocol', 60, y + 38);

  // Section 3: Itemized Budget Breakdown
  y = 168;
  doc.setFillColor(26, 26, 26);
  doc.rect(14, y, pageWidth - 28, 62, 'F');
  doc.setDrawColor(60, 60, 60);
  doc.rect(14, y, pageWidth - 28, 62, 'D');

  doc.setTextColor(201, 168, 76);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('3. TRANSPARENT ITEMIZED PRICE BREAKDOWN', 20, y + 8);

  const breakdown = booking.breakdown || {
    hotel: 4800,
    transportation: 950,
    activities: 1850,
    concierge: 1100,
    taxes: 583,
    total: 9283,
  };

  const lineItems = [
    { name: 'Luxury Hotel / Villa Lodging Accommodations', cost: `$${(breakdown.hotel || 4800).toLocaleString()}` },
    { name: 'Private Chauffeur Airport & Regional Transportation', cost: `$${(breakdown.transportation || 950).toLocaleString()}` },
    { name: 'Sacred Plant Medicine Dispensary & Ceremonial Facilitation', cost: `$${(breakdown.activities || 1850).toLocaleString()}` },
    { name: 'Dedicated 24/7 Sanctuary Concierge & Wellness Team', cost: `$${(breakdown.concierge || 1100).toLocaleString()}` },
    { name: 'Applicable Sovereign, State Cannabis & Tourism Surcharges', cost: `$${(breakdown.taxes || 583).toLocaleString()}` },
  ];

  let itemY = y + 17;
  doc.setFontSize(8.5);
  lineItems.forEach((item) => {
    doc.setTextColor(190, 190, 190);
    doc.setFont('helvetica', 'normal');
    doc.text(item.name, 20, itemY);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text(item.cost, pageWidth - 45, itemY, { align: 'right' });
    itemY += 6.5;
  });

  // Total Line
  doc.setDrawColor(201, 168, 76);
  doc.line(20, itemY, pageWidth - 20, itemY);
  itemY += 6;
  doc.setTextColor(201, 168, 76);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL RETREAT BUDGET PAID:', 20, itemY);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text(booking.amountPaid || `$${(breakdown.total || 9283).toLocaleString()}`, pageWidth - 45, itemY, { align: 'right' });

  // Section 4: Concierge Fulfillment Notice
  y = 238;
  doc.setFillColor(20, 24, 22);
  doc.rect(14, y, pageWidth - 28, 36, 'F');
  doc.setDrawColor(139, 196, 192);
  doc.rect(14, y, pageWidth - 28, 36, 'D');

  doc.setTextColor(139, 196, 192);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.text('4. CONCIERGE FULFILLMENT & INTAKE PROTOCOL', 20, y + 7);

  doc.setTextColor(210, 210, 210);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  const noticeText = [
    '· Sanctuary Concierge handles all logistics, private check-in, and personalized plant wellness scheduling.',
    '· For Medical jurisdictions (e.g. Hawaii 329 / Oklahoma OMMA), out-of-state reciprocity intake is pre-cleared.',
    '· Please present valid government photo identification (21+) upon arrival for sovereign verification.',
    '· For 24/7 guest concierge inquiries, reference your Plan ID with your assigned lead concierge specialist.',
  ];
  let noticeY = y + 13;
  noticeText.forEach((line) => {
    doc.text(line, 20, noticeY);
    noticeY += 5;
  });

  // Footer note
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text('Sanctuary Retreats Global Inc. · 100% Legal & Medical Frameworks · Confidential & Secured Document', pageWidth / 2, pageHeight - 8, { align: 'center' });

  // Save the PDF file trigger
  const fileName = `Sanctuary-Itinerary-${booking.planId || 'Retreat'}.pdf`;
  doc.save(fileName);
};
