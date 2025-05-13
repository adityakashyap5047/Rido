import { View, SafeAreaView, ScrollView, Image, TouchableOpacity} from 'react-native'
import React, { useState } from 'react'
import { authStyles } from '@/styles/authStyles'
import { commonStyles } from '@/styles/commonStyles'
import CustomText from '@/components/shared/CustomText'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import PhoneInput from '@/components/shared/PhoneInput'
import { useWS } from '@/service/WSProvider'

const Auth = () => {

  const {updateAccessToken} = useWS();
  const [phone, setPhone] = useState("");

  return (
    <SafeAreaView style={authStyles.container}>
      <ScrollView contentContainerStyle={authStyles.container}>
        <View style={commonStyles.flexRowBetween}>
          <Image source={require('@/assets/images/logo_t.png')} style={authStyles.logo} />
          <TouchableOpacity style={authStyles.flexRowGap}>
            <MaterialIcons name="help" size={18} color="grey" />
            <CustomText fontFamily='Medium' variant='h7'>
              Help
            </CustomText>
          </TouchableOpacity>
        </View>

        <CustomText fontFamily='Medium' variant='h6'>
          What is Your number?
        </CustomText>

        <CustomText variant='h7' fontFamily='Regular' style={commonStyles.lightText}>
          Enter your Phone No. to Proceed
        </CustomText>

        <PhoneInput onChangeText={setPhone} value={phone}/>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Auth