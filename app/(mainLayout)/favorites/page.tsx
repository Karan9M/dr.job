import { prisma } from "@/app/utils/db";
import { requireUser } from "@/app/utils/requireUser";
import { EmptyState } from "@/components/general/EmptyState";
import { JobCard } from "@/components/general/JobCard";

async function getFavorites(userId:string) {
    const data = await prisma.savedJobPosts.findMany({
        where: {
            userId: userId,
        },
        select:{
            jobPost:{
                select:{
                    id:true,
                    jobTitle:true,
                    salaryFrom:true,
                    salaryTo:true,
                    employementType:true,
                    createdAt:true,
                    location:true,
                    Company:{
                        select:{
                            name:true,
                            logo:true,
                            location:true,
                            about:true
                        }
                    }
                }
            }
        }
    })
    return data;
}

export default async function FavoritesPage() {
    const session = await requireUser()
    const data = await getFavorites(session?.id as string)
    if(data.length === 0){
        return(
            <EmptyState title="No Favorites Found" description="You dont have any favorites yet." buttonText="Find a Job" href="/"/>
        )
    }
  return (
    <div className="grid grid-cols-1 mt-4 gap-4">
        {data.map((fav)=>(
            <JobCard key={fav.jobPost.id} job={fav.jobPost}/>
        ))}
    </div>
  )
}
