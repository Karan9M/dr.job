import { saveJobPost, UnsaveJobPost } from "@/app/actions";
import arcjet, { detectBot } from "@/app/utils/arcjet";
import { auth } from "@/app/utils/auth";
import { prisma } from "@/app/utils/db";
import { benefits } from "@/app/utils/listOfBenifits";
import JsonToHtml from "@/components/general/JsonToHtml";
import { SaveJobButton } from "@/components/general/SubmitButtons";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { request, tokenBucket } from "@arcjet/next";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const aj = arcjet.withRule(
    detectBot({
        mode: 'DRY_RUN',
        allow: ['CATEGORY:SEARCH_ENGINE', "CATEGORY:PREVIEW"],
    })
)
function getClient(session: boolean) {
    if (session) {
        return aj.withRule(
            tokenBucket({
                mode: 'LIVE',
                capacity: 100,
                interval: 60,
                refillRate: 30
            })
        )
    }
    else {
        return aj.withRule(
            tokenBucket({
                mode: 'LIVE',
                capacity: 100,
                interval: 60,
                refillRate: 10
            })
        )
    }
}


async function getJob(jobId: string,useId?:string) {

    const [jobData,savedJob] = await Promise.all([
       await prisma.jobPost.findUnique({
                where: {
                    status: "ACTIVE",
                    id: jobId
                },
                select: {
                    jobTitle: true,
                    jobDescription: true,
                    location: true,
                    employementType: true,
                    benifits: true,
                    createdAt: true,
                    listingDuration: true,
                    Company: {
                        select: {
                            name: true,
                            logo: true,
                            location: true,
                            about: true
                        }
                    }
                },
            }),
            
            useId ? 
            prisma.savedJobPosts.findUnique({
                where: {
                    userId_jobPostId : {
                        userId: useId,
                        jobPostId: jobId
                    }
                },
                select:{
                    id: true,
                }
            })
            :null
    ])
    if (!jobData) {
        return notFound()
    }
    return {
        jobData, savedJob
    }
}

type Params = Promise<{ jobId: string }>

export default async function page({ params }: { params: Params }) {
    const { jobId } = await params

    const session = await auth()

    const req = await request()
    const decision = await getClient(!!session).protect(req, {
        requested: 10
    });

    if (decision.isDenied()) {
        throw new Error("forbidden")
    }

    const {jobData:data,savedJob} = await getJob(jobId,session?.user?.id)
    return (
        <div className="grid lg:grid-cols-3 gap-8 mt-10">
            <div className="space-y-8 col-span-2">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">{data?.jobTitle}</h1>
                        <div className="flex items-center gap-2 mt-2">
                            <p className="font-medium">{data?.Company?.name}</p>
                            <span className="hidden md:inline text-muted-foreground">
                                *
                            </span>
                            <Badge className="rounded-full" variant={"secondary"}>
                                {data?.employementType}
                            </Badge>
                            <span className="hidden md:inline text-muted-foreground">
                                *
                            </span>
                            <Badge className="rounded-full">
                                {data?.location}
                            </Badge>
                        </div>
                    </div>
                    {session?.user ? (
                        <form action={
                            savedJob ? UnsaveJobPost.bind(null,savedJob.id) : saveJobPost.bind(null,jobId)
                        }>
                            <SaveJobButton savedJob={!!savedJob}/>
                        </form>
                    ) :
                        <Link className={buttonVariants({variant:"outline"})} href={'/login'}>
                            <Heart className="size-4" />
                            Save Job
                        </Link>
                    }
                </div>

                <section>
                    <JsonToHtml json={JSON.parse(data?.jobDescription as string)} />
                </section>
                <section>
                    <h3 className="font-semibold mb-4">Benifits{" "}<span className="text-sm text-muted-foreground font-normal">(Green is Offred)</span></h3>
                    <div className="flex flex-wrap gap-3">
                        {benefits.map((benifit) => {
                            const isOffered = data?.benifits.includes(benifit.id)
                            return (
                                <Badge key={benifit.id} variant={isOffered ? "default" : "outline"}
                                    className={cn(isOffered ? '' : 'opacity-75 cursor-not-allowed', 'text-sm px-4 py-1.5 rounded-full')}
                                >
                                    <span className="flex items-center gap-2">
                                        {benifit.icon}
                                        {benifit.label}
                                    </span>
                                </Badge>
                            )
                        })}
                    </div>
                </section>
            </div>

            <div className="space-y-6">
                <Card className="p-6">
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold">Apply Now</h3>
                            <p className="text-sm text-muted-foreground mt-1">Please let {data?.Company?.name} know you found this job on Dr.Job. This helps us grow!</p>
                        </div>
                        <Button className="w-full">Apply Now</Button>
                    </div>
                </Card>
                {/* job details card  */}
                <Card className="p-6">
                    <h3 className="font-semibold">About The Job</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Apply Before</span>
                            <span className="text-sm">
                                {
                                    new Date(
                                        data?.createdAt.getTime() +
                                        data?.listingDuration * 24 * 60 * 60 * 1000
                                    ).toLocaleDateString("en-US", {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Posted On</span>
                            <span className="text-sm">{data?.createdAt.toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                            })}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Employment Type</span>
                            <span className="text-sm">{data?.employementType}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Location</span>
                            <span className="text-sm">{data?.location}</span>
                        </div>
                    </div>
                </Card>
                {/* Company card  */}
                <Card className="p-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Image src={data?.Company?.logo || ""} alt="company logo" width={48} height={48} className="rounded-full size-12" />
                            <div className="flex flex-col">
                                <h3 className="font-semibold">{data?.Company?.name}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-3">{data?.Company?.about}</p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
