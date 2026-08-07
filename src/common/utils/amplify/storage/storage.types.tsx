import { UploadDataWithPathOutput } from "aws-amplify/storage";

export interface DBFileDataItem {
    createdAt?: string;
    updatedAt?: string;
    name?:string;
    fileName: string;
    path: string;
    src: string;
}

export interface UploadFileToServerResponse {
    result: UploadDataWithPathOutput | { result: Promise<any>};
    fileName: string;
    customPath: string;
}