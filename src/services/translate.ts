// *Traducción de textos bajo demanda usando la API pública de MyMemory.*
// *No requiere API key. Guarda en localStorage lo ya traducido para no repetir llamadas.*

const PREFIJO_CACHE = 'traduccion:'

// *MyMemory limita cada request a ~500 bytes en el parámetro q.*
const LIMITE_SEGMENTO = 450

interface RespuestaMyMemory {
  responseData?: {
    translatedText?: string
  }
  responseStatus?: number
}

// *Hash simple y estable para armar la clave de cache a partir del texto original.*
function hashTexto(texto: string): string {
  let hash = 0
  for (let i = 0; i < texto.length; i++) {
    hash = (hash << 5) - hash + texto.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash).toString(36)
}

function claveCache(texto: string, destino: string): string {
  return `${PREFIJO_CACHE}${destino}:${hashTexto(texto)}`
}

function leerCache(texto: string, destino: string): string | null {
  try {
    return localStorage.getItem(claveCache(texto, destino))
  } catch {
    return null
  }
}

function guardarCache(texto: string, destino: string, traduccion: string) {
  try {
    localStorage.setItem(claveCache(texto, destino), traduccion)
  } catch {
    // *Si el almacenamiento está lleno o bloqueado, seguimos sin cachear.*
  }
}

// *Divide el texto en segmentos que no superen el límite de la API,*
// *cortando de preferencia al final de una oración.*
function dividirEnSegmentos(texto: string): string[] {
  if (texto.length <= LIMITE_SEGMENTO) return [texto]

  const oraciones = texto.match(/[^.!?]+[.!?]*\s*/g) ?? [texto]
  const segmentos: string[] = []
  let actual = ''

  for (const oracion of oraciones) {
    if ((actual + oracion).length > LIMITE_SEGMENTO && actual) {
      segmentos.push(actual)
      actual = ''
    }

    if (oracion.length > LIMITE_SEGMENTO) {
      // *Oración más larga que el límite: la partimos a la fuerza.*
      for (let i = 0; i < oracion.length; i += LIMITE_SEGMENTO) {
        segmentos.push(oracion.slice(i, i + LIMITE_SEGMENTO))
      }
    } else {
      actual += oracion
    }
  }

  if (actual) segmentos.push(actual)
  return segmentos
}

async function traducirSegmento(
  segmento: string,
  origen: string,
  destino: string
): Promise<string> {
  const url =
    'https://api.mymemory.translated.net/get?q=' +
    encodeURIComponent(segmento) +
    `&langpair=${origen}|${destino}`

  const respuesta = await fetch(url)

  if (!respuesta.ok) {
    throw new Error(`Error de traducción: HTTP ${respuesta.status}`)
  }

  const datos: RespuestaMyMemory = await respuesta.json()
  const traducido = datos.responseData?.translatedText

  if (!traducido || datos.responseStatus !== 200) {
    throw new Error('La API de traducción no devolvió texto.')
  }

  return traducido
}

// *Traduce un texto completo al idioma destino (por defecto español).*
// *Devuelve el resultado cacheado si ya se tradujo antes.*
export async function traducirTexto(
  texto: string,
  destino = 'es',
  origen = 'en'
): Promise<string> {
  const limpio = texto.trim()
  if (!limpio) return texto

  const enCache = leerCache(limpio, destino)
  if (enCache) return enCache

  const segmentos = dividirEnSegmentos(limpio)
  const traducidos: string[] = []

  for (const segmento of segmentos) {
    traducidos.push(await traducirSegmento(segmento, origen, destino))
  }

  const resultado = traducidos.join('')
  guardarCache(limpio, destino, resultado)
  return resultado
}
