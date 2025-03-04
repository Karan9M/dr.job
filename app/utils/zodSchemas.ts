import {z} from "zod"

export const companySchema = z.object({
    name:z.string().min(2,"Company name must be atleast 2 charters long"),
    location: z.string().min(1,"Loaction must be defined"),
    about : z.string().min(10,"Please provode some basic info about your comapny"),
    logo:z.string().min(1,"Logo required"),
    website:z.string().url("Please enter a valid URL"),
    xAccount:z.string().optional(),
})