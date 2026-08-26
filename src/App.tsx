import { useState } from "react";
import "./App.css";

interface Book {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  edition_count?: number;
}

interface SearchResponse {
  numFound: number;
  docs: Book[];
}

interface BookDetail {
  title?: string;

  description?: string | {
    type: string;
    value: string;
  };

  subjects?: string[];

  covers?: number[];

  first_publish_date?: string;

  authors?: {
    author: {
      key: string;
    };
  }[];
}

function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] =
    useState<BookDetail | null>(null);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  const [error, setError] = useState("");

  // --------------------------------
  // Buscar libros
  // --------------------------------

  const searchBooks = async (): Promise<void> => {
    if (!search.trim()) {
      return;
    }

    setLoading(true);
    setError("");
    setSelectedBook(null);

    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(
          search
        )}&limit=12`
      );

      if (!response.ok) {
        throw new Error(
          `Error HTTP: ${response.status}`
        );
      }

      const data: SearchResponse =
        await response.json();

      console.log("Resultado de búsqueda:");
      console.log(data);

      setBooks(data.docs);
    } catch (error) {
      console.error(error);

      setError(
        "No se pudieron obtener los libros."
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------
  // Obtener detalle de un libro
  // --------------------------------

  const getBookDetail = async (
    key: string
  ): Promise<void> => {
    setDetailLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://openlibrary.org${key}.json`
      );

      if (!response.ok) {
        throw new Error(
          `Error HTTP: ${response.status}`
        );
      }

      const data: BookDetail =
        await response.json();

      console.log("Detalle del libro:");
      console.log(data);

      setSelectedBook(data);
    } catch (error) {
      console.error(error);

      setError(
        "No se pudo obtener la información del libro."
      );
    } finally {
      setDetailLoading(false);
    }
  };

  // --------------------------------
  // Volver a resultados
  // --------------------------------

  const backToResults = (): void => {
    setSelectedBook(null);
    setError("");
  };

  return (
    <main className="container">

      <h1>📚 Open Library</h1>

      {/* BUSCADOR */}

      <div className="search">

        <input
          type="text"
          placeholder="Buscar un libro..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              searchBooks();
            }
          }}
        />

        <button onClick={searchBooks}>
          Buscar
        </button>

      </div>

      {/* ERROR */}

      {error && (
        <p className="error">
          {error}
        </p>
      )}

      {/* LOADING DE BÚSQUEDA */}

      {loading && (
        <p className="message">
          Buscando libros...
        </p>
      )}

      {/* -------------------------------- */}
      {/* DETALLE DEL LIBRO */}
      {/* -------------------------------- */}

      {selectedBook ? (

        <section className="detail">

          <button
            className="back-button"
            onClick={backToResults}
          >
            ← Volver a los resultados
          </button>

          <div className="detail-content">

            {/* PORTADA */}

            <div className="detail-cover">

              {selectedBook.covers?.[0] ? (

                <img
                  src={`https://covers.openlibrary.org/b/id/${selectedBook.covers[0]}-L.jpg`}
                  alt={
                    selectedBook.title ||
                    "Portada del libro"
                  }
                />

              ) : (

                <div className="no-image large">
                  Sin portada
                </div>

              )}

            </div>

            {/* INFORMACIÓN */}

            <div className="detail-info">

              <h2>
                {selectedBook.title ||
                  "Título desconocido"}
              </h2>

              {/* DESCRIPCIÓN */}

              <h3>
                Descripción
              </h3>

              <p>

                {typeof selectedBook.description ===
                "string"

                  ? selectedBook.description

                  : selectedBook.description?.value ||

                    "No hay descripción disponible."

                }

              </p>

              {/* FECHA */}

              <h3>
                Primera publicación
              </h3>

              <p>

                {selectedBook.first_publish_date ||
                  "No disponible"}

              </p>

              {/* SUBJECTS */}

              <h3>
                Subjects
              </h3>

              {selectedBook.subjects &&
              selectedBook.subjects.length > 0 ? (

                <div className="subjects">

                  {selectedBook.subjects
                    .slice(0, 30)
                    .map((subject) => (

                      <span
                        key={subject}
                      >
                        {subject}
                      </span>

                    ))}

                </div>

              ) : (

                <p>
                  No hay subjects disponibles.
                </p>

              )}

            </div>

          </div>

        </section>

      ) : (

        /* -------------------------------- */
        /* RESULTADOS */
        /* -------------------------------- */

        <section className="books">

          {books.length === 0 &&
            !loading && (
              <p className="message">
                Buscá un libro para comenzar.
              </p>
            )}

          {books.map((book) => (

            <article
              className="book"
              key={book.key}
              onClick={() =>
                getBookDetail(book.key)
              }
            >

              {/* PORTADA */}

              {book.cover_i ? (

                <img
                  src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                  alt={book.title}
                />

              ) : (

                <div className="no-image">
                  Sin portada
                </div>

              )}

              {/* INFORMACIÓN */}

              <div className="book-info">

                <h2>
                  {book.title}
                </h2>

                <p>

                  <strong>
                    Autor:
                  </strong>{" "}

                  {book.author_name?.join(
                    ", "
                  ) || "Desconocido"}

                </p>

                <p>

                  <strong>
                    Año:
                  </strong>{" "}

                  {book.first_publish_year ||
                    "Desconocido"}

                </p>

                {book.edition_count && (

                  <p>

                    <strong>
                      Ediciones:
                    </strong>{" "}

                    {book.edition_count}

                  </p>

                )}

                <span className="click-text">
                  Ver información →
                </span>

              </div>

            </article>

          ))}

        </section>

      )}

      {/* LOADING DEL DETALLE */}

      {detailLoading && (

        <div className="loading-detail">

          <p>
            Cargando información del libro...
          </p>

        </div>

      )}

    </main>
  );
}

export default App;