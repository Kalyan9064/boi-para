import {
  MapContainer,
  TileLayer,
  Marker
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function BookLocationMap({
  latitude,
  longitude
}) {

  const openGoogleMaps = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
      "_blank"
    );
  };

  return (
    <div
      onClick={openGoogleMaps}
      style={{
        cursor: "pointer"
      }}
    >
      <MapContainer
        center={[latitude, longitude]}
        zoom={14}
        dragging={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        zoomControl={false}
        style={{
          height: "250px",
          width: "100%",
          borderRadius: "16px"
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker
          position={[latitude, longitude]}
        />
      </MapContainer>
    </div>
  );
}

export default BookLocationMap;