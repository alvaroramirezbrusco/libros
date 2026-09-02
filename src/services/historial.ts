import type { BookDetail } from '../types/book'
import type { ItemHistorial } from '../types/historial'

const CLAVE = 'historial'

// *Obtiene todos los libros guardados en el historial.*
export function leerHistorial(): ItemHistorial[] {
  const guardado = localStorage.getItem(CLAVE)
  if (!guardado) return []
  try {
    return JSON.parse(guardado) as ItemHistorial[]
  } catch {
    return []
  }
}

// *Registra una nueva visita en el historial.*
export function registrarVisita(libro: BookDetail) {
  const actuales = leerHistorial()
  // *Sacamos el libro de la lista si ya estaba para que no se repita.*
  const sinRepetir = actuales.filter(
    (i) => i.libro.id !== libro.id
  )
  // *Lo agregamos al principio porque es el más reciente.*
  const nuevo: ItemHistorial = {
    libro,
    visitados: Date.now()
  }
  // *Guardamos todos los libros, sin limitar la cantidad.*
  const lista = [nuevo, ...sinRepetir]
  localStorage.setItem(
    CLAVE,
    JSON.stringify(lista)
  )
}
