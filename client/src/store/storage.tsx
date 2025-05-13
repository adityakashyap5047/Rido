import {MMKV} from 'react-native-mmkv'

export const tokenStorage = new MMKV({
    id: 'token-storage',
    encryptionKey: 'SOME-RANDOM-SUPER-SECRECT-KEY',
})

export const storage = new MMKV({
    id: 'my-app-storage',
    encryptionKey: 'SOME-RANDOM-SUPER-SECRECT-KEY',
})

export const mmkvStorage: {
    setItem: (key: string, value: string) => void,
    getItem: (key: string) => string | null,
    removeItem: (key: string) => void,
} = {
    setItem: (key: string, value: string) => {
        storage.set(key, value)
    },
    getItem: (key: string) => {
        const value = storage.getString(key)
        return value ?? null;
    },
    removeItem: (key: string) => {
        storage.delete(key)
    },
}