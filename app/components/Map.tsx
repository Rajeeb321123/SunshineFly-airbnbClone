'use client';

// FOR MAP
// used in : RentModal.tsx


import L from 'leaflet';
import { MapContainer, Marker, TileLayer } from 'react-leaflet'

import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

// by default it doesnot work so, we are merging the icons
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon.src,
    iconRetinaUrl: markerIcon2x.src,
    shadowUrl: markerShadow.src,
});

interface MapProps {
    center?: number[],
}

const Map:React.FC<MapProps> = ({
    center
}) => {
  return (

    // imp: we need to modify global.css for it to see in UI
    <MapContainer
        // [51,-0.09] is just default value. latng means lattitude, longitude
        center={center as L.LatLngExpression || [28.3949,84.1240] }
        zoom={center ? 4: 2 }
        scrollWheelZoom = {false}
        className='h-[35vh] rounded-lg mapContainer'
    >
      {/* for map to really show we need tilelayer. just copy from docs */}
      <TileLayer
      attribution='&copy; <a href="https://www.youtube.com/watch?v=pJpgjtEKjmk">John Cena</a> You cant see me'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />

    {/* for marker */}
    {center && (
      <Marker 
        position={center as L.LatLngExpression}
      />
    )}

    </MapContainer>
  )
}

export default Map