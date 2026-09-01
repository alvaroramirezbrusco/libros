import type{Book} from './book'

export interface ItemHistorial {
    libro: Book
    visitados: number //Date.now() del mosmento en que se abrio el detalle del libro
}