import { View, Text } from 'react-native'
import React, { memo, useCallback, useMemo, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import { useUserStore } from '@/store/userStore'
import { rideStyles } from '@/styles/rideStyles'
import { StatusBar } from 'expo-status-bar'
import { calculateFare } from '@/utils/mapUtils'
import RoutesMap from './RoutesMap'

const RideBooking = () => {

    const route = useRoute() as any
    const item = route?.param as any
    const {location} = useUserStore() as any
    const [selectedOption, setSelectedOption] = useState("Bike")
    const [loading, setLoading] = useState(false)

    const fairPrices = useMemo(() => 
      calculateFare(parseFloat(item?.distanceInKM))
    , [item?.distanceInKM])

    const rideOptions = useMemo(
      () => [
        {
          type: "Bike",
          seats: 1,
          time: "1 min",
          dropTime: "4:28 pm",
          price: fairPrices?.bike,
          isFastest: true,
          icon: require('@/assets/icons/bike.png'),
        },
        {
          type: "Auto",
          seats: 3,
          time: "1 min",
          dropTime: "4:30 pm",
          price: fairPrices?.auto,
          icon: require('@/assets/icons/auto.png'),
        },
        {
          type: "Cab Economy",
          seats: 4,
          time: "2 min",
          dropTime: "4:28 pm",
          price: fairPrices?.cabEconomy,
          icon: require('@/assets/icons/cab.png'),
        },
        {
          type: "Cab Economy",
          seats: 4,
          time: "1 min",
          dropTime: "4:28 pm",
          price: fairPrices?.cabPremium,
          icon: require('@/assets/icons/cab_premium.png'),
        },
      ], [fairPrices]
    )

    const handleOptionSelect = useCallback((type: string) => {
      setSelectedOption(type)
    }, [])

    const handleRideBooking = async() => {
      setLoading(true)
      
      setLoading(false)
    }

  return (
    <View style={rideStyles.container}>
      <StatusBar style='light' backgroundColor='orange' translucent={false}/>
      <RoutesMap
        drop={{
          latitude: parseFloat(item?.drop_latitude),
          longitude: parseFloat(item?.drop_longitude),
        }}
        pickup={{
          latitude: parseFloat(location?.latitude),
          longitude: parseFloat(location?.longitude),
        }}
      />
    </View>
  )
}

export default memo(RideBooking)