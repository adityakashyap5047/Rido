import { useRiderStore } from "@/store/riderStore";
import { tokenStorage } from "@/store/storage";
import { useUserStore } from "@/store/userStore"
import { resetAndNavigate } from "@/utils/Helpers";


export const logout = async () => {
    const {clearData} = useUserStore.getState();
    const {clearRiderData} = useRiderStore.getState();

    tokenStorage.clearAll();
    clearRiderData();
    clearData();
    resetAndNavigate("/role")
}