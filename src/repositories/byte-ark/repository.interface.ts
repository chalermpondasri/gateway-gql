import { GetObjectCommandInput } from "@aws-sdk/client-s3";
import { Observable } from "rxjs";

export interface IByteArkRepository {
    uploadFile(imgName: string, file: Buffer): Observable<string>
    generateSignedUrlForGet(params: GetObjectCommandInput): Observable<string>
}