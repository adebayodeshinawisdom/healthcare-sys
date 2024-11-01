
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
import { PatientFormValidation, UserFormValidation } from "../ui/FormValidation"
import { createUser, registerPatient } from "@/lib/actions/patient.actions"
import { useRouter } from "next/navigation"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/app/constants"
import { Label } from "../ui/label"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import FileUploader from "../FileUploader"
// const formSchema = z.object({
//   username: z.string().min(2, {
//     message: "Username must be at least 2 characters.",
//   }),
// })

export enum formFieldTypes {
 INPUT = 'input',
 TEXTAREA = 'textarea',
 PHONE_INPUT= 'phoneInput',
 CHECKBOX = 'checkbox',
 DATE_PICKER = 'datePicker',
 SELECT = 'select',
 SKELETON = 'skeleton'
} 
 
const  RegisterForm = ({ user }: { user: User }) => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  // 1. Define your form.
  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: "",
      phone:"",
      email: ""
    },
})

const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
  setIsLoading(true);
  let formData;
  if(values.identificationDocument && values.identificationDocument.length > 0 ){
    const blobFile = new Blob([values.identificationDocument[0]], { 
      type: values.identificationDocument[0].type, 

    })
    formData = new FormData();
    formData.append('blobFile', blobFile);
    formData.append('fileName', values.identificationDocument[0].name)
  }
  try {
    const patientData = {
      ...values,
      userId:user.$id,
      birthDate: new Date(values.birthDate),
      identificationDocument: formData,
    }
   
    // @ts-ignore
    const patient = await registerPatient(patientData)
    if(patient) router.push(`/patients/${user.$id}/new-appointment`)
  } catch (error) {
    console.error(error);
  } 
  setIsLoading(false)
}

