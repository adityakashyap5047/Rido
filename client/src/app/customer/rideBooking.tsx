import { View, Text } from 'react-native'
import React, { memo, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import { useUserStore } from '@/store/userStore'

const RideBooking = () => {

    const route = useRoute() as any
    const item = route?.param as any
    const {location} = useUserStore() as any
    const [selectedOption, setSelectedOption] = useState("Bike")
    const [loading, setLoading] = useState(false)

  return (
    <View>
      <Text>RideBooking</Text>
    </View>
  )
}

export default memo(RideBooking)