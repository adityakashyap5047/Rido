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
    </View>
  )
}

export default LocationSelection