import { View, Image, Alert } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useFonts } from 'expo-font'
import { commonStyles } from '@/styles/commonStyles'
import { splashStyles } from '@/styles/splashStyles'
import CustomText from '@/components/shared/CustomText'
import { useUserStore } from '@/store/userStore'
import { tokenStorage } from '@/store/storage'
import {jwtDecode} from 'jwt-decode'
import { resetAndNavigate } from '@/utils/Helpers'
import { refresh_token } from '@/service/apiInterceptors'
import { logout } from '@/service/authService'

interface DecodedToken {
  exp: number;
}

const Main = () => {

  const [loaded] = useFonts({
    Bold: require("@/assets/fonts/NotoSans-Bold.ttf"),
    Regular: require("@/assets/fonts/NotoSans-Regular.ttf"),
    Medium: require("@/assets/fonts/NotoSans-Medium.ttf"),
    Light: require("@/assets/fonts/NotoSans-Light.ttf"),
    SemiBold: require("@/assets/fonts/NotoSans-SemiBold.ttf"),
  });

  const { user } = useUserStore();

  const [hasNavigated, setHasNavigated] = useState(false);

  const tokenCheck = useCallback(async() => {
    const access_tokens = tokenStorage.getString("access_token") as string;
    const refresh_tokens = tokenStorage.getString("refresh_token") as string;

    if(access_tokens){
      const decodedAccessToken = jwtDecode<DecodedToken>(access_tokens);
      const decodedRefreshToken = jwtDecode<DecodedToken>(refresh_tokens);

      const currentTime = Date.now() / 1000;

      if(decodedRefreshToken?.exp < currentTime){
        logout();
        Alert.alert("Session expired, please login again");
      }

      if(decodedAccessToken?.exp < currentTime){
        try{
          refresh_token();
        } catch (error) {
          console.log("Error refreshing token", error);
          Alert.alert("Refresh Token Error", "Please login again");
        }
      }

      if(user) {
        resetAndNavigate("/customer/home");
      } else {
        resetAndNavigate("/rider/home");
      }

      return;
    }

    resetAndNavigate("/role")
  }, [user]);

  useEffect(() => {
    if(loaded && !hasNavigated) {
      const timeoutId = setTimeout(() => {
        tokenCheck();
        setHasNavigated(true);
      }, 1000);  

      return () => clearTimeout(timeoutId);
    }
  }, [loaded, hasNavigated, tokenCheck]);

  return (
    <View style={commonStyles.container}>
      <Image 
        source={require("@/assets/images/logo_t.png")}
        style={splashStyles.img}
      />
      <CustomText variant='h6' fontFamily="Medium" style={splashStyles.text}>Congratulations!!! You Successfully Run the app</CustomText>
    </View>
  )
}

export default Main