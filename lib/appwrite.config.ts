import * as sdk from 'node-appwrite'

export const {
PROJECT_ID,
PATIENT_COLLECTION_ID,
DOCTOR_COLLECTION_ID,
USER_CREATION_ID,
APPOINTMENT_ID,
BUCKET_ID,
NEXT_PUBLIC_ENDPOINT: ENDPOINT,
API_KEY,
DATABASE_ID 
} = process.env


const client = new sdk.Client();

client
.setEndpoint(ENDPOINT!)
.setProject(PROJECT_ID!)
.setKey(API_KEY!)


export const databases = new sdk.Databases(client);
export const storage = new sdk.Storage(client);
export const messaging = new sdk.Messaging(client);
export const users = new sdk.Users(client);