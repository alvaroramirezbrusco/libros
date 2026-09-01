import type { ItemDeseo } from '../types/deseo'

// Capa de persistencia de la lista de deseos.
// Es el unico archivo que toca localStorage los componentes solo


const CLAVE = 'listaDeseos'

// Devuelve la lista guardada (o [] si no hay nada / el JSON está roto).
export function leerListaDeseos(): ItemDeseo[] {
  const guardado = localStorage.getItem(CLAVE)
  if (!guardado) return []

  try {
    return JSON.parse(guardado) as ItemDeseo[]
  } catch {
    return [] // si el JSON está defectuoso, arrancamos de cero
  }
}

// Agrega un ítem al final de la lista y guarda todo de nuevo.
export function agregarListaDeseos(item: ItemDeseo) {
  const actuales = leerListaDeseos()
  actuales.push(item)
  localStorage.setItem(CLAVE, JSON.stringify(actuales))
}

// Saca de la lista el ítem con ese id y guarda el resto.
export function eliminarListaDeseos(id: string) {
  const actuales = leerListaDeseos()
  const filtrados = actuales.filter((i) => i.id !== id)
  localStorage.setItem(CLAVE, JSON.stringify(filtrados))
}
