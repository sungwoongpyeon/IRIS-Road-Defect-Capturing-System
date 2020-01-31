import React, { useState } from 'react';
import { GoogleMap, withScriptjs, withGoogleMap, Marker, InfoWindow } from 'react-google-maps';
// import { makeStyles } from '@material-ui/core/styles';
import typeP from '../assets/typeP.png';
import typePN from '../assets/typePN.png';
import typePS from '../assets/typePS.png';
import typeSD from '../assets/typeSD.png';
import typeC from '../assets/typeC.png';
import typeD from '../assets/typeD.png';
import typeB from '../assets/typeB.png';
import typeRD from '../assets/typeRD.png';
import typeA from '../assets/typeA.png';
// const useStyles = makeStyles(theme => ({
// }));

function Map({ mapData, selectedDataFromTable, resetSelectedData }) {
    // const classes = useStyles();
    const [selectedData, setSelectedData] = useState(null);

    const TypeConvert = (props) => {
        switch (props.typeData.type) {
            case 'P':
                return '(P)Pothole paved surface';
            case 'PN':
                return '(PN)Pothole non-paved';
            case 'PS':
                return '(PS)Pothole shoulder';
            case 'SD':
                return '(SD)Shoulder Drop-off';
            case 'C':
                return '(C)Crack';
            case 'D':
                return '(D)Debris';
            case 'B':
                return '(B)Bridge Deck Spall';
            case 'RD':
                return '(RD)Road Discontinuity';
            case 'A':
                return 'Inspection Image Data';
            default:
                return 'No Type Selected';
        }
    }

    const typeMarkerIcon = (type) => {
        switch (type) {
            case 'P':
                return typeP;
            case 'PN':
                return typePN;
            case 'PS':
                return typePS;
            case 'SD':
                return typeSD;
            case 'C':
                return typeC;
            case 'D':
                return typeD;
            case 'B':
                return typeB;
            case 'RD':
                return typeRD;
            case 'A':
                return typeA;

            default:
                return typeP;
        }
    }

    return (
        <GoogleMap
            defaultZoom={13}
            defaultCenter={{ lat: 43.260132499119614, lng: -79.8736735129026 }}
        >
            {/* display all defect data as a marker in the map */}
            {mapData.map(park => (
                <Marker
                    key={park.id}
                    position={{
                        lat: parseFloat(park.latitude),
                        lng: parseFloat(park.longitude)
                    }}
                    onClick={() => {
                        setSelectedData(park);
                    }}
                    icon={{
                        url: typeMarkerIcon(park.type),
                        scaledSize: new window.google.maps.Size(35, 35)
                    }}
                />
            ))}

            {selectedDataFromTable && (
                <InfoWindow
                    position={{
                        lat: parseFloat(selectedDataFromTable.latitude),
                        lng: parseFloat(selectedDataFromTable.longitude)
                    }}
                    onCloseClick={resetSelectedData}
                >
                    <div>
                        <h1><TypeConvert typeData={selectedDataFromTable} /></h1>
                        <p>Driver: {selectedDataFromTable.driver}</p>
                        <p>Plate#: {selectedDataFromTable.plate}</p>
                        <p>Address: {selectedDataFromTable.address}</p>
                        <p>Time: {selectedDataFromTable.timeText}</p>
                        <p>Desc: {selectedDataFromTable.description}</p>
                    </div>
                </InfoWindow>
            )}
            {selectedData && (
                <InfoWindow
                    position={{
                        lat: parseFloat(selectedData.latitude),
                        lng: parseFloat(selectedData.longitude)
                    }}
                    onCloseClick={() => {
                        setSelectedData(null);
                    }}
                >
                    {
                        (selectedData.type) ? <div><h1><TypeConvert typeData={selectedData} /></h1>
                            <p>{selectedData.driver}</p>
                            <p>{selectedData.plate}</p>
                            <p>{selectedData.address}</p>
                            <p>{selectedData.timeText}</p>
                            <p>{selectedData.description}</p></div> : <div><h2>No data</h2></div>
                    }
                </InfoWindow>
            )}


        </GoogleMap>
    );
}

const WrappedMap = withScriptjs(withGoogleMap(Map));

function MyMap({ mapData, selectedDataFromTable }) {
    return (
        <div style={{ width: "100%", height: "410px" }}>
            <WrappedMap
                mapData={mapData}
                selectedDataFromTable={selectedDataFromTable}
                googleMapURL='https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyBS207NXTzUagzT1N6ME6iauSwwGN-Xu-8'
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `100%` }} />}
                mapElement={<div style={{ height: `100%` }} />}
            />
        </div>
    );
}

export default MyMap;
