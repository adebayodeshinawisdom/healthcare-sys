
"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input" 
import CustomFormField from "../CustomFormField"
import SubmitButton from "../ui/SubmitButton"
import { useState } from "react"
import { UserFormValidation, AppointmentFormValidation } from "../ui/FormValidation"
import { createUser } from "@/lib/actions/patient.actions"
import { useRouter } from "next/navigation"
import { formFieldTypes } from "./PatientForm"
import { SelectItem } from "../ui/select"
import { Doctors } from "@/app/constants"
import Image from "next/image"
import { createAppointment, updateAppointment } from "@/lib/actions/appointment.actions"
import { Appointment } from "@/types/appwrite.types"
import { stat } from "fs"
// const formSchema = z.object({
//   username: z.string().min(2, {
//     message: "Username must be at least 2 characters.",
//   }),
// })


 
const  AppointmentForm = ({userId, patientId, type, appointment, setOpen }:{
    userId: string;
    patientId: string;
    appointment?: Appointment;
    setOpen: (open: boolean)=>void;
    type: "create" | "cancel" | "schedule";
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  // 1. Define your form.
  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
     primaryPhysician: appointment ? appointment?.primaryPhysician : "",
     schedule: appointment ? new Date(appointment?.schedule) : new Date(Date.now()),
     reason: appointment ? appointment?.reason : "",
     note: appointment ? appointment?.note : "",
     cancellationReason:  appointment?.cancellationReason || "" 
    },
})

const onSubmit = async (values: z.infer<typeof AppointmentFormValidation>) => {
  setIsLoading(true);
    let status
    switch (type) {
      case 'schedule':
        status = 'scheduled';
        break;
      case 'cancel':
        status = 'cancelled';
        break;

    
      default:
        status = 'pending'
        break;
    }
  try {
    if(type === 'create' && patientId){
      const appointmentData = {
        userId,
        patient: patientId,
        primaryPhysician:values.primaryPhysician,
        schedule:new Date(values.schedule),
        note: values.note,
        reason: values.reason,
        status: status as Status


      }
      const appointment = await createAppointment(appointmentData);
      if(appointment){
        form.reset()
        router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`)
      }
    }else{
      const appointmentToUpdate = {
        userId,
        appointmentId:appointment?.$id!,
        appointment:{
          primaryPhysician: values?.primaryPhysician,
          schedule: new Date(values?.schedule),
          status: status as Status,
          note: values?.note,
          cancellationReason: values?.cancellationReason

        },
        type

      }

      const updatedAppointment = await updateAppointment(appointmentToUpdate)
    
    // if (newUser)  router.push(`/patients/${newUser.$id}/register`);
    if(updatedAppointment){
      setOpen && setOpen(false);
      form.reset()
    }
     
    }

    
  } catch (error) {
    console.error(error);
  } 
  setIsLoading(false)
}

let buttonLabel;
switch(type){
    case 'cancel':
        buttonLabel = 'Cancel Appointment';
        break;
    case 'create':
        buttonLabel = 'Create Appointment';
        break;

    case 'schedule':
        buttonLabel = 'Reschedule Appointment';
        break;

    default:
        break;

}



return(
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        { type === "create" && <section className="mb-12 space-y-4">
            <h1 className="header">New Appointment 👋</h1>
            <p className="text-dark-700">Request a new appointment in 10 seconds</p>
        </section>}
       {type !== "cancel" && (
        <>
        <CustomFormField
        fieldType={formFieldTypes.SELECT}
        name="primaryPhysician"
        placeholder="Select a Doctor"
        label="Primary Physician"
        control={form.control}>
          {Doctors.map((doctor)=> (
            <SelectItem key={doctor.name} value={doctor.name}>

              <div className="flex items-center cursor-pointer gap-2">
                <Image 
                src={doctor.image}
                width={32}
                height={32}
                alt={doctor.name}
                className="rounded-full border border-dark-500"
                />
                <p>{doctor.name}</p>

              </div>

            </SelectItem>
          ))}

        </CustomFormField>
        
        <CustomFormField
        fieldType={formFieldTypes.DATE_PICKER}
        name="schedule"
        placeholder="expected appointment date"
        label="Expected Appointment Date"
        showTimeSelect
        dateFormat="MM/dd/yyyy - h:mm aa"
        control={form.control}/>

        <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField
        fieldType={formFieldTypes.TEXTAREA}
        name="reason"
        placeholder="Enter reason for appointment"
        label="Reason for Appoinment"
              
        control={form.control}/>

        <CustomFormField
        fieldType={formFieldTypes.TEXTAREA}
        name="note"
        placeholder="enter notes"
        label="Notes"
              
        control={form.control}/>



          </div>

        
        </>
       )}

       {type== "cancel" && (
        <>
            <CustomFormField
                fieldType={formFieldTypes.TEXTAREA}
                name="cancellationReason"
                placeholder="enter reason for cancellation"
                label="Reason for Cancellation"
                    
                control={form.control}/>
                
                </>
       )}
        <SubmitButton isLoading={isLoading} className={`${type ==='cancel' ? 'shad-danger-btn' : 'shad-primary-btn'} w-full`}>{buttonLabel}</SubmitButton>
      </form>
    </Form>
)
}
export default AppointmentForm