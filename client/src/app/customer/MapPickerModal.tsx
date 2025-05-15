import { View, Text, Modal, TouchableOpacity, TextInput } from 'react-native'
import React, { FC, memo, useEffect, useRef, useState } from 'react'
import { modalStyles } from '@/styles/modalStyles';
import MapView, { Region } from 'react-native-maps';
import { useUserStore } from '@/store/userStore';
import { getLatLong, getPlacesSuggestions, reverseGeocode } from '@/utils/mapUtils';
import LocationItem from './LocationItem';
import * as Location from 'expo-location'
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';

interface MapPickerModalProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    selectLocation: {
        latitude: number;
        longitude: number;
        address: string;
    };
    onSelectLocation: (data: {
        latitude: number;
        longitude: number;
        address: string;
    }) => void;
}

const MapPickerModal: FC<MapPickerModalProps> = ({
    visible,
    onClose,
    title,
    selectLocation,
    onSelectLocation
}) => {

    const mapRef = useRef<MapView>(null);
    const [text, setText] = useState('')
    const {location} = useUserStore()
    const [address, setAddress] = useState('')
    const [region, setRegion] = useState<Region | null>(null)
    const [locations, setLocations] = useState([])
    const textInputRef = useRef<TextInput>(null);

    const fetchLocation = async(query: string) => {
        if (query.length > 4){
          const data = await getPlacesSuggestions(query);
          setLocations(data);
        } else {
          setLocations([]);
        }
    }

    useEffect(() => {
        if(selectLocation?.latitude){
            setAddress(selectLocation?.address)
            setRegion({
                latitude: selectLocation?.latitude,
                longitude: selectLocation?.longitude,
                longitudeDelta: 0.5,
                latitudeDelta: 0.5
            })

            mapRef?.current?.fitToCoordinates([{
                latitude: selectLocation?.latitude,
                longitude: selectLocation?.longitude
            }], {
                edgePadding: {top: 50, left: 50, bottom: 50, right: 50},
                animated: true
            })
        }
    }, [selectLocation, mapRef])

    const addLocation = async(place_id: string) => {
        const data = await getLatLong(place_id)
        if(data) {
            setRegion({
                latitude: data.latitude,
                longitude: data.longitude,
                latitudeDelta: 0.5,
                longitudeDelta: 0.5
            })
            setAddress(data.address)
        }
        textInputRef.current?.blur()
        setText('')
    }

    const renderLocations = ({item}: any) => {
        return (
            <LocationItem item={item} onPress={() => addLocation(item?.place_id)} />
        )
    }

    const handleRegionChangeComplete = async(newRegion: Region) => {
        try{
            const address = await reverseGeocode(
                newRegion?.latitude,
                newRegion?.longitude
            );
            setRegion(newRegion)
            setAddress(address)
        } catch (error){
            console.log(error)
        }
    }

    const handleGpsButtonPress = async() => {
        try{
            const location = await Location.getCurrentPositionAsync({})
            const {latitude, longitude} = location.coords;
            mapRef.current?.fitToCoordinates([{latitude, longitude}], {
                edgePadding: {
                    top: 50,
                    right: 50,
                    bottom: 50,
                    left: 50,
                },
                animated: true,
            })
            const address = await reverseGeocode(latitude, longitude);
            setAddress(address)
            setRegion({
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: 0.5,
                longitudeDelta: 0.5
            })
        } catch (error) {
            console.error('Error getting location', error);
        }
    }

  return (
    <Modal
        animationType='slide'
        visible={visible}
        presentationStyle='formSheet'
        onRequestClose={onClose}
    >
        <View style={modalStyles.modalContainer}>
            <Text style={modalStyles?.centerText}>Select {title} Location</Text>

            <TouchableOpacity onPress={onClose}>
                <Text style={modalStyles?.cancelButton}>Cancel</Text>
            </TouchableOpacity>

            <View style={modalStyles.searchContainer}>
                <Ionicons name='search-outline' size={RFValue(16)} color="#777"/>
                <TextInput
                    ref={textInputRef}
                    style={modalStyles?.input}
                    placeholder='Search for a location'
                    placeholderTextColor="#aaa"
                    value={text}
                    onChangeText={(e) => {
                        setText(e)
                        fetchLocation(e)
                    }}
                />
            </View>
        </View>
    </Modal>
  )
}

export default memo(MapPickerModal);