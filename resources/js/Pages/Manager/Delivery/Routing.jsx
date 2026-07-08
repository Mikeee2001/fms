import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

export default function Routing({ supplier, shop }) {
    const map = useMap();

    useEffect(() => {
        if (
            !supplier ||
            !shop ||
            !supplier.latitude ||
            !supplier.longitude ||
            !shop.latitude ||
            !shop.longitude
        ) {
            return;
        }

        const routingControl = L.Routing.control({
            waypoints: [
                L.latLng(
                    Number(supplier.latitude),
                    Number(supplier.longitude)
                ),
                L.latLng(
                    Number(shop.latitude),
                    Number(shop.longitude)
                ),
            ],

            routeWhileDragging: false,
            addWaypoints: false,
            draggableWaypoints: false,
            fitSelectedRoutes: true,
            show: false,

            lineOptions: {
                styles: [
                    {
                        color: "#f59e0b",
                        weight: 6,
                        opacity: 0.9,
                    },
                ],
            },

            createMarker: () => null,
        }).addTo(map);

        return () => {
            map.removeControl(routingControl);
        };
    }, [map, supplier, shop]);

    return null;
}
