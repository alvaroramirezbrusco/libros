import { useEffect, useRef } from 'react'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import OSM from 'ol/source/OSM'
import VectorSource from 'ol/source/Vector'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { Icon, Style } from 'ol/style'
import { fromLonLat } from 'ol/proj'
import { defaults as defaultControls } from 'ol/control/defaults'
import Attribution from 'ol/control/Attribution'

import PageHeader from '../../components/layout/PageHeader'
import './Contact.css'

const LON = -57.9536
const LAT = -34.9215


const PIN_SVG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42">' +
      '<path d="M16 0C7.7 0 1 6.7 1 15c0 10.5 15 27 15 27s15-16.5 15-27C31 6.7 24.3 0 16 0z" fill="#1677C8" stroke="#3B9AE8" stroke-width="1"/>' +
      '<circle cx="16" cy="15" r="6" fill="#fff"/>' +
    '</svg>',
  )

export default function Contact() {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapRef.current) return

    const center = fromLonLat([LON, LAT])

    const marker = new Feature(new Point(center))
    marker.setStyle(
      new Style({
        image: new Icon({ src: PIN_SVG, width: 32, height: 42, anchor: [0.5, 1] }),
      }),
    )

    const map = new Map({
      target: mapRef.current,
      controls: defaultControls({ attribution: false }).extend([
        new Attribution({ collapsible: false }),
      ]),
      layers: [
        new TileLayer({ source: new OSM() }),
        new VectorLayer({ source: new VectorSource({ features: [marker] }) }),
      ],
      view: new View({ center, zoom: 16 }),
    })

    return () => map.setTarget(undefined)
  }, [])

  return (
    <section className="page page-contact">
      <PageHeader title="Contacto" showBack={true} />

      <div className="contact-content page-content">

        <div className="contact__details">
          <h2>BookWeb</h2>
          <p> Aplicaciones Móviles</p>

          <ul className="contact__list">
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

        <div className="contact__map-section">
          <h2 className="contact__map-title">Dónde estamos</h2>
        <div
          ref={mapRef}
          className="contact__map"
          aria-label="Mapa de la ubicación de la oficina"
          />
        </div>

      </div>
    </section>
  )
}
