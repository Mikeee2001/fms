import { useEffect, useMemo, useState } from "react";

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Polyline,
    useMap,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";


// -----------------------------
// Leaflet Default Icon Fix
// -----------------------------

delete L.Icon.Default.prototype._getIconUrl;


L.Icon.Default.mergeOptions({

    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

});



// -----------------------------
// Marker Icons
// -----------------------------

const supplierIcon = new L.Icon({

    iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",

    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

    iconSize: [25, 41],

    iconAnchor: [12, 41],

});



const shopIcon = new L.Icon({

    iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",

    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

    iconSize: [25, 41],

    iconAnchor: [12, 41],

});




// -----------------------------
// Rotating Truck
// -----------------------------

function truckIcon(rotation = 0) {

    return new L.DivIcon({

        className: "",

        html: `

        <div style="
            font-size:35px;
            transform:rotate(${rotation}deg);
            transition:0.5s;
        ">
            🚚
        </div>

        `,

        iconSize: [40, 40],

        iconAnchor: [20, 20]

    });

}



// -----------------------------
// Auto Zoom
// -----------------------------

function FitBounds({ route }) {


    const map = useMap();


    useEffect(() => {


        if (!route.length)
            return;


        map.fitBounds(
            L.latLngBounds(route),
            {
                padding: [60, 60]
            }
        );


    }, [
        route,
        map
    ]);



    return null;

}




export default function DeliveryMap({

    supplier,

    shop,

    status = "approved"

}) {


    const [route, setRoute] = useState([]);

    const [distance, setDistance] = useState(null);

    const [duration, setDuration] = useState(null);

    const [truckPosition, setTruckPosition] = useState(null);

    const [rotation, setRotation] = useState(0);




    const supplierPos = useMemo(() => {


        return [

            Number(supplier?.latitude),

            Number(supplier?.longitude)

        ];


    }, [supplier]);





    const shopPos = useMemo(() => {


        return [

            Number(shop?.latitude),

            Number(shop?.longitude)

        ];


    }, [shop]);






    useEffect(() => {


        async function getRoute() {


            if (
                !supplier ||
                !shop
            )
                return;



            const url =
                `https://router.project-osrm.org/route/v1/driving/${supplier.longitude},${supplier.latitude};${shop.longitude},${shop.latitude}?overview=full&geometries=geojson`;



            try {


                const response =
                    await fetch(url);



                const data =
                    await response.json();




                if (!data.routes?.length)
                    return;





                const points =
                    data.routes[0]
                        .geometry
                        .coordinates
                        .map(
                            ([lng, lat]) => [
                                lat,
                                lng
                            ]
                        );



                setRoute(points);



                setDistance(
                    data.routes[0].distance
                );



                setDuration(
                    data.routes[0].duration
                );





                let progress = 0;



                switch (status) {


                    case "shipped":

                        progress = 50;

                        break;


                    case "partially_received":

                        progress = 80;

                        break;


                    case "received":

                        progress = 100;

                        break;



                    default:

                        progress = 0;

                }




                let index = 0;


                // SHIPPED = halfway
                if (status === "shipped") {
                    index = Math.floor(
                        0.5 * (points.length - 1)
                    );
                }


                // PARTIAL RECEIVE = near destination
                else if (status === "partially_received") {
                    index = Math.floor(
                        0.8 * (points.length - 1)
                    );
                }


                // RECEIVED = shop location
                else if (status === "received") {
                    index = points.length - 1;
                }


                setTruckPosition(
                    points[index]
                );





                if (
                    status === "received"
                ) {

                    // Truck already arrived at shop
                    setRotation(0);

                }
                else if (
                    index < points.length - 1
                ) {

                    const current = points[index];

                    const next = points[index + 1];


                    const angle =
                        Math.atan2(
                            next[1] - current[1],
                            next[0] - current[0]
                        )
                        *
                        180
                        /
                        Math.PI;


                    setRotation(angle);

                }



            }
            catch (error) {

                console.log(error);

            }


        }



        getRoute();


    }, [
        supplier,
        shop,
        status
    ]);





    const progress =

        status === "received"
            ? 100

            :

            status === "partially_received"
                ? 80

                :

                status === "shipped"
                    ? 50

                    :

                    0;






    if (
        !supplier ||
        !shop
    ) {

        return (

            <div className="
            h-[650px]
            flex
            items-center
            justify-center
            bg-stone-900
            text-white
            rounded-xl
            ">

                Location unavailable

            </div>

        );

    }






    return (

        <div className="space-y-5">


            {/* INFO */}

            <div className="grid grid-cols-3 gap-4">

                <div className="bg-stone-800 p-5 rounded-xl">


                    <p className="text-stone-300">
                        Status
                    </p>


                    <h2 className="text-amber-400 text-2xl font-bold capitalize">

                        {status?.replace("_", " ")}

                    </h2>


                </div>


            </div>





            {/* PROGRESS */}

            <div className="bg-stone-800 p-5 rounded-xl">


                <div className="flex justify-between text-white">

                    <span>
                        Delivery Progress
                    </span>


                    <span className="text-amber-400">

                        {progress}%

                    </span>


                </div>



                <div className="h-4 bg-stone-700 rounded-full mt-3 overflow-hidden">


                    <div

                        className="h-full bg-amber-500 transition-all"

                        style={{
                            width: `${progress}%`
                        }}

                    />


                </div>


            </div>





            {/* MAP */}

            <MapContainer

                center={supplierPos}

                zoom={12}

                style={{
                    height: "650px",
                    width: "100%"
                }}

            >


                <TileLayer

                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

                />


                <FitBounds route={route} />





                <Marker

                    position={supplierPos}

                    icon={supplierIcon}

                >

                    <Popup>

                        <b>
                            {supplier.company_name}
                        </b>

                        <br />

                        {supplier.address}

                    </Popup>


                </Marker>





                <Marker

                    position={shopPos}

                    icon={shopIcon}

                >

                    <Popup>

                        <b>
                            {shop.name}
                        </b>

                        <br />

                        {shop.address}

                    </Popup>

                </Marker>





                {
                    truckPosition &&

                    <Marker

                        position={truckPosition}

                        icon={
                            truckIcon(rotation)
                        }

                    >


                        <Popup>

                            🚚 Delivery Truck

                            <br />

                            Status:

                            {" "}

                            <h2 className="text-amber-400 text-2xl font-bold capitalize">

                                {status?.replace("_", " ")}

                            </h2>


                        </Popup>


                    </Marker>

                }





                {
                    route.length > 0 &&

                    <Polyline

                        positions={route}

                        pathOptions={{

                            color: "#f59e0b",

                            weight: 6

                        }}

                    />

                }



            </MapContainer>



        </div>

    );

}
