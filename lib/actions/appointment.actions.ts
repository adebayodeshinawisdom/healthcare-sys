"use server"
import { ID, Messaging, Query } from "node-appwrite"
import { APPOINTMENT_ID, BUCKET_ID, DATABASE_ID, databases, ENDPOINT, messaging } from "../appwrite.config"

import { parseStringify } from "../utils"
import { Appointment } from "@/types/appwrite.types"
import { revalidatePath } from "next/cache"
import { formatDateTime } from "@/app/lib/utils"


export const createAppointment = async(appointmentData:CreateAppointmentParams)=>{
    try {

        const newPatient = await databases.createDocument(
            DATABASE_ID!, 
            APPOINTMENT_ID!,
            ID.unique(),
            appointmentData
        )
        return parseStringify(newPatient)
        
    } catch (error) {
        console.log(error)
    }
}


export const getAppointment = async(appointmentId: string) => {
    try {

        const appointment = await databases.getDocument(
            DATABASE_ID!,
            APPOINTMENT_ID!,
            appointmentId,
    
        )
        return parseStringify(appointment)
    
        
    } catch (error) {
        console.log(error)
    }
}

export const getRecentAppointmentList = async () => {
    try {
        const appointments = await databases.listDocuments(
            DATABASE_ID!,
            APPOINTMENT_ID!,
            [Query.orderDesc('$createdAt')]
        );
        const initialCount = {
            scheduledCount: 0,
            cancelledCount: 0,
            pendingCount: 0,
        }
        const counts = (appointments.documents as Appointment[]).reduce((acc, appointment) => {
                if(appointment.status === 'scheduled'){
                    acc.scheduledCount += 1;
                }else if(appointment.status === 'cancelled'){
                    acc.cancelledCount += 1;
                }else if(appointment.status === 'pending'){
                    acc.pendingCount +=1;
                }
        return acc
    }, initialCount)
    const data = {
        totalCount: appointments.total,
        ...counts,
        documents: appointments.documents
    }
        return parseStringify(data)
    } catch (error) {
        console.log(error)
    }
}

export const updateAppointment = async ({appointmentId, userId, appointment, type}:UpdateAppointmentParams)  => {


    try {
        const updatedAppointment = await databases.updateDocument(
            DATABASE_ID!,
            APPOINTMENT_ID!,
            appointmentId,
            appointment

        )
        if(!updateAppointment){
            throw new Error("Appointment not found")
        }
        //SMS confirmation
        const emailMessage = `Hi, this is Carepulse ${type === 'schedule' 
            ? `Your appointment has been scheduled for ${formatDateTime(appointment.schedule!)}`
        : `We regret to inform you that your appointment has been cancelled. For the following reason ${appointment.cancellationReason}`}`

        await sendEmailNotification(userId, emailMessage)
        revalidatePath('/admin')
        return parseStringify(updatedAppointment)
    } catch (error) {
        console.log(error)
    }
}

export const sendEmailNotification = async (userId: string, content:string) => {
    try {
        const message = await messaging.createEmail(
            ID.unique(),
            content,
            userId,
            [],

        )
        return parseStringify(message)
        
    } catch (error) {
        console.log(error)
    }

}