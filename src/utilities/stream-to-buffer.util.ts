import { ReadStream } from "fs";

export const streamToBuffer = async (readStream: ReadStream): Promise<Buffer> => { 
    return new Promise((resolve, reject)=>{
      const chunks = [];
      readStream.on('data', (chunk) => {
        chunks.push(chunk);
      });
      readStream.on('end', () => {
        const buffer = Buffer.concat(chunks);
        return resolve(buffer)
      });
      readStream.on('error', (err) => {
        return reject(err)
      });
    })                 
}