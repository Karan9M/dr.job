import { prisma } from "@/app/utils/db"
import { requireUser } from "@/app/utils/requireUser"
import EditJobForm from "@/components/forms/EditJobForm"
import { notFound } from "next/navigation"

async function getData(jobId:string,userId:string) {
  const data = await prisma.jobPost.findUnique({
    where: {
      id:jobId,
      Company:{
        userId:userId
      },
    },
    select:{
      benifits:true,
      id:true,
      jobTitle:true,
      jobDescription:true,
      location:true,
      salaryFrom:true,
      salaryTo:true,
      employementType:true,
      listingDuration: true,
      Company:{
        select:{
          about:true,
          name:true,
          logo:true,
          location:true,
          website:true,
          xAccount:true,
        }
      }
    }
  })
  if(!data){
    return notFound()
  }
  return data
}

type Params = Promise<{jobId:string}>

export default async function page({params}:{params:Params}) {
  const {jobId} = await params;
  const session = await requireUser()
  const data = await getData(jobId,session?.id as string)
  return (
    <EditJobForm jobPost={data}/>
  )
}
