"use client"

import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
  import { Input } from "@/components/ui/input" 
  import {Control} from 'react-hook-form'
import { formFieldTypes } from "./forms/PatientForm"
import React, { useState } from "react"
import Image from "next/image"
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { E164Number } from 'libphonenumber-js';
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select"
import { Textarea } from "./ui/textarea"
import { Checkbox } from "./ui/checkbox"
import { Label } from "./ui/label"


  interface CustomeProps {

    control:Control<any>,
    fieldType: formFieldTypes,
    name: string, 
    label?:string,
    placeholder?:string,
    iconSrc?:string,
    iconAlt?:string,
    disabled?:boolean,
    dateFormat?:string,
    showTimeSelect?:boolean,
    children?:React.ReactNode,
    renderSkeleton?: (field:any) => React.ReactNode

  }
  const RenderFormInput = ({field, props}: {field:any, props:CustomeProps}) => {
    const {iconAlt, iconSrc, placeholder, name,fieldType, showTimeSelect, dateFormat, renderSkeleton } = props
   switch (fieldType) {
    case formFieldTypes.INPUT:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
            {iconSrc && (
              <Image 
              src={iconSrc}
              alt={iconAlt || 'icon'}
              height={24}
              width={24}
              className="ml-2"
              />
            )}
            <FormControl>
              <Input 
                 placeholder={placeholder}
                 {...field}
                 className="shad-input border-0"
              
              />


            </FormControl>

        </div>
      )

      case formFieldTypes.TEXTAREA:
        return(
          <FormControl>
            <Textarea
             placeholder={placeholder}
             {...field}
             className="shad-textArea"
             disabled={props.disabled}
            
            
            />

          </FormControl>
        )
      
      case formFieldTypes.PHONE_INPUT:
        return (
          <FormControl>
              <PhoneInput
              
              placeholder={placeholder}
              defaultCountry="US"
              international
              withCountryCallingCode
              value={field.value as E164Number | undefined}
              onChange={field.onChange}
              className="input-phone"
              />
              
          </FormControl>
        )
        case formFieldTypes.DATE_PICKER:
          return(
            <div className="flex rounded-md border border-dark-500 bg-dark-400">
              <Image 
              
              src="/assets/icons/calendar.svg"
              alt="calender"
              height={24}
              width={24}
              className="ml-2"
              
              />

              <FormControl>

                <DatePicker 
                selected={field.value}
                onChange={(date) => field.onChange(date)}
                dateFormat={dateFormat ?? 'MM/dd/yyyy'}
                showTimeSelect={showTimeSelect ?? false}
                timeInputLabel="Time:"
                wrapperClassName="date-picker"
                />
              </FormControl>


            </div>
          )

          case formFieldTypes.SELECT:
            return(
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>

                  <FormControl>
                    <SelectTrigger className="shad-select-trigger">
                    <SelectValue placeholder={placeholder}/>

                    </SelectTrigger>
                          

                          
                  </FormControl>
                  <SelectContent className="shad-select-content">
                            {props.children}
                          </SelectContent>
                </Select>
              </FormControl>
            )

          case formFieldTypes.SKELETON:
            return renderSkeleton ? renderSkeleton(field) : null

          case formFieldTypes.CHECKBOX:
            return(
              <FormControl>
                <div className="flex items-center gap-4">
                  <Checkbox 
                    id={props.name}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <Label htmlFor={props.name}
                  className="checkbox-label"
                  >
                    {props.label}
              
                  </Label>
                </div>
              </FormControl>
            )
          

      break;
   
    default:
      break;
   }
  }
const CustomFormField = ( props: CustomeProps) => {
  function Example() {
    // `value` will be the parsed phone number in E.164 format.
    // Example: "+12133734253".
  }
    const [value, setValue] = useState()
  const { control, fieldType, name, label  } = props
  return (
    <FormField
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem className="flex-1">
             {fieldType !== formFieldTypes.CHECKBOX && label && (
              <FormLabel>{label}</FormLabel>
             )}

              <RenderFormInput field={field} props={props}/>
              <FormMessage  className="shad-errro"/>
            </FormItem>
          )}
        />
       
  )
}

export default CustomFormField