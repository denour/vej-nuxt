/**
 * Fuente única de datos legales del sitio.
 * Aviso de privacidad (/privacidad), Términos de uso (/terminos) y los textos
 * legales de los formularios leen de aquí. No dupliques estos datos en páginas.
 */

export interface LegalProcessor {
  name: string
  purpose: string
  location: string
}

export const legal = {
  // TODO(Nestor): completar antes de publicar (nombre completo o razón social del responsable)
  owner: '[Nombre del responsable]',
  // TODO(Nestor): completar antes de publicar (domicilio para oír y recibir notificaciones)
  address: '[Domicilio]',
  brand: 'Vida en el Jardín',
  site: 'vidaeneljardin.com',
  privacyEmail: 'privacidad@vidaeneljardin.com',
  contactEmail: 'hola@vidaeneljardin.com',
  /** Fecha ISO (AAAA-MM-DD) de la última actualización de los textos legales. */
  lastUpdated: '2026-09-29',
  processors: [
    {
      name: 'Resend',
      purpose: 'Envío de correos electrónicos: respuestas a tus mensajes y el newsletter.',
      location: 'Estados Unidos',
    },
    {
      name: 'Vercel',
      purpose: 'Alojamiento y entrega del sitio web (hosting).',
      location: 'Estados Unidos y red global de distribución',
    },
    {
      name: 'Servidores propios',
      purpose: 'Almacenamiento de mensajes, suscripciones y contenido del sitio.',
      location: 'México / Estados Unidos',
    },
  ] as LegalProcessor[],
} as const

/** Fecha de última actualización en formato largo en español (p. ej. "29 de septiembre de 2026"). */
export function formatLegalDate(iso: string = legal.lastUpdated): string {
  const [y, m, d] = iso.split('-').map(Number)
  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
  ]
  return `${d} de ${months[(m ?? 1) - 1]} de ${y}`
}
