import { View, Text, Image } from 'react-native'
import React from 'react'
import { useFonts } from 'expo-font'
import { commonStyles } from '@/styles/commonStyles'
import { splashStyles } from '@/styles/splashStyles'

const Main = () => {

  const [loaded] = useFonts({
    Bold: require("@/assets/fonts/NotoSans-Bold.ttf"),
    Regular: require("@/assets/fonts/NotoSans-Regular.ttf"),
    Medium: require("@/assets/fonts/NotoSans-Medium.ttf"),
    Light: require("@/assets/fonts/NotoSans-Light.ttf"),
    SemiBold: require("@/assets/fonts/NotoSans-SemiBold.ttf"),
  })

  return (
    <View style={commonStyles.container}>
      <Image 
        source={require("@/assets/images/logo_t.png")}
        style={splashStyles.img}
      />
      <Text>Congratulations!!! You Successfully Run the app</Text>
    </View>
  )
}

export default Main