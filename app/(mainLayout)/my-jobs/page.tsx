import { prisma } from "@/app/utils/db"
import { requireUser } from "@/app/utils/requireUser"
import CopyLink from "@/components/general/CopyLink"
import { EmptyState } from "@/components/general/EmptyState"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, PenBox, XCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

async function getJobs(useId: string) {
    const data = await prisma.jobPost.findMany({
        where: {
            Company: {
                userId: useId,
            },
        },
        select: {
            id: true,
            jobTitle: true,
            status: true,
            createdAt: true,
            Company: {
                select: {
                    name: true,
                    logo: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
    return data
}


export default async function MyJobsPage() {

    const session = await requireUser()

    const data = await getJobs(session?.id as string)
    return (
        <>
        {data.length === 0 ? (
            <EmptyState title="No job Post found" description="You dont have any job post yet"
            buttonText="Create job post now"
            href='/post-job'
            />
        ):(
            <Card>
                <CardHeader>
                    <CardTitle>My Jobs</CardTitle>
                    <CardDescription>Manage your job listing and applications here.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Logo</TableHead>
                                <TableHead>Company</TableHead>
                                <TableHead>Job Title</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((list)=>(
                                <TableRow key={list.id}>
                                    <TableCell>
                                        <Image src={list.Company?.logo ?? ""} alt={"logo of company"} width={40} height={40}
                                        className="rounded-md size-10"
                                        />
                                    </TableCell>
                                    <TableCell>{list.Company?.name}</TableCell>
                                    <TableCell>{list.jobTitle}</TableCell>
                                    <TableCell>{list.status.charAt(0).toUpperCase() + list.status.slice(1).toLowerCase()}</TableCell>
                                    <TableCell>{list.createdAt.toLocaleDateString('en-US',{
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant={"ghost"} size={"icon"}>
                                                    <MoreHorizontal/>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>
                                                    Actions
                                                </DropdownMenuLabel>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/my-jobs/${list.id}/edit`}>
                                                    <PenBox/>
                                                    Edit Job
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <CopyLink jobUrl={`${process.env.NEXT_PUBLIC_URL}/job/${list.id}`}/>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator/>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/my-jobs/${list.id}/delete`}>
                                                    <XCircle/>
                                                    Delete Job
                                                    </Link>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        )}
        </>
    )
}
