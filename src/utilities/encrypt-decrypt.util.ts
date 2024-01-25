import * as CryptoJS from 'crypto-js'

export const encryptionData = (secret: string, data: string): string => {
    return CryptoJS.AES.encrypt(data, secret).toString()
}

export const decryptionData = (secret: string, hash: string): string => {
    const decryptData = CryptoJS.AES.decrypt(hash, secret)
    return decryptData.toString(CryptoJS.enc.Utf8)
}