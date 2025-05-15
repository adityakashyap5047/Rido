import { View, SafeAreaView, TouchableOpacity, FlatList, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useUserStore } from '@/store/userStore'
import { homeStyles } from '@/styles/homeStyles'
import { StatusBar } from 'expo-status-bar'
import { commonStyles } from '@/styles/commonStyles'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/utils/Constants'
import CustomText from '@/components/shared/CustomText'
import { uiStyles } from '@/styles/uiStyles'
import LocationInput from './LocationInput'
import { calculateDistance, getLatLong, getPlacesSuggestions } from '@/utils/mapUtils'
import { locationStyles } from '@/styles/locationStyles'
import LocationItem from './LocationItem'
import MapPickerModal from './MapPickerModal'

const LocationSelection = () => {

  const{location, setLocation} = useUserStore()

  const [pickup, setPickup] = useState("")
  const [pickupCoords, setPickupCoords] = useState<any>(null)
  const [dropCoords, setDropCoords] = useState<any>(null)
  const [drop, setDrop] = useState("")
  const [locations, setLocations] = useState([])
  const [focusedInput, setFocusedInput] = useState("drop")
  const [modalTitle, setModalTitle] = useState("drop")
  const [isMapModalVisible, setIsMapModalVisible] = useState(false)

  const checkDistance = async() => {
    if (!pickupCoords || !dropCoords) return;

    const {latitude: lat1, longitude: lon1} = pickupCoords
    const {latitude: lat2, longitude: lon2} = dropCoords

    if (lat1 == lat2 && lon1 == lon2){
      alert("Pickup and Drop locations cannot be the same. Please select different locations.")
    }

    const minDistance = 0.5 
    const maxDistance = 50

    const distance = calculateDistance(lat1, lon1, lat2, lon2)

    if(distance < minDistance){
      alert("The selected locations are too close. Please select different locations.")
    } else if(distance > maxDistance){
      alert("The selected locations are too far apart. Please select different locations.")
    } else {
      setLocations([])
      router.navigate({
        pathname: "/customer/rideBooking",
        params: {
          distanceInKM: distance.toFixed(2),
          drop_latitude: dropCoords?.latitude,
          drop_longitude: dropCoords?.longitude,
          drop_address: drop,
        }
      })
    }

  }

  useEffect(() => {
    if(dropCoords && pickupCoords){
      checkDistance()
    } else {
      setLocations([])
      setIsMapModalVisible(false)
    }
  }, [dropCoords, pickupCoords])
  
  const fetchLocation = async(query: string) => {
    if (query.length > 4){
      const data = await getPlacesSuggestions(query);
      setLocations(data);
    } else {
      setLocations([]);
    }
  }

  const addLocation = async(id: string) => {
    const data = await getLatLong(id);
    if(data) {
      if(focusedInput === 'drop'){
        setDrop(data?.address)
        setDropCoords(data)
      } else {
        setLocation(data)
        setPickupCoords(data)
        setPickup(data?.address)
      }
    }
  }

  const renderLocations = ({item}: any) => {
    return (
      <LocationItem item={item} onPress={() => addLocation(item?.place_id)} />
    )
  }

  return (
    <View style={homeStyles.container}>
      <StatusBar style='light' backgroundColor='orange' translucent={false} />
      <SafeAreaView />

      <TouchableOpacity
        style={commonStyles.flexRow}
        onPress={() => router.back()}
      >
        <Ionicons name='chevron-back' size={18} color={Colors.iosColor}/>
        <CustomText fontFamily='Regular' style={{color: Colors.iosColor}}>
          Back
        </CustomText>
      </TouchableOpacity>

      <View style={uiStyles.locationInputs}>
        <LocationInput
          placeholder='Search a Pickup Location'
          type='pickup'
          value={pickup}
          onChangeText={(text) => {
            setPickup(text)
            fetchLocation(text);
          }}
          onFocus={() => setFocusedInput("pickup")}
        />

        <LocationInput
          placeholder='Search a Drop Location'
          type='drop'
          value={drop}
          onChangeText={(text) => {
            setDrop(text)
            fetchLocation(text);
          }}
          onFocus={() => setFocusedInput("drop")}
        />

        <CustomText
          fontFamily='Medium'
          fontSize={10}
          style={uiStyles.suggestionText}
        >
          {focusedInput} suggestions
        </CustomText>

        <FlatList
          data={locations}
          renderItem={renderLocations}
          keyExtractor={(item: any) => item?.place_id}
          initialNumToRender={5}
          windowSize={5}
          ListFooterComponent={
            <TouchableOpacity
              style={[commonStyles.flexRow, locationStyles.container]}
              onPress={() => {
                setModalTitle(focusedInput)
                setIsMapModalVisible(true)
              }} 
            >
              <Image
                source={require('@/assets/icons/map_pin.png')}
                style={uiStyles.mapPinIcon}
              />
              <CustomText fontFamily='Medium' fontSize={12}>Select From Map</CustomText>
            </TouchableOpacity>
          }
        />
      </View>

      {
        isMapModalVisible && (
          <MapPickerModal
              selectLocation = {{
                latitude: 
                  focusedInput === 'drop' 
                    ? dropCoords?.latitude
                    : pickupCoords?.latitude,
                longitude:
                  focusedInput === 'drop' 
                    ? dropCoords?.longitude
                    : pickupCoords?.longitude,
                address: focusedInput === 'drop' ? drop : pickup
              }}
              title={modalTitle}
              visible={isMapModalVisible}
              onClose={() => setIsMapModalVisible(false)}
              onSelectLocation={(data) => {
                if(data){
                  if(modalTitle === 'drop'){
                    setDrop(data?.address)
                    setDropCoords(data)
                  } else {
                    setLocation(data)
                    setPickupCoords(data)
                    setPickup(data?.address)
                  }
                }
              }}
          />
        )
      }
    </View>
  )
}

export default LocationSelection