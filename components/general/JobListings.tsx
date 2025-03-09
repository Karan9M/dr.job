import { prisma } from "@/app/utils/db";
import { EmptyState } from "./EmptyState";
import { JobCard } from "./JobCard";
import { PaginationComponent } from "./PaginationComponent";
import { JobPostStatus } from "@prisma/client";

async function getData({
  page = 1 , pageSize = 2,
  jobTypes = [],
  location = "",
}:{
  page?:number
  pageSize?:number,
  jobTypes:string[],
  location: string
}) {
  const skip = (page - 1 ) * pageSize

  const where = {
      status: JobPostStatus.ACTIVE,
      ...(jobTypes.length > 0 && {
        employementType : {
          in:jobTypes,
        }
      }),
      ...(location && location !== 'worldwide' && {
        location: location,
      }),
  }

    const [data,totalCount] = await Promise.all([
      prisma.jobPost.findMany({
        where:where,
        take:pageSize,
        skip:skip,
        select:{
          jobTitle:true,
          id:true,
          salaryFrom:true,
          salaryTo:true,
          employementType:true,
          location:true,
          createdAt:true,
          Company:{
            select:{
              name:true,
              logo:true,
              location:true,
              about:true
            }
          }
        },
        orderBy:{
          createdAt:'desc'
        }
      }),
      prisma.jobPost.count({
        where:{
          status:'ACTIVE'
        }
      })
    ])
    return {
      jobs:data,
      totalPages : Math.ceil(totalCount/pageSize)
    };
}

export default async function JobListings({currentPage,jobTypes,location}:{currentPage:number,jobTypes:string[],location:string}) {
  const {jobs,totalPages} = await getData({page:currentPage,pageSize:2,jobTypes:jobTypes,location:location})
  return (
    <>
      {jobs.length > 0 ? (
        <div className="flex flex-col gap-6">
            {jobs.map((job)=>(
              <JobCard key={job.id} job={job}/>
            ))}
        </div>
      ):(
        <EmptyState title="No Jobs Found" description="Try searching for a diffrent job title or location"
        buttonText="Clear all filters"
        href="/"
        />
      )}

      <div className="flex justify-center mt-6">
          <PaginationComponent totalPages={totalPages} currentPage={currentPage}/>
      </div>
    </>
  )
}
