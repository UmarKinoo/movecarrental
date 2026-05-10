'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import type { Location } from '@/lib/types/bookcars'
import { bookCarsConfig } from '@/lib/api/config'

import 'leaflet/dist/leaflet.css'

type LocationsMapProps = {
  locations: Location[]
  heightClassName?: string
  showSearchLinks?: boolean
}

function buildSearchHref(locationId: string) {
  const params = new URLSearchParams()
  params.set('pickupLocation', locationId)
  params.set('dropOffLocation', locationId)
  const from = new Date()
  from.setDate(from.getDate() + 3)
  from.setHours(10, 0, 0, 0)
  const to = new Date(from)
  to.setDate(to.getDate() + 3)
  const toLocal = (d: Date) => {
    const offset = d.getTimezoneOffset()
    const local = new Date(d.getTime() - offset * 60 * 1000)
    return local.toISOString().slice(0, 16)
  }
  params.set('from', toLocal(from))
  params.set('to', toLocal(to))
  return `/cars?${params.toString()}`
}

export function LocationsMap({
  locations,
  heightClassName = 'h-[min(70vh,560px)]',
  showSearchLinks = true,
}: LocationsMapProps) {
  useEffect(() => {
    const icon = new L.Icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    })
    L.Marker.prototype.options.icon = icon
  }, [])

  const withCoords = locations.filter((l) => typeof l.latitude === 'number' && typeof l.longitude === 'number')
  const center = withCoords[0]
    ? [withCoords[0].latitude!, withCoords[0].longitude!] as [number, number]
    : [bookCarsConfig.mapLatitude, bookCarsConfig.mapLongitude] as [number, number]

  return (
    <div className={`${heightClassName} w-full overflow-hidden rounded-lg border border-neutral-200`}>
      <MapContainer
        center={center}
        zoom={withCoords.length === 1 ? Math.max(bookCarsConfig.mapZoom, 11) : bookCarsConfig.mapZoom}
        className="h-full w-full"
        scrollWheelZoom
      >
        <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {withCoords.map((location) => (
          <Marker key={location._id} position={[location.latitude!, location.longitude!]}>
            <Popup>
              <span className="font-medium">{location.name}</span>
              {showSearchLinks ? (
                <div className="mt-2">
                  <Link href={buildSearchHref(location._id)} className="text-sm font-semibold text-brand-700">
                    Search cars here
                  </Link>
                </div>
              ) : null}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
