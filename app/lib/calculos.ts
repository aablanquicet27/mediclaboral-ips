import { DatosEmpresa, ServiciosSeleccionados, Cotizacion, LineaCotizacion } from '../types';

// Precios en COP - ajustables por el cliente
export const PRECIOS = {
  examenes: {
    ingreso: 45000,
    periodico: 40000,
    egreso: 35000,
  },
  examenesAdicionales: {
    audiometria: 20000,
    visiometria: 15000,
    espirometria: 25000,
  },
  laboratorio: {
    ninguno: 0,
    basico: 25000,
    completo: 45000,
  },
  sst: {
    ninguno: 0,
    basico: 150000,
    completo: 500000,
  },
};

export const NOMBRES_SERVICIOS = {
  examenes: {
    ingreso: 'Examen Ocupacional de Ingreso',
    periodico: 'Examen Ocupacional Periódico',
    egreso: 'Examen Ocupacional de Egreso',
  },
  examenesAdicionales: {
    audiometria: 'Audiometría',
    visiometria: 'Visiometría',
    espirometria: 'Espirometría',
  },
  laboratorio: {
    basico: 'Laboratorio Básico (Hemograma, Glicemia, Parcial Orina)',
    completo: 'Laboratorio Completo (Básico + Perfil Lipídico + Creatinina)',
  },
  sst: {
    basico: 'SST Básico (Capacitación)',
    completo: 'SST Completo (Diagnóstico + Plan + Capacitación)',
  },
};

export function generarNumeroCotizacion(): string {
  const fecha = new Date();
  const año = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `COT-${año}${mes}-${random}`;
}

export function calcularCotizacion(
  empresa: DatosEmpresa,
  servicios: ServiciosSeleccionados
): Cotizacion {
  const lineas: LineaCotizacion[] = [];
  const numEmpleados = empresa.numEmpleados;

  // Exámenes ocupacionales
  Object.entries(servicios.examenes).forEach(([tipo, seleccionado]) => {
    if (seleccionado) {
      const tipoKey = tipo as keyof typeof servicios.examenes;
      lineas.push({
        concepto: NOMBRES_SERVICIOS.examenes[tipoKey],
        cantidad: numEmpleados,
        precioUnitario: PRECIOS.examenes[tipoKey],
        subtotal: numEmpleados * PRECIOS.examenes[tipoKey],
      });
    }
  });

  // Exámenes adicionales
  Object.entries(servicios.examenesAdicionales).forEach(([tipo, seleccionado]) => {
    if (seleccionado) {
      const tipoKey = tipo as keyof typeof servicios.examenesAdicionales;
      lineas.push({
        concepto: NOMBRES_SERVICIOS.examenesAdicionales[tipoKey],
        cantidad: numEmpleados,
        precioUnitario: PRECIOS.examenesAdicionales[tipoKey],
        subtotal: numEmpleados * PRECIOS.examenesAdicionales[tipoKey],
      });
    }
  });

  // Laboratorio
  if (servicios.laboratorio !== 'ninguno') {
    lineas.push({
      concepto: NOMBRES_SERVICIOS.laboratorio[servicios.laboratorio],
      cantidad: numEmpleados,
      precioUnitario: PRECIOS.laboratorio[servicios.laboratorio],
      subtotal: numEmpleados * PRECIOS.laboratorio[servicios.laboratorio],
    });
  }

  // SST (precio fijo)
  if (servicios.sst !== 'ninguno') {
    lineas.push({
      concepto: NOMBRES_SERVICIOS.sst[servicios.sst],
      cantidad: 1,
      precioUnitario: PRECIOS.sst[servicios.sst],
      subtotal: PRECIOS.sst[servicios.sst],
    });
  }

  const subtotal = lineas.reduce((acc, linea) => acc + linea.subtotal, 0);
  const iva = subtotal * 0.19;
  const total = subtotal + iva;

  return {
    empresa,
    lineas,
    subtotal,
    iva,
    total,
    fecha: new Date().toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    numero: generarNumeroCotizacion(),
  };
}

export function formatearPrecio(valor: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(valor);
}
