import type {Book} from '../types/book'
import type {ItemHistorial} from '../types/historial'

const CLAVE = 'historial'
const MAXIMO = 10 //para que no creca tanto dejamos en 10

export function leerHistorial(): ItemHistorial[] {
    const guardado = localStorage.getItem(CLAVE)
    if (!guardado) return []

    try{
      return JSON.parse(guardado) as ItemHistorial[]
    }catch{  
        return []
    }
} 
export function registrarVisita(libro: Book){
    const actuales = leerHistorial()
    //lo sacamos de la lista si ya estaba para que no se repita
    const sinRepetir = actuales.filter((i) => i.libro.id !== libro.id)
    
    //lo agregamos al principio(el mas reciente primero) y lo guardamos
    const nuevo: ItemHistorial = {libro,visitados: Date.now()}
    const lista = [nuevo,...sinRepetir].slice(0,MAXIMO)
    localStorage.setItem(CLAVE, JSON.stringify(lista))
}