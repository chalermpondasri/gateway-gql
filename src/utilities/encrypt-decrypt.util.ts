import * as crypto from 'crypto'

const IV_LENGTH = 12
const ALGORITHM_CIPHER = 'aes-256-gcm'

export const encryptionData = (secret: string, data: string): string => {
    const iv = crypto.randomBytes(IV_LENGTH)
    const cipher = crypto.createCipheriv(
        ALGORITHM_CIPHER,
        Buffer.from(secret),
        iv,
    )
    const enc1 = cipher.update(data, 'utf8')
    const enc2 = cipher.final()
    const x = Buffer.concat([enc1, enc2, iv, cipher.getAuthTag()])
    return x.toString('base64')
}

export const decryptionData = (secret: string, hash: string): string => {
    let enc = Buffer.from(hash, 'base64')
    const iv = enc.subarray(enc.length - 28, enc.length - 16)
    const tag = enc.subarray(enc.length - 16)
    enc = enc.subarray(0, enc.length - 28)
    const decipher = crypto.createDecipheriv(ALGORITHM_CIPHER, Buffer.from(secret), iv)
    decipher.setAuthTag(tag)
    let str = decipher.update(enc, null, 'utf8')
    str += decipher.final('utf8')
    return str
}

export const videoHash = (videoId: string, secret: string): string => {
    const hash = crypto.createHash('sha512')
    hash.push(videoId)
    const hashedFileMeta = hash.digest()
    return crypto.pbkdf2Sync(hashedFileMeta, Buffer.from(secret), 12, 8, 'sha1').toString('hex')
}