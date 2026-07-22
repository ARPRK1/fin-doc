"use client";
/**
 * Interactive Leaflet map (OpenStreetMap tiles — no API key needed).
 * Import with next/dynamic ({ ssr: false }) — Leaflet needs `window`.
 */
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  label: string;
  sub?: string;
  href?: string;
  featured?: boolean;
}

export default function MapView({ markers, center, zoom = 12 }: { markers: MapMarker[]; center: { lat: number; lng: number }; zoom?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!ref.current || mapRef.current) return;
    const map = L.map(ref.current, { scrollWheelZoom: false }).setView([center.lat, center.lng], zoom);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);
    mapRef.current = map;
    layerRef.current = L.layerGroup().addTo(map);
    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;
    map.setView([center.lat, center.lng], zoom);
    layer.clearLayers();

    for (const m of markers) {
      // Teal pin for standard, amber for Featured (paid) — matching UI labels.
      const color = m.featured ? "#d97706" : "#0d9488";
      const icon = L.divIcon({
        className: "",
        html: `<div style="width:26px;height:26px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${color};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 26],
      });
      const marker = L.marker([m.lat, m.lng], { icon }).addTo(layer);
      const featuredTag = m.featured
        ? '<span style="background:#fef3c7;color:#92400e;font-size:10px;padding:1px 6px;border-radius:99px;font-weight:600">★ Featured</span> '
        : "";
      marker.bindPopup(
        `<div style="font-family:Inter,sans-serif;min-width:150px">
          ${featuredTag}<strong>${m.label}</strong>
          ${m.sub ? `<br/><span style="color:#64748b;font-size:12px">${m.sub}</span>` : ""}
          ${m.href ? `<br/><a href="${m.href}" style="color:#0d9488;font-weight:600;font-size:12px">View profile →</a>` : ""}
        </div>`
      );
    }
  }, [markers, center.lat, center.lng, zoom]);

  return <div ref={ref} className="h-full w-full" role="application" aria-label="Map of providers" />;
}
