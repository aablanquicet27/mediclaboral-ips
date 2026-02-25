'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  MessageCircle,
  RotateCcw,
  CheckCircle2,
  Clock,
  Zap,
  FileText,
  Building2,
  Users,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import type { Cotizacion } from '../types';
import { formatearPrecio } from '../lib/calculos';
import { generarPDF } from '../utils/pdf';

interface QuotationResultProps {
  cotizacion: Cotizacion;
  onReset: () => void;
  onToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function QuotationResult({
  cotizacion,
  onReset,
  onToast,
}: QuotationResultProps) {
  const [downloadingPDF, setDownloadingPDF] = useState(false);

  async function handleDownloadPDF() {
    setDownloadingPDF(true);
    try {
      await generarPDF(cotizacion);
      onToast('success', 'PDF generado', 'Su cotización ha sido descargada.');
    } catch {
      onToast('error', 'Error al generar PDF', 'Por favor intente nuevamente.');
    } finally {
      setDownloadingPDF(false);
    }
  }

  function handleWhatsApp() {
    const lineasTexto = cotizacion.lineas
      .map((l) => `  • ${l.concepto}: ${formatearPrecio(l.subtotal)}`)
      .join('\n');

    const mensaje = encodeURIComponent(
      `Hola MedicLaboral IPS 👋\n\n` +
      `Acabo de generar la cotización *${cotizacion.numero}* para:\n` +
      `*Empresa:* ${cotizacion.empresa.nombre}\n` +
      `*NIT:* ${cotizacion.empresa.nit}\n` +
      `*N.° empleados:* ${cotizacion.empresa.numEmpleados}\n\n` +
      `*Servicios seleccionados:*\n${lineasTexto}\n\n` +
      `*TOTAL:* ${formatearPrecio(cotizacion.total)}\n\n` +
      `¿Podría confirmarme la disponibilidad para agendar? Gracias.`
    );

    window.open(`https://wa.me/573000000000?text=${mensaje}`, '_blank');
    onToast('info', 'Abriendo WhatsApp', 'Redirigiendo a conversación.');
  }

  const expirationDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
  })();

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">

      {/* Success header */}
      <motion.div
        variants={itemVariants}
        className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-100"
      >
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-200">
          <CheckCircle2 size={28} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-slate-800">¡Cotización lista!</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {cotizacion.numero} · Válida hasta el {expirationDate}
          </p>
        </div>
        <div className="hidden sm:flex flex-col items-end">
          <p className="text-2xl font-bold text-cyan-700">{formatearPrecio(cotizacion.total)}</p>
          <p className="text-xs text-slate-400">IVA incluido</p>
        </div>
      </motion.div>

      {/* Client + total (mobile) */}
      <div className="sm:hidden">
        <motion.div
          variants={itemVariants}
          className="glass-card rounded-2xl p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Building2 size={18} className="text-cyan-600" />
            <div>
              <p className="text-sm font-semibold text-slate-800 truncate max-w-[180px]">
                {cotizacion.empresa.nombre}
              </p>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <Users size={10} />
                {cotizacion.empresa.numEmpleados} empleados
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-cyan-700">{formatearPrecio(cotizacion.total)}</p>
            <p className="text-xs text-slate-400">IVA incluido</p>
          </div>
        </motion.div>
      </div>

      {/* Services breakdown */}
      <motion.div variants={itemVariants} className="glass-card rounded-2xl overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/50">
          <FileText size={16} className="text-cyan-600" />
          <h3 className="font-bold text-slate-800 text-sm">Desglose de servicios</h3>
        </div>

        <div className="divide-y divide-slate-100/80">
          {cotizacion.lineas.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className="text-sm text-slate-400">No se seleccionaron servicios.</p>
            </div>
          ) : (
            cotizacion.lineas.map((linea, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.06 }}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-cyan-50/30 transition-colors"
              >
                <ChevronRight size={14} className="text-cyan-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{linea.concepto}</p>
                  <p className="text-xs text-slate-400">
                    {formatearPrecio(linea.precioUnitario)} × {linea.cantidad} unid.
                  </p>
                </div>
                <p className="text-sm font-bold text-slate-700 whitespace-nowrap">
                  {formatearPrecio(linea.subtotal)}
                </p>
              </motion.div>
            ))
          )}
        </div>

        {/* Totals */}
        <div className="px-5 py-4 bg-slate-50/60 border-t border-slate-100 space-y-2">
          <div className="flex justify-between text-sm text-slate-500">
            <span>Subtotal</span>
            <span className="font-medium text-slate-700">{formatearPrecio(cotizacion.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-slate-500">
            <span>IVA (19%)</span>
            <span className="font-medium text-slate-700">{formatearPrecio(cotizacion.iva)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-slate-200">
            <span className="font-bold text-base text-slate-800">Total</span>
            <span className="font-bold text-xl text-cyan-700">{formatearPrecio(cotizacion.total)}</span>
          </div>
        </div>
      </motion.div>

      {/* Value props */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: <Clock size={16} />, label: 'Exámenes', value: '1 hora', color: 'text-cyan-600', bg: 'bg-cyan-50' },
          { icon: <Zap size={16} />, label: 'Resultados', value: '4 horas', color: 'text-amber-600', bg: 'bg-amber-50' },
          { icon: <CheckCircle2 size={16} />, label: 'Certificado', value: 'Res. 2346', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { icon: <FileText size={16} />, label: 'Validez', value: '30 días', color: 'text-violet-600', bg: 'bg-violet-50' },
        ].map((prop) => (
          <div key={prop.label} className="glass-card rounded-xl p-3.5 text-center">
            <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${prop.bg} ${prop.color} mb-2`}>
              {prop.icon}
            </div>
            <p className="text-xs text-slate-400">{prop.label}</p>
            <p className={`text-sm font-bold ${prop.color}`}>{prop.value}</p>
          </div>
        ))}
      </motion.div>

      {/* Action buttons */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Download PDF */}
        <button
          onClick={handleDownloadPDF}
          disabled={downloadingPDF}
          className="
            flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl
            bg-gradient-to-r from-cyan-600 to-cyan-700 text-white font-semibold text-sm
            hover:from-cyan-500 hover:to-cyan-600
            active:scale-[0.98] transition-all duration-200
            shadow-lg shadow-cyan-200
            disabled:opacity-70 disabled:cursor-not-allowed
          "
        >
          {downloadingPDF ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Download size={18} />
          )}
          {downloadingPDF ? 'Generando...' : 'Descargar PDF'}
        </button>

        {/* WhatsApp */}
        <button
          onClick={handleWhatsApp}
          className="
            flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl
            bg-gradient-to-r from-[#25D366] to-[#1da851] text-white font-semibold text-sm
            hover:from-[#20c45c] hover:to-[#19a048]
            active:scale-[0.98] transition-all duration-200
            shadow-lg shadow-green-200
          "
        >
          <MessageCircle size={18} />
          Enviar por WhatsApp
        </button>
      </motion.div>

      {/* New quotation */}
      <motion.div variants={itemVariants}>
        <button
          onClick={onReset}
          className="
            flex items-center gap-2 text-sm text-slate-500
            hover:text-cyan-700 transition-colors duration-200
            py-2
          "
        >
          <RotateCcw size={14} />
          Hacer una nueva cotización
        </button>
      </motion.div>
    </motion.div>
  );
}