return(
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
        <section className="mb-12 space-y-4">
            <h1 className="header">Welcome 👋</h1>
            <p className="text-dark-700">Lets know more about yourself</p>
        </section>
        <section className="space-y-6">
            
            <h2 className="mb-9 space-y-1">
            <p className="sub-header">Personal Information</p>
            </h2>
        </section>
        <CustomFormField
        fieldType={formFieldTypes.INPUT}
        name="name"
        placeholder="John Doe"
        label="Full Name"
        iconSrc="/assets/icons/user.svg"
        iconAlt="user"
        control={form.control}/>


        <div className="flex flex-col gap-6 xl:flex-row">


        <CustomFormField
        fieldType={formFieldTypes.INPUT}
        name="email"
        placeholder="johnemeka2014@gmail.com"
        label="Email"
        iconSrc="/assets/icons/email.svg"
        iconAlt="email"
        control={form.control}/>

        <CustomFormField
        fieldType={formFieldTypes.PHONE_INPUT}
        name="phone"
        placeholder="555 -444 -4444"
        label="Phone Number"
        
        control={form.control}/>


        </div>
        

        <div className="flex flex-col gap-6 xl:flex-row">


        <CustomFormField
        fieldType={formFieldTypes.DATE_PICKER}
        name="bithDate"
      
        label="Date of Birth"
        dateFormat="MM/dd/yyyy"
        control={form.control}/>

        <CustomFormField
        fieldType={formFieldTypes.SKELETON}
        name="gender"
       
        label="Gender"
        
        control={form.control}

        renderSkeleton={(field) => (
          <FormControl>

            <RadioGroup className="flex h-11 gap-6 xl:justify-between" 
            onValueChange={field.onChange} 
            defaultValue={field.value}>

              {GenderOptions.map((option) => (
                <div key={option} className="radio-group">

                  <RadioGroupItem value={option} id={option} />
                    <Label htmlFor={option} className="cursor-pointer">
                      {option}
                    </Label>

                  
                </div>
              ))}

            </RadioGroup>

          </FormControl>

        )}
        
        />


        
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">

        <CustomFormField
        fieldType={formFieldTypes.INPUT}
        name="address"
        placeholder="No 100, Wisdom Street, Wuse Abuja"
        label="Address"
        control={form.control}/>

        <CustomFormField
        fieldType={formFieldTypes.INPUT}
        name="occupation"
        placeholder="Software Engineer"
        label="Occupation"
       
        control={form.control}/>
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">

        <CustomFormField
        fieldType={formFieldTypes.INPUT}
        name="emergencyContactName"
        placeholder="Emergency Contact Name"
        label="Gaurdian's Name"
        control={form.control}/>

        <CustomFormField
        fieldType={formFieldTypes.PHONE_INPUT}
        name="emergencyContactNumber"
        placeholder="+234 803 433 4444"
        label="Emergency Contact Number"
       
        control={form.control}/>
        </div>


        <section className="space-y-6">
            
            <h2 className="mb-9 space-y-1">
            <p className="sub-header">Medical Information</p>
            </h2>
        </section>


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

        <div className="flex flex-col gap-6 xl:flex-row">

        <CustomFormField
        fieldType={formFieldTypes.INPUT}
        name="insuranceProvider"
        placeholder="BlueCross BlueShield"
        label="Insurance Provider"
        control={form.control}/>

        <CustomFormField
        fieldType={formFieldTypes.INPUT}
        name="insurancePolicyNumber"
        placeholder="ABC12345678"
        label="Insurance Policy Number"

        control={form.control}/>
        </div>


        <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField
        fieldType={formFieldTypes.TEXTAREA}
        name="allergies"
        placeholder="Peanuts, Penicillin"
        label="Allergies (If any)"

        control={form.control}/>

        <CustomFormField
        fieldType={formFieldTypes.TEXTAREA}
        name="currentMedication"
        placeholder="Paracetamol 500g"
        label="Current Medication (If Any)"

        control={form.control}/>
        
        
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField
        fieldType={formFieldTypes.TEXTAREA}
        name="familyMedicalHistory"
        placeholder="family Medical History"
        label="Family Medical History"

        control={form.control}/>

        <CustomFormField
        fieldType={formFieldTypes.TEXTAREA}
        name="pastMedicalHistory"
        placeholder="past medical history"
        label="Past Medical History"

        control={form.control}/>
        
        
        </div>

        <section className="space-y-6">
            
            <h2 className="mb-9 space-y-1">
            <p className="sub-header">Identification and Verification</p>
            </h2>
        </section>


        <CustomFormField
        fieldType={formFieldTypes.SELECT}
        name="identificationType"
        placeholder="Select an Identification Type"
        label="Identification Type"
        control={form.control}>
          {IdentificationTypes.map((type)=> (
            <SelectItem key={type} value={type}>

              {type}
            </SelectItem>
          ))}

        </CustomFormField>

        <CustomFormField
        fieldType={formFieldTypes.INPUT}
        name="identificationNumber"
        placeholder="123458780"
        label="Identification Document Number"
        control={form.control}/>


<CustomFormField
        fieldType={formFieldTypes.SKELETON}
        name="identificationDocument"
       
        label="Scanned Copy of Identification Document"
        
        control={form.control}

        renderSkeleton={(field) => (
          <FormControl>

            <FileUploader files={field.value} onChange={field.onChange}/>

          </FormControl>

        )}
        
        />

      <section className="space-y-6">
            
            <h2 className="mb-9 space-y-1">
            <p className="sub-header">Consent and Privacy</p>
            </h2>
        </section>

        <CustomFormField
        fieldType={formFieldTypes.CHECKBOX}
        name="treatmentConsent"
       
        label="I consent to treatment"
        control={form.control}/>

        <CustomFormField
        fieldType={formFieldTypes.CHECKBOX}
        name="disclosureConsent"
       
        label="I consent to disclosure of information"
        control={form.control}/>

        <CustomFormField
        fieldType={formFieldTypes.CHECKBOX}
        name="privacyConsent"
       
        label="I consent to privacy policy"
        control={form.control}/>

        
        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
)
}
export default RegisterForm