import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { uiStyles } from '@/styles/uiStyles'
import { router } from 'expo-router'
import { RFValue } from 'react-native-responsive-fontsize'
import CustomText from '@/components/shared/CustomText'
import { commonStyles } from '@/styles/commonStyles'

const cubes = [
    {name: "Bike", imageUrl: require('@/assets/icons/bike.png')},
    {name: "Auto", imageUrl: require('@/assets/icons/auto.png')},
    {name: "Cab Economy", imageUrl: require('@/assets/icons/cab.png')},
    {name: "Parcel", imageUrl: require('@/assets/icons/parcel.png')},
    {name: "Cab Premium", imageUrl: require('@/assets/icons/cab_premium.png')},
]

const SheetContent = () => {
  return (
    <View style={{height: "100%"}}>
        <TouchableOpacity style={uiStyles.searchBarContainer} onPress={() => router.navigate("/customer/selectlocations")}>
            <Ionicons name="search-outline" size={RFValue(16)} color="black"/>
            <CustomText fontFamily='Medium' fontSize={11}>
                Where are you going?
            </CustomText>
        </TouchableOpacity>

        <View style={commonStyles.flexRowBetween}>
            <CustomText fontFamily='Medium' fontSize={11}>
                Explore
            </CustomText>

            <TouchableOpacity style={commonStyles.flexRow}>
                <CustomText fontFamily='Regular' fontSize={10}>
                    View All
                </CustomText>
                <Ionicons name='chevron-forward' size={RFValue(14)} color="black" />
            </TouchableOpacity>
        </View>
    </View>
  )
}

export default SheetContent