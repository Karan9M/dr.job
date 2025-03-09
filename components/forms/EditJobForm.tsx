"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { editJobPost } from "@/app/actions";
import { countryList } from "@/app/utils/countriesList";
import { jobPostSchema } from "@/app/utils/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { XIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import BenifitsSelector from "../general/BenifitsSelector";
import SalaryRangeSelector from "../general/SalaryRangeSelector";
import { UploadDropzone } from "../general/uploadThingReexported";
import JobDescriptionEditor from "../richTextEditor.tsx/JobDescriptionEditor";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Command, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "../ui/command";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";

interface iAppProps{
    jobPost: {
        jobTitle: string;
        employementType: string;
        location: string;
        salaryFrom: number;
        salaryTo: number;
        jobDescription: string;
        listingDuration: number;
        benifits: string[];
        id: string;
        Company: {
            location:string,
            xAccount:string | null,
            website:string
            logo:string,
            about:string,
            name:string
        } | null;
    }
 }

export default function EditJobForm({jobPost}:iAppProps) {

     const form = useForm<z.infer<typeof jobPostSchema>>({
            resolver: zodResolver(jobPostSchema),
            defaultValues: {
                benifits: jobPost.benifits,
                companyAbout: jobPost.Company?.about,
                companyLocation: jobPost.Company?.location,
                companyName: jobPost.Company?.name,
                companyLogo: jobPost.Company?.logo,
                companyWebsite: jobPost.Company?.website,
                companyXAccount: jobPost.Company?.xAccount || '',
                employementType: jobPost.employementType,
                jobDescription: jobPost.jobDescription,
                jobTitle: jobPost.jobTitle,
                listingDuration: jobPost.listingDuration,
                location: jobPost.location,
                salaryFrom: jobPost.salaryFrom,
                salaryTo: jobPost.salaryTo,
            }
        })

        const [pending,setPending] = useState(false)
            async function onSubmit(values:z.infer<typeof jobPostSchema>) {
                try {
                    setPending(true)
                    await editJobPost(values,jobPost.id)
                } catch (error) {
                    if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
                        console.log("Something went wrong");
                      }
                }
                finally{
                    setPending(false)
                }
            }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="col-span-1 lg:col-span-2 flex flex-col gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Job Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
                            <FormField
                                control={form.control}
                                name="jobTitle"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Job Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Job Title" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="employementType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Employment Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue
                                                        placeholder="Select Employment Type"
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>
                                                        Employment Type
                                                    </SelectLabel>
                                                    <SelectItem value="full-time">
                                                        Full Time
                                                    </SelectItem>
                                                    <SelectItem value="part-time">
                                                        Part Time
                                                    </SelectItem>
                                                    <SelectItem value="contract">
                                                        Contract
                                                    </SelectItem>
                                                    <SelectItem value="internship">
                                                        Internship
                                                    </SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Job Location</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue
                                                        placeholder="Select Location"
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <Command>
                                                    <CommandInput placeholder="Search country..." />
                                                    <CommandList>
                                                        <CommandGroup heading="Global">
                                                            <CommandItem value="worldwide" onSelect={() => field.onChange("worldwide")}>
                                                                <span>🌍</span>
                                                                <span className="pl-2">Worldwide/Remote</span>
                                                            </CommandItem>
                                                        </CommandGroup>
                                                        <CommandSeparator />
                                                        <CommandGroup heading="Countries">
                                                            {countryList.map((country) => (
                                                                <CommandItem key={country.code} value={country.name} onSelect={() => field.onChange(country.name)}>
                                                                    <span>{country.flagEmoji}</span>
                                                                    <span className="pl-2">{country.name}</span>
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormItem>
                                <FormLabel>Salary Range</FormLabel>
                                <FormControl>
                                    <SalaryRangeSelector control={form.control} minSalary={10000} maxSalary={1000000} step={2000} />
                                </FormControl>
                            </FormItem>
                        </div>
                        <FormField
                            control={form.control}
                            name="jobDescription"
                            render={({ field }) => (
                                <FormItem className="mt-5">
                                    <FormLabel>Job Description</FormLabel>
                                    <FormControl>
                                        <JobDescriptionEditor field={field as any} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="benifits"
                            render={({ field }) => (
                                <FormItem className="mt-5">
                                    <FormLabel>Benefits</FormLabel>
                                    <FormControl>
                                        <BenifitsSelector field={field as any} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Company information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="companyName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Company name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="companyLocation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company Location</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue
                                                        placeholder="Select Location"
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <Command>
                                                    <CommandInput placeholder="Search country..." />
                                                    <CommandList>
                                                        <CommandGroup heading="Global">
                                                            <CommandItem value="worldwide" onSelect={() => field.onChange("worldwide")}>
                                                                <span>🌍</span>
                                                                <span className="pl-2">Worldwide/Remote</span>
                                                            </CommandItem>
                                                        </CommandGroup>
                                                        <CommandSeparator />
                                                        <CommandGroup heading="Countries">
                                                            {countryList.map((country) => (
                                                                <CommandItem key={country.code} value={country.name} onSelect={() => field.onChange(country.name)}>
                                                                    <span>{country.flagEmoji}</span>
                                                                    <span className="pl-2">{country.name}</span>
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </SelectContent>
                                        </Select>
                                        <p className="text-primary text-xs">Already Selected</p>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <FormField
                                control={form.control}
                                name="companyWebsite"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company Website</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Company Website" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="companyXAccount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company X Account</FormLabel>
                                        <FormControl>
                                            <Input placeholder="@yourcompany" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="companyAbout"
                            render={({ field }) => (
                                <FormItem className="mt-5">
                                    <FormLabel>About Company</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Tell us something about your company" {...field}
                                            className="min-h-[120px]"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="companyLogo"
                            render={({ field }) => (
                                <FormItem className="mt-5">
                                    <FormLabel>Company Logo</FormLabel>
                                    <FormControl>
                                        <div>
                                            {field.value ? (
                                                <div className="relative w-fit">
                                                    <Image src={field.value} alt="Logo image" width={100} height={100}
                                                        className="rounded-lg"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant={"destructive"}
                                                        size={'icon'}
                                                        className="absolute -top-2 -right-2"
                                                        onClick={() => field.onChange("")}
                                                    >
                                                        <XIcon className="size-4" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <UploadDropzone endpoint={"imageUploader"} onClientUploadComplete={(res) => {
                                                    field.onChange(res[0].url);
                                                }}
                                                    onUploadError={(error) => {
                                                        console.log("Something went wrong", error);
                                                    }}
                                                    className="ut-button:bg-primary ut-button:text-white ut-button:hover:bg-primary/90 ut-label:text-muted-foreground ut-allowed-content:text-muted-foreground border-primary ut-button:cursor-pointer"
                                                />
                                            )}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>
                <Button type="submit" className="w-full" disabled={pending}>
                    {pending ? 'Submitting ...' : 'Edit Job Post'}
                </Button>
            </form>
        </Form>
    )
}
