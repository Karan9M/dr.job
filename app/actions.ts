"use server"

import { requireUser } from "./utils/requireUser"
import {z} from 'zod'
import { companySchema, jobSeekerSchema } from "./utils/zodSchemas";
import { prisma } from "./utils/db";
import { redirect } from "next/navigation";

export async function CreateCompany(data:z.infer<typeof companySchema>) {
    
    const session = await requireUser();
    const validateData = companySchema.parse(data);

    await prisma.user.update({
        where: {
            id: session?.id
        },
        data: {
            onboardingCompleted:true,
            userType:"COMPANY",
            Company:{
                create:{
                    ...validateData,
                }
            }
        }
    })
    return redirect('/')
}


export async function createJobSeeker(data:z.infer<typeof jobSeekerSchema>) {
    const user = await requireUser();
    const validateData = jobSeekerSchema.parse(data);

    await prisma.user.update({
        where: {
            id: user?.id as string
        },
        data: {
            onboardingCompleted:true,
            userType:"JOBSEEKER",
            JobSeeker:{
                create:{
                    ...validateData
                }
            }
        }
    })
    return redirect('/')
}