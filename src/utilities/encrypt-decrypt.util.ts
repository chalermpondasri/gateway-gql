import * as crypto from 'crypto'

const IV_LENGTH = 8

export const encryptionData = (secret: string, data: string): string => {
    const iv = crypto.randomBytes(IV_LENGTH).toString('hex').slice(0, 16)
    const cipher = crypto.createCipheriv(
        'aes-256-cbc',
        Buffer.from(secret),
        iv,
    )
    let encrypted = cipher.update(data)
    encrypted = Buffer.concat([encrypted, cipher.final()])
    return iv + ':' + encrypted.toString('hex')
}

export const decryptionData = (secret: string, hash: string): string => {
    const textParts = hash.split(':')
    const iv = Buffer.from(textParts.shift())
    const encryptedText = Buffer.from(textParts.join(':'), 'hex')
    const decipher = crypto.createDecipheriv(
        'aes-256-cbc',
        Buffer.from(secret),
        iv,
    )
    let decrypted = decipher.update(encryptedText)
    decrypted = Buffer.concat([decrypted, decipher.final()])
    return decrypted.toString()
}