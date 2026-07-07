import { useEffect, useState } from "react";
import axios from "axios";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
    useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function ChangeMapView({ center }) {
    const map = useMap();

    useEffect(() => {
        map.setView(center, 16);
    }, [center]);

    return null;
}

function LocationPicker({ position, setPosition, onChange }) {
    useMapEvents({
        async click(e) {
            const lat = e.latlng.lat;
            const lng = e.latlng.lng;

            setPosition([lat, lng]);

            try {
                const res = await axios.get(
                    "https://nominatim.openstreetmap.org/reverse",
                    {
                        params: {
                            format: "json",
                            lat,
                            lon: lng,
                        },
                    }
                );

                onChange({
                    address: res.data.display_name,
                    latitude: lat,
                    longitude: lng,
                });
            } catch (err) {
                console.log(err);
            }
        },
    });

    return (
        <Marker
            position={position}
            draggable
            eventHandlers={{
                async dragend(e) {
                    const marker = e.target;
                    const latlng = marker.getLatLng();

                    setPosition([latlng.lat, latlng.lng]);

                    try {
                        const res = await axios.get(
                            "https://nominatim.openstreetmap.org/reverse",
                            {
                                params: {
                                    format: "json",
                                    lat: latlng.lat,
                                    lon: latlng.lng,
                                },
                            }
                        );

                        onChange({
                            address: res.data.display_name,
                            latitude: latlng.lat,
                            longitude: latlng.lng,
                        });
                    } catch (err) {
                        console.log(err);
                    }
                },
            }}
        >
            <Popup>Supplier Location</Popup>
        </Marker>
    );
}

export default function SupplierMap({
    latitude,
    longitude,
    onChange,
}) {
    const defaultPosition = [8.5323137, 124.570573];

    const [position, setPosition] = useState(
        latitude && longitude
            ? [parseFloat(latitude), parseFloat(longitude)]
            : defaultPosition
    );

    const [search, setSearch] = useState("");

    useEffect(() => {
        if (latitude && longitude) {
            setPosition([
                parseFloat(latitude),
                parseFloat(longitude),
            ]);
        }
    }, [latitude, longitude]);

    const searchLocation = async () => {
        if (!search.trim()) return;

        try {
            const res = await axios.get(
                "https://nominatim.openstreetmap.org/search",
                {
                    params: {
                        q: search,
                        format: "json",
                        limit: 5,
                    },
                }
            );

            console.log(res.data);

            if (res.data.length === 0) {
                alert("Location not found.");
                return;
            }

            const place = res.data[0];

            const lat = parseFloat(place.lat);
            const lng = parseFloat(place.lon);

            setPosition([lat, lng]);

            onChange({
                address: place.display_name,
                latitude: lat,
                longitude: lng,
            });

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="rounded-xl border shadow-sm bg-white">

            {/* Search Bar */}
            <div className="flex gap-2 p-3 border-b bg-white">
                <input
                    type="text"
                    placeholder="Search address..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full h-11 px-3 text-base border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                />

                <button
                    type="button"
                    onClick={searchLocation}
                    className="bg-orange-500 text-dark px-4 rounded-lg hover:bg-orange-600"
                >
                    Search
                </button>
            </div>

            <MapContainer
                center={position}
                zoom={15}
                style={{
                    width: "100%",
                    height: "350px",
                }}
            >
                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <ChangeMapView center={position} />

                <LocationPicker
                    position={position}
                    setPosition={setPosition}
                    onChange={onChange}
                />
            </MapContainer>

            <div className="bg-dark-50 border-t px-4 py-3">
                <p className="text-sm text-dark-600">
                    📍 Search an address, click anywhere on the map, or drag the marker.
                </p>
            </div>

        </div>
    );
}
