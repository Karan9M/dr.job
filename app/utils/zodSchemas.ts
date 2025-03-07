import {z} from "zod"

export const companySchema = z.object({
    name:z.string().min(2,"Company name must be atleast 2 charters long"),
    location: z.string().min(1,"Loaction must be defined"),
    about : z.string().min(10,"Please provode some basic info about your comapny"),
    logo:z.string().min(1,"Logo required"),
    website:z.string().url("Please enter a valid URL"),
    xAccount:z.string().optional(),
})


export const jobSeekerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  about: z.string().min(10, "Please provide more information about your self"),
  resume: z.string().min(1,"Please upload your resume"),
});


// const JobPostStatus = z.enum(["DRAFT", "PUBLISHED", "CLOSED"]); // Add more statuses if needed

export const jobPostSchema = z.object({


  jobTitle: z.string().min(2, "Job title is required"),
  employementType: z.string().min(1, "Employment type is required"),
  location: z.string().min(1, "Location is required"),
  salaryFrom: z.number().min(1,"Salary from is required"),
  salaryTo: z.number().min(1,"Salary to is frquired"),
  jobDescription: z.string().min(1, "Job description is required"),
  listingDuration: z.number().min(1,"Listing duration is required"),
  benifits: z.array(z.string()).min(1,"Please select atleast one benifits"),


  companyName:z.string().min(1,"Company name is required"),
  companyAbout:z.string().min(10,"Company description is required"),
  companyLocation:z.string().min(1,"Company Location is required"),
  companyLogo:z.string().min(1,"Company Logo is required"),
  companyWebsite:z.string().min(1,"Company website is required"),
  companyXAccount:z.string().optional(),
});