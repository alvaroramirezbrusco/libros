import type{BookDetail} from './book'

export interface ItemHistorial {
    libro: BookDetail
    visitados: number //Date.now() del mosmento en que se abrio el detalle del libro
}