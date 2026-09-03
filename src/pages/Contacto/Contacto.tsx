import { useEffect, useRef } from 'react'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import OSM from 'ol/source/OSM'
import VectorSource from 'ol/source/Vector'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
//import Overlay from 'ol/Overlay'
import { Icon, Style } from 'ol/style'
import { fromLonLat } from 'ol/proj'
import { defaults as controlesPorDefecto } from 'ol/control/defaults'
import Attribution from 'ol/control/Attribution'

import PageHeader from '../../components/layout/PageHeader'
import './Contacto.css'

// No se importa 'ol/ol.css': el mapa se dibuja en un <canvas> y los pocos
// estilos que necesitan los controles están escritos a mano en Contacto.css.

// Coordenadas de la Catedral de La Plata
const LON = -57.9536
const LAT = -34.9215

// Pin genérico de mapa (SVG en data URI, sin depender de assets externos)
const PIN_SVG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42">' +
      '<path d="M16 0C7.7 0 1 6.7 1 15c0 10.5 15 27 15 27s15-16.5 15-27C31 6.7 24.3 0 16 0z" fill="#1677C8" stroke="#3B9AE8" stroke-width="1"/>' +
      '<circle cx="16" cy="15" r="6" fill="#fff"/>' +
    '</svg>',
  )

export default function Contacto() {
  const mapaRef = useRef<HTMLDivElement>(null)
  const cartelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapaRef.current || !cartelRef.current) return

    const centro = fromLonLat([LON, LAT])

    // Marcador con un pin genérico de mapa
    const marcador = new Feature(new Point(centro))
    marcador.setStyle(
      new Style({
        image: new Icon({ src: PIN_SVG, width: 32, height: 42, anchor: [0.5, 1] }),
      }),
    )

    // Cartel fijo apoyado sobre el marcador
   /* const cartel = new Overlay({
      element: cartelRef.current,
      positioning: 'bottom-center',
      offset: [0, -44],
      stopEvent: false,
    })*/

    const mapa = new Map({
      target: mapaRef.current,
      controls: controlesPorDefecto({ attribution: false }).extend([
        new Attribution({ collapsible: false }),
      ]),
      layers: [
        // Tiles de OpenStreetMap
        new TileLayer({ source: new OSM() }),
        new VectorLayer({ source: new VectorSource({ features: [marcador] }) }),
      ],
     // overlays: [cartel],
      view: new View({ center: centro, zoom: 16 }),
    })

   // cartel.setPosition(centro)
    cartelRef.current.hidden = false

    return () => mapa.setTarget(undefined)
  }, [])

  return (
    <section className="page page-contacto">
      <PageHeader titulo="Contacto" volver={true} />

      <div className="contacto-content">

        {/* Datos de desarrollador */}
        <div className="contacto__datos">
          <h2>BookWeb</h2>
          <p> Aplicaciones Móviles</p>

          <ul className="contacto__lista">
            <li>
              <a href="mailto:alvaroramirezbrusco@gmail.com">
                <strong>Email:</strong> alvaroramirezbrusco@gmail.com
              </a>
            </li>
            <li>
              <a href="mailto:penayobernardita@gmail.com">
                <strong>Email:</strong> penayobernardita@gmail.com
              </a>
            </li>
            <li>
              <a href="tel:+54911123456">
                <strong>Teléfono:</strong> +54 911 123-456
              </a>
            </li>
            <li>
              <a
                href="https://maps.google.com/?q=Calle 14 e/ 51 y 53, La Plata, Buenos Aires"
                target="_blank"
                rel="noopener noreferrer"
              >
                <strong>Dirección:</strong> Calle 14 e/ 51 y 53, La Plata,
                Buenos Aires
              </a>
            </li>
          </ul>
        </div>

        {/* Ubicación de la oficina (OpenLayers + tiles de OpenStreetMap) */}
        <h2 className="contacto__titulo-mapa">Dónde estamos</h2>
        <div
          ref={mapaRef}
          className="contacto__mapa"
          aria-label="Mapa de la ubicación de la oficina"
        >
        {/*}  <div ref={cartelRef} className="contacto__cartel" hidden>
            Catedral de La Plata — nuestra oficina
          </div>*/}
        </div>

      </div>
    </section>
  )
}
