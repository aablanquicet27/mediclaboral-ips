/**
 * PDF generator for MedicLaboral IPS quotations.
 * Uses jsPDF with custom branding, tables, and professional layout.
 */

import jsPDF from 'jspdf';
import type { Cotizacion } from '../types';
import { formatearPrecio } from '../lib/calculos';

// ─── Brand colors (RGB) ─────────────────────────────────────────────────────
const COLORS = {
  primary:    [14, 116, 144] as [number, number, number],
  primaryDark:[12, 100, 120] as [number, number, number],
  accent:     [5, 150, 105] as [number, number, number],
  dark:       [15, 23, 42] as [number, number, number],
  muted:      [100, 116, 139] as [number, number, number],
  light:      [226, 232, 240] as [number, number, number],
  white:      [255, 255, 255] as [number, number, number],
  lightBg:    [240, 249, 255] as [number, number, number],
  successBg:  [236, 253, 245] as [number, number, number],
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function setFont(
  doc: jsPDF,
  size: number,
  style: 'normal' | 'bold' = 'normal',
  color: [number, number, number] = COLORS.dark
) {
  doc.setFontSize(size);
  doc.setFont('helvetica', style);
  doc.setTextColor(color[0], color[1], color[2]);
}

function fillRect(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  fillColor: [number, number, number],
  radius = 0
) {
  doc.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
  if (radius > 0) {
    doc.roundedRect(x, y, w, h, radius, radius, 'F');
  } else {
    doc.rect(x, y, w, h, 'F');
  }
}

// ─── Main export ────────────────────────────────────────────────────────────

export async function generarPDF(cotizacion: Cotizacion): Promise<void> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const marginL = 18;
  const marginR = 18;
  const contentW = pageW - marginL - marginR;

  // ── Header background ──────────────────────────────────────────────────
  fillRect(doc, 0, 0, pageW, 52, COLORS.primary);
  fillRect(doc, 0, 48, pageW, 4, COLORS.accent);

  // Company name — left side
  setFont(doc, 22, 'bold', COLORS.white);
  doc.text('MedicLaboral IPS', marginL, 22);

  setFont(doc, 9, 'normal', [180, 230, 240]);
  doc.text('Salud Ocupacional & SST · NIT 900.123.456-7', marginL, 30);
  doc.text('mediclaboral.com  ·  Tel: 601 700 0000', marginL, 37);

  // Quote label — right side
  setFont(doc, 10, 'bold', COLORS.white);
  doc.text('COTIZACIÓN', pageW - marginR, 18, { align: 'right' });

  setFont(doc, 9, 'normal', [200, 240, 248]);
  doc.text(cotizacion.numero, pageW - marginR, 25, { align: 'right' });
  doc.text(`Fecha: ${cotizacion.fecha}`, pageW - marginR, 32, { align: 'right' });
  doc.text('Válida por 30 días', pageW - marginR, 39, { align: 'right' });

  let y = 64;

  // ── Client information card ────────────────────────────────────────────
  fillRect(doc, marginL, y, contentW, 42, COLORS.lightBg, 4);
  doc.setDrawColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setLineWidth(0.5);
  doc.roundedRect(marginL, y, contentW, 42, 4, 4, 'S');

  setFont(doc, 8, 'bold', COLORS.primary);
  doc.text('DATOS DEL CLIENTE', marginL + 5, y + 8);

  const col1 = marginL + 5;
  const col2 = pageW / 2 + 5;
  let infoY = y + 15;

  const leftRows: [string, string][] = [
    ['Razón social:', cotizacion.empresa.nombre],
    ['NIT:', cotizacion.empresa.nit],
    ['N.° empleados:', String(cotizacion.empresa.numEmpleados)],
  ];

  const rightRows: [string, string][] = [
    ['Contacto:', cotizacion.empresa.contactoNombre],
    ['Teléfono:', cotizacion.empresa.contactoTelefono],
    ['Email:', cotizacion.empresa.contactoEmail],
  ];

  leftRows.forEach(([label, value]) => {
    setFont(doc, 8, 'bold', COLORS.muted);
    doc.text(label, col1, infoY);
    setFont(doc, 8, 'normal', COLORS.dark);
    doc.text(value, col1 + 28, infoY);
    infoY += 6;
  });

  infoY = y + 15;
  rightRows.forEach(([label, value]) => {
    setFont(doc, 8, 'bold', COLORS.muted);
    doc.text(label, col2, infoY);
    setFont(doc, 8, 'normal', COLORS.dark);
    doc.text(value, col2 + 22, infoY);
    infoY += 6;
  });

  y += 50;

  // ── Table header ───────────────────────────────────────────────────────
  fillRect(doc, marginL, y, contentW, 9, COLORS.primaryDark);

  const colConcepto = marginL + 3;
  const colCant     = marginL + contentW * 0.62;
  const colUnitario = marginL + contentW * 0.76;
  const colSubtotal = marginL + contentW - 3;

  setFont(doc, 8, 'bold', COLORS.white);
  doc.text('Concepto / Servicio', colConcepto, y + 6);
  doc.text('Cant.', colCant, y + 6, { align: 'center' });
  doc.text('Precio unit.', colUnitario, y + 6, { align: 'right' });
  doc.text('Subtotal', colSubtotal, y + 6, { align: 'right' });

  y += 9;

  // ── Table rows ─────────────────────────────────────────────────────────
  if (cotizacion.lineas.length === 0) {
    fillRect(doc, marginL, y, contentW, 14, COLORS.white);
    setFont(doc, 9, 'normal', COLORS.muted);
    doc.text('No se seleccionaron servicios.', pageW / 2, y + 9, { align: 'center' });
    y += 14;
  } else {
    cotizacion.lineas.forEach((linea, i) => {
      const rowH = 9;
      const bgColor: [number, number, number] = i % 2 === 0 ? COLORS.white : [248, 250, 252];
      fillRect(doc, marginL, y, contentW, rowH, bgColor);

      doc.setDrawColor(COLORS.light[0], COLORS.light[1], COLORS.light[2]);
      doc.setLineWidth(0.3);
      doc.line(marginL, y + rowH, marginL + contentW, y + rowH);

      // Truncate long names to avoid overflow
      const maxW = contentW * 0.56;
      const conceptText = (doc.splitTextToSize(linea.concepto, maxW) as string[])[0];

      setFont(doc, 8, 'normal', COLORS.dark);
      doc.text(conceptText, colConcepto, y + 6);

      setFont(doc, 8, 'normal', COLORS.muted);
      doc.text(String(linea.cantidad), colCant, y + 6, { align: 'center' });

      setFont(doc, 8, 'normal', COLORS.dark);
      doc.text(formatearPrecio(linea.precioUnitario), colUnitario, y + 6, { align: 'right' });

      setFont(doc, 8, 'bold', COLORS.dark);
      doc.text(formatearPrecio(linea.subtotal), colSubtotal, y + 6, { align: 'right' });

      y += rowH;
    });
  }

  y += 6;

  // ── Totals ─────────────────────────────────────────────────────────────
  const totalsX = marginL + contentW * 0.5;

  setFont(doc, 9, 'normal', COLORS.muted);
  doc.text('Subtotal:', totalsX + 4, y);
  setFont(doc, 9, 'normal', COLORS.dark);
  doc.text(formatearPrecio(cotizacion.subtotal), marginL + contentW, y, { align: 'right' });

  y += 6;

  setFont(doc, 9, 'normal', COLORS.muted);
  doc.text('IVA (19%):', totalsX + 4, y);
  setFont(doc, 9, 'normal', COLORS.dark);
  doc.text(formatearPrecio(cotizacion.iva), marginL + contentW, y, { align: 'right' });

  y += 5;

  doc.setDrawColor(COLORS.light[0], COLORS.light[1], COLORS.light[2]);
  doc.setLineWidth(0.5);
  doc.line(totalsX, y, marginL + contentW, y);

  y += 7;

  fillRect(doc, totalsX, y - 5, contentW * 0.5, 14, COLORS.primary, 3);
  setFont(doc, 11, 'bold', COLORS.white);
  doc.text('TOTAL:', totalsX + 5, y + 4);
  doc.text(formatearPrecio(cotizacion.total), marginL + contentW - 3, y + 4, { align: 'right' });

  y += 22;

  // ── Value props ────────────────────────────────────────────────────────
  fillRect(doc, marginL, y, contentW, 18, COLORS.successBg, 4);
  doc.setDrawColor(COLORS.accent[0], COLORS.accent[1], COLORS.accent[2]);
  doc.setLineWidth(0.4);
  doc.roundedRect(marginL, y, contentW, 18, 4, 4, 'S');

  setFont(doc, 7.5, 'bold', COLORS.accent);
  const props = [
    'Examenes en 1 hora',
    'Resultados en 4 horas',
    'Cert. Res. 2346/2007',
    'Sede propia + domicilio',
  ];
  const propW = contentW / props.length;
  props.forEach((prop, i) => {
    doc.text(prop, marginL + propW * i + propW / 2, y + 11, { align: 'center' });
  });

  y += 26;

  // ── Notes ──────────────────────────────────────────────────────────────
  setFont(doc, 7.5, 'normal', COLORS.muted);
  [
    '* Precios en pesos colombianos (COP). IVA incluido en el total.',
    '* Cotización válida por 30 días calendario desde la fecha de emisión.',
    '* Los precios por empleado se calculan según el número indicado en datos del cliente.',
    '* Sujeto a disponibilidad de agenda. Contáctenos para programar.',
  ].forEach((note) => {
    doc.text(note, marginL, y);
    y += 5;
  });

  y += 4;

  // ── CTA ────────────────────────────────────────────────────────────────
  if (y < pageH - 40) {
    fillRect(doc, marginL, y, contentW, 20, COLORS.lightBg, 4);
    setFont(doc, 9, 'bold', COLORS.primary);
    doc.text('¿Listo para agendar?', pageW / 2, y + 7, { align: 'center' });
    setFont(doc, 8, 'normal', COLORS.muted);
    doc.text('601 700 0000  ·  WhatsApp: 300 000 0000  ·  info@mediclaboral.com', pageW / 2, y + 14, { align: 'center' });
  }

  // ── Footer ─────────────────────────────────────────────────────────────
  doc.setDrawColor(COLORS.light[0], COLORS.light[1], COLORS.light[2]);
  doc.setLineWidth(0.3);
  doc.line(marginL, pageH - 16, marginL + contentW, pageH - 16);

  setFont(doc, 7, 'normal', COLORS.muted);
  doc.text(
    'MedicLaboral IPS · Salud Ocupacional · Habilitada MinSalud · NIT 900.123.456-7',
    pageW / 2, pageH - 10, { align: 'center' }
  );
  doc.text(
    `Generado el ${cotizacion.fecha} · ${cotizacion.numero}`,
    pageW / 2, pageH - 5, { align: 'center' }
  );

  // ── Download ───────────────────────────────────────────────────────────
  doc.save(`Cotizacion_MedicLaboral_${cotizacion.numero}.pdf`);
}
