import { router } from "expo-router";
import { appAxios } from "./apiInterceptors";
import { Alert } from "react-native";

interface coords{
    address: string,
    latitude: number,
    longitude: number,
}

export const createRide = async(payload: {
    vehcile: "bike" | "auto" | "cabEconomy" | "cabPremium";
    pickup: coords
    drop: coords
}) => {
    try{
        const res = await appAxios.post('/ride/create', payload);
        router?.navigate({
            pathname: "/customer/liveride",
            params: {
                id: res?.data?.ride?._id,
            },
        })
    } catch (error: any){
        Alert.alert("Ohh! Dang there was an error");
        console.log("Error: Create Ride", error)
    }
}

export const getMyRides = async(isCustomer: boolean = true) => {
    try{
        const res = await appAxios.get('/ride/rides');
        const filterRides = res.data.rides?.filter(
            (ride: any) => ride?.status != "COMPLETED"
        );
        if(filterRides?.length > 0){
            router?.navigate({
                pathname: isCustomer ? "/customer/liveride" : "/rider/liveride",
                params: {
                    id: filterRides![0]?._id
                }
            })
        }
    } catch(error: any){
        Alert.alert("Oh! Dang there was an error");
        console.log("Error: GET MY Ride", error)
    }
}