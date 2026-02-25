export interface DatosEmpresa {
  nombre: string;
  nit: string;
  contactoNombre: string;
  contactoEmail: string;
  contactoTelefono: string;
  numEmpleados: number;
}

export interface ServiciosSeleccionados {
  examenes: {
    ingreso: boolean;
    periodico: boolean;
    egreso: boolean;
  };
  examenesAdicionales: {
    audiometria: boolean;
    visiometria: boolean;
    espirometria: boolean;
  };
  laboratorio: 'ninguno' | 'basico' | 'completo';
  sst: 'ninguno' | 'basico' | 'completo';
}

export interface LineaCotizacion {
  concepto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Cotizacion {
  empresa: DatosEmpresa;
  lineas: LineaCotizacion[];
  subtotal: number;
  iva: number;
  total: number;
  fecha: string;
  numero: string;
}

export type Step = 1 | 2 | 3 | 4 | 5;
