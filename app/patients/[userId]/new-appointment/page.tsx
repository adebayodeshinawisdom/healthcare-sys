import AppointmentForm from "@/components/forms/AppointmentForm";
import PatientForm from "@/components/forms/PatientForm";
import { Button } from "@/components/ui/button";
import { getPatient } from "@/lib/actions/patient.actions";
import Image from "next/image";
import Link from "next/link";


const Appointment = async({ params: {userId} }: SearchParamProps) => {
  const patient = await getPatient(userId)
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container">

            <div className="sub-container max-w-[860px] flex-1 flex-col py-10">

                <Image
                  src="/assets/icons/logo-full.svg"
                  height={1000}
                  width={1000}
                  alt="patient"
                  className="mb-12 h-10 w-fit"

                />
              <AppointmentForm 
              type="create"
              userId={userId}
              patientId={patient.$id}
              />

             
                <p className="justify-items-end text-dark-600 xl:text-left">&copy; 2024 CarePulse</p>
              
            </div>

      </section>
      <Image 
      src="/assets/images/appointment-img.png"
      height={1000}
      width={1000}
      alt="patient"
      className="side-img max-w-[390px]"
      
      />
    </div>
  );
}

export default Appointment