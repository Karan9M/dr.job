import { deleteJob } from "@/app/actions";
import { requireUser } from "@/app/utils/requireUser";
import GenralSubmitButton from "@/components/general/SubmitButtons";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, TrashIcon } from "lucide-react";
import Link from "next/link";

type Params = Promise<{jobId:string}> 

export default async function DeleteJob({params}:{params:Params}) {
    const {jobId} = await params
    await requireUser();
    return (
        <div>
            <Card className="max-w-lg mx-auto mt-28">
                <CardHeader>
                    <CardTitle>Are you absoluty sure?</CardTitle>
                    <CardDescription>
                        This action can not be your undone.
                        This will bw permenantly delete your job listing and remove all of your data from our servers.
                    </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between items-center">
                    <Link href={'/my-jobs'} className={buttonVariants({variant:"secondary"})}>
                        <ArrowLeft />
                        Cancel
                    </Link>
                    <form action={async()=>{
                        'use server'
                        await deleteJob(jobId);
                    }}>
                        <GenralSubmitButton text="Delete Job" variant={"destructive"} icon={<TrashIcon/>}/>
                    </form>
                </CardFooter>
            </Card>
        </div>
    )
}
