import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapView.css';

const glowIcon = L.divIcon({
  className: 'glow-marker',
  html: `<div class="glow-marker-core"><div class="glow-marker-ring"></div></div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 13],
});

// Renders a live marker + accuracy circle + trail polyline for one session.
// Animates position smoothly rather than snapping the marker on each update.
export default function MapView({ location, trail = [] }) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const markerRef = useRef(null);
  const circleRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) return;
    mapRef.current = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView([20.5937, 78.9629], 4);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(mapRef.current);

    L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current);
  }, []);

  useEffect(() => {
    if (!mapRef.current || !location) return;
    const latlng = [location.lat, location.lng];
    const map = mapRef.current;

    if (!markerRef.current) {
      markerRef.current = L.marker(latlng, { icon: glowIcon }).addTo(map);
      circleRef.current = L.circle(latlng, {
        radius: location.accuracy || 20,
        color: '#00E5FF',
        weight: 1,
        fillColor: '#00E5FF',
        fillOpacity: 0.08,
      }).addTo(map);
      lineRef.current = L.polyline([], { color: '#38BDF8', weight: 3, opacity: 0.6 }).addTo(map);
      map.setView(latlng, 15);
    } else {
      markerRef.current.setLatLng(latlng);
      circleRef.current.setLatLng(latlng).setRadius(location.accuracy || 20);
      map.panTo(latlng, { animate: true, duration: 0.6 });
    }
  }, [location]);

  useEffect(() => {
    if (!lineRef.current || !trail.length) return;
    lineRef.current.setLatLngs(trail.map((p) => [p.lat, p.lng]));
  }, [trail]);

  return <div ref={containerRef} className="map-view" />;
}
