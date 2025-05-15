import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
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
import { getPlacesSuggestions } from '@/utils/mapUtils'

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

  const fetchLocation = async(query: string) => {
    if (query.length > 4){
      const data = await getPlacesSuggestions(query);
      setLocations(data);
    }
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
      </View>
    </View>
  )
}

export default LocationSelection