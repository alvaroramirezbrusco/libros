# BookWeb

Aplicación web para **buscar libros, ver su detalle, armar una lista de deseos y
consultar el historial de lectura**. Los datos de los libros se obtienen en vivo
desde la API pública de [Open Library](https://openlibrary.org/developers/api).

> Trabajo integrador — Aplicaciones Móviles.

---

## URL de producción (GitHub Pages)

> ⚠️ **Pendiente de publicar.** Al momento de la entrega el proyecto **todavía no
> está hosteado** en GitHub Pages (no hay branch `gh-pages` ni workflow de
> despliegue en el repo). Ver la sección [Despliegue en GitHub Pages](#despliegue-en-github-pages)
> para los pasos. Una vez publicado, la URL será aproximadamente:
>
> `https://alvaroramirezbrusco.github.io/libros/`

Repositorio: <https://github.com/alvaroramirezbrusco/libros>

---

## Requisitos para levantar el proyecto en local

| Herramienta | Versión recomendada | Notas |
|-------------|---------------------|-------|
| **Node.js** | 20.19+ o 22.12+ | Requerido por Vite 8. Probado con Node 22. |
| **npm**     | 10+ (viene con Node) | También sirve `pnpm` o `yarn`. |
| Navegador moderno | Chrome / Edge / Firefox actualizado | La app usa `fetch`, `localStorage` y CSS moderno. |
| Conexión a internet | — | Los libros se piden en tiempo real a Open Library y la traducción a MyMemory. |

No hace falta ninguna API key ni archivo `.env`: todas las APIs usadas son
públicas y sin autenticación.

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/alvaroramirezbrusco/libros.git
cd libros

# 2. Instalar dependencias
npm install

# 3. Levantar el servidor de desarrollo (Vite + HMR)
npm run dev
```

Vite imprime la URL local (por defecto <http://localhost:5173>).

### Scripts disponibles

| Comando | Qué hace |
|---------|----------|
| `npm run dev` | Servidor de desarrollo con recarga en caliente. |
| `npm run build` | Chequeo de tipos (`tsc -b`) + build de producción en `dist/`. |
| `npm run preview` | Sirve localmente el contenido de `dist/` para probar el build. |
| `npm run lint` | Corre ESLint sobre todo el proyecto. |

---

## Enfoque del trabajo integrador

### Framework y stack

- **React 19 + TypeScript**, empaquetado con **Vite 8**. Se eligió React por el
  modelo de componentes y el ecosistema de hooks, que encaja bien con una SPA de
  varias vistas que comparten estado y lógica de datos. TypeScript aporta tipos
  para las respuestas de la API (`Book`, `BookDetail`, `ItemDeseo`,
  `ItemHistorial`) y reduce errores al mapear el JSON de Open Library.
- **react-router-dom v7** para el ruteo del lado del cliente.
- **OpenLayers (`ol`)** para el mapa de la página de contacto (tiles de
  OpenStreetMap).
- Sin librería de estado global ni de UI: el estado se resuelve con hooks
  propios y `useState`/`useEffect`; los estilos son **CSS plano** por componente
  más un set de variables globales (`src/styles/colors.css`,
  `typography.css`, `global.css`).

### APIs y datos

| Fuente | Uso en la app |
|--------|---------------|
| `openlibrary.org/search.json` | Búsqueda por título / autor / categoría y carruseles del Home por género. Paginación **del lado del servidor** (`page` + `limit`). |
| `openlibrary.org/works/{id}.json` + `/editions.json` | Detalle del libro: descripción, portada, año, editorial, páginas, idioma, categorías. |
| `openlibrary.org/authors/{id}.json` | Nombres de los autores del libro. |
| `covers.openlibrary.org` | Imágenes de portada (por *cover id*). |
| `api.mymemory.translated.net` | Traducción bajo demanda de título y descripción en el detalle. Con caché en `localStorage` para no repetir llamadas. |

La persistencia local (lista de deseos, historial y caché de traducciones) se
maneja con **`localStorage`**, aislada en `src/services/` para que los
componentes nunca lo toquen directamente.

### Requisitos funcionales ↔ implementación

| Requisito funcional | Dónde se resuelve |
|---------------------|-------------------|
| Buscar libros con filtros | `components/search/Search.tsx` + `hooks/useBookSearch.ts` |
| Listado paginado de resultados | `useBookSearch` (paginación por API) + `components/books/Pagination.tsx` + `usePagination.ts` |
| Explorar por categorías / géneros | `hooks/useHomeCategories.ts` + `constants/categories.ts` |
| Ver el detalle de un libro | `pages/BookDetail/` + `hooks/useBook.ts` |
| Traducir la ficha al español | `hooks/useTranslation.ts` + `services/translate.ts` |
| Lista de deseos (agregar, quitar, filtrar) | `pages/WishList/` + `components/wishes/` + `services/wishList.ts` |
| Historial de libros visitados | `pages/History/` + `services/history.ts` |
| Página de contacto con mapa | `pages/Contact/Contact.tsx` (OpenLayers) |
| Diseño responsive | `hooks/useBreakpoint.ts` + CSS por componente |
| Estados vacíos / carga / errores | `components/ui/` (`EmptyState`, `Loader`, `Toast`, `ConfirmAlert`) |

### Estructura de recursos

```
src/
├── assets/           Imágenes e iconos SVG (los .svg se importan como componentes vía vite-plugin-svgr)
├── components/        Componentes de presentación, agrupados por dominio
│   ├── books/         Tarjeta, lista, sección y paginación de libros
│   ├── history/       Encabezado del historial
│   ├── layout/        Navbar, PageHeader, Footer
│   ├── search/        Formulario de búsqueda y filtros
│   ├── ui/            Piezas reutilizables (Loader, Toast, EmptyState, ConfirmAlert)
│   └── wishes/        Tarjeta, formulario y filtros de la lista de deseos
├── constants/         Categorías del Home, configuración del formulario de deseos
├── data/              books.mock.ts (datos de ejemplo para desarrollo)
├── hooks/             Lógica reutilizable (fetch + estado): useBook, useBookSearch,
│                      useHome, useHomeCategories, usePagination, useBreakpoint, useTranslation
├── pages/             Una carpeta por vista: Home, BookDetail, WishList, History, Contact
├── routes/            paths.ts — rutas centralizadas
├── services/          Acceso a datos externos y a localStorage (Open Library, MyMemory, historial, deseos)
├── styles/            Variables globales de color y tipografía
└── types/             Tipos TypeScript compartidos
```

La separación es **presentación (`components` / `pages`) ↔ lógica de datos
(`hooks`) ↔ acceso externo (`services`)**: los componentes reciben datos ya
resueltos y no saben de dónde vienen.

### Notas sobre Open Library

La API de Open Library es pública y **sin key**, pero conviene tener en cuenta:

- Pide un límite de ~100 req/min y un `User-Agent` descriptivo; puede devolver
  **403** ante peticiones sin `User-Agent` (no aplica desde el navegador, que lo
  manda solo).
- Últimamente responde **lenta e intermitente** (timeouts en `works/{id}.json`).
  Si una búsqueda o un detalle "no carga", suele ser la API y no la app.
- El endpoint de portadas por *cover id* no tiene rate limit; por ISBN/OLID sí.

---

## Despliegue en GitHub Pages

Todavía no está configurado. Para publicarlo hacen falta 3 ajustes:

1. **Base del build** — en `vite.config.ts`:

   ```ts
   export default defineConfig({
     base: '/libros/',            // nombre del repo
     plugins: [react(), svgr()],
   })
   ```

2. **Ruteo** — GitHub Pages no hace fallback de SPA, así que las rutas directas
   (`/libros/historial`) dan 404 con `BrowserRouter`. La opción más simple es
   cambiar a `HashRouter` en `src/main.tsx`:

   ```tsx
   import { HashRouter } from 'react-router-dom'
   // ...
   <HashRouter>
     <App />
   </HashRouter>
   ```

3. **Publicar** — con el paquete `gh-pages`:

   ```bash
   npm i -D gh-pages
   # en package.json -> "scripts": { "deploy": "npm run build && gh-pages -d dist" }
   npm run deploy
   ```

   Luego, en *Settings → Pages* del repo, elegir el branch `gh-pages`. La URL
   queda en `https://alvaroramirezbrusco.github.io/libros/`.
