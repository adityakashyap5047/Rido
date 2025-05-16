import { View, Text } from 'react-native'
import React, { FC, memo, useEffect, useRef, useState } from 'react'
import MapView from 'react-native-maps';
import { customMapStyle, indiaIntialRegion } from '@/utils/CustomMap';
import MapViewDirections from 'react-native-maps-directions';
import { Colors } from '@/utils/Constants';

const apikey = process.env.EXPO_PUBLIC_MAP_API_KEY || ""

const LiveTrackingMap: FC<{
    height: number;
    drop: any;
    pickup: any;
    rider: any;
    status: string;
}> = ({ height, drop, pickup, rider, status }) => {

    const mapRef = useRef<MapView>(null);
    const [isUserInteracting, setIsUserInteracting] = useState(false);

    const fitToMarkers = async () => {
        if(isUserInteracting) return;

        const coordinates = []

        if(pickup?.latitude && pickup?.longitude && status == "START"){
            coordinates.push({
                latitude: pickup?.latitude,
                longitude: pickup?.longitude
            })
        }

        if(drop?.latitude && drop?.longitude && status == "ARRIVED"){
            coordinates.push({
                latitude: drop?.latitude,
                longitude: drop?.longitude
            })
        }

        if(rider?.latitude && rider?.longitude){
            coordinates.push({
                latitude: rider?.latitude,
                longitude: rider?.longitude
            })
        }

        if(coordinates.length > 0) return;

        try{
            mapRef.current?.fitToCoordinates(coordinates, {
                edgePadding: {
                    top: 50,
                    right: 50,
                    bottom: 50,
                    left: 50
                },
                animated: true
            })
        } catch (error){
            console.error("Error fitting to coordinates: ", error)
        }
    }

    const calculateInitialRegion = () => {
        if(pickup?.latitude && drop?.latitude){
            const latitude = (pickup?.latitude + drop?.latitude) / 2;
            const longitude = (pickup?.longitude + drop?.longitude) / 2;
            return {
                latitude,
                longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            }
        }

        return indiaIntialRegion;
    }

    useEffect(() => {
        if(pickup?.latitude && drop?.latitude) fitToMarkers();
    }, [pickup?.latitude, drop?.latitude, rider?.latitude])

  return (
    <View style={{height: height, width: "100%"}}>
        <MapView
            ref={mapRef}
            followsUserLocation
            style={{flex: 1}}
            initialRegion={calculateInitialRegion()}
            provider='google'
            showsMyLocationButton={false}
            showsCompass={false}
            showsIndoors={false}
            customMapStyle={customMapStyle}
            showsUserLocation={true}
            onRegionChange={() => setIsUserInteracting(true)}
            onRegionChangeComplete={() => setIsUserInteracting(false)}
        >
            {rider?.latitude && pickup?.latitude && (
                <MapViewDirections
                    origin={rider}
                    destination={status === "START" ? pickup : drop}
                    onReady={fitToMarkers}
                    apikey={apikey}
                    strokeColor={Colors.iosColor}
                    strokeColors={[Colors.iosColor]}
                    strokeWidth={5}
                    precision='high'
                    onError={(error) => console.log("Direction Error", error)}
                />
            )}
        </MapView>
    </View>
  )
}

export default memo(LiveTrackingMap)