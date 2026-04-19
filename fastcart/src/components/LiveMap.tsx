"use client";

import React from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

interface ILocation {
  latitude: number;
  longitude: number;
}

interface IProps {
  userLocation?: ILocation | null;
  deliveryBoyLocation: ILocation;
  fullScreen?: boolean;
}

const LiveMap = ({ userLocation, deliveryBoyLocation, fullScreen }: IProps) => {
  if (!deliveryBoyLocation?.latitude) {
    return <p className="text-center">Loading map...</p>;
  }

  const deliveryBoyIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/9561/9561688.png",
    iconSize: [45, 45],
  });

  const userIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/2163/2163350.png",
    iconSize: [45, 45],
  });

  const center: LatLngExpression = [
    deliveryBoyLocation.latitude,
    deliveryBoyLocation.longitude,
  ];

  const hasDest = userLocation && userLocation.latitude !== 0;

  let linePosition: LatLngExpression[] = [];
  if (hasDest) {
    linePosition = [
      [userLocation.latitude, userLocation.longitude],
      [deliveryBoyLocation.latitude, deliveryBoyLocation.longitude],
    ];
  }

  const containerClasses = fullScreen 
    ? "w-full h-full absolute inset-0 z-0" 
    : "w-full h-[500px] rounded-xl overflow-hidden shadow relative";

  return (
    <div className={containerClasses}>
      <MapContainer center={center} zoom={hasDest ? 14 : 16} style={{ height: "100%", width: "100%", zIndex: 1 }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker position={center} icon={deliveryBoyIcon}>
          <Popup>You</Popup>
        </Marker>

        {hasDest && (
          <>
            <Marker
              position={[userLocation.latitude, userLocation.longitude]}
              icon={userIcon}
            >
              <Popup>Delivery Address</Popup>
            </Marker>
            <Polyline positions={linePosition} color="#10b981" weight={4} opacity={0.8} />
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default LiveMap;
