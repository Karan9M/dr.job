"use server"

import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from 'zod';
import arcjet, { detectBot, shield } from "./utils/arcjet";
import { prisma } from "./utils/db";
import { inngest } from "./utils/inngest/client";
import { jobListingDurationPricing } from "./utils/jobListingDurationPricing";
import { requireUser } from "./utils/requireUser";
import { stripe } from "./utils/stripe";
import { companySchema, jobPostSchema, jobSeekerSchema } from "./utils/zodSchemas";

const aj = arcjet.withRule(
    shield({
        mode: 'LIVE',
    })
).withRule(
    detectBot({
        mode: 'LIVE',
        allow: []
    })
)

export async function CreateCompany(data: z.infer<typeof companySchema>) {

    const session = await requireUser();
    const req = await request()
    const decision = await aj.protect(req);

    if (decision.isDenied()) {
        throw new Error('ForBidden')
    }

    const validateData = companySchema.parse(data);

    await prisma.user.update({
        where: {
            id: session?.id
        },
        data: {
            onboardingCompleted: true,
            userType: "COMPANY",
            Company: {
                create: {
                    ...validateData,
                }
            }
        }
    })
    return redirect('/')
}


export async function createJobSeeker(data: z.infer<typeof jobSeekerSchema>) {
    const user = await requireUser();
    const req = await request()
    const decision = await aj.protect(req);

    if (decision.isDenied()) {
        throw new Error('ForBidden')
    }

    const validateData = jobSeekerSchema.parse(data);

    await prisma.user.update({
        where: {
            id: user?.id as string
        },
        data: {
            onboardingCompleted: true,
            userType: "JOBSEEKER",
            JobSeeker: {
                create: {
                    ...validateData
                }
            }
        }
    })
    return redirect('/')
}

export async function createJob(data: z.infer<typeof jobPostSchema>) {
    const user = await requireUser();
    const req = await request()
    const decision = await aj.protect(req)


    if (decision.isDenied()) {
        throw new Error('ForBidden')
    }


    const validateData = jobPostSchema.parse(data);
    const comapny = await prisma.company.findUnique({
        where: {
            userId: user?.id
        },
        select: {
            id: true,
            user: {
                select: {
                    stripeCustromerId: true
                }
            }
        }
    })
    if (!comapny?.id) {
        return redirect("/")
    }


    let stripeCustomerId = comapny.user.stripeCustromerId;



    if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
            email: user?.email as string,
            name: user?.name as string
        });
        stripeCustomerId = customer.id;

        //upadte user with stripe user id
        await prisma.user.update({
            where: {
                id: user?.id,
            },
            data: {
                stripeCustromerId: customer.id,
            },
        });
    }


    const jobPost = await prisma.jobPost.create({
        data: {
            jobDescription: validateData.jobDescription,
            jobTitle: validateData.jobTitle,
            employementType: validateData.employementType,
            location: validateData.location,
            salaryFrom: validateData.salaryFrom,
            salaryTo: validateData.salaryTo,
            listingDuration: validateData.listingDuration,
            benifits: validateData.benifits,
            companyId: comapny.id
        },
        select: {
            id: true
        }
    });

    const pricingTier = jobListingDurationPricing.find((tier) => tier.days === validateData.listingDuration);
    if (!pricingTier) {
        throw new Error("Invalid listing duration");
    }

    const session = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        line_items: [
            {
                price_data: {
                    product_data: {
                        name: `Job Posting - ${pricingTier.days} Days`,
                        description: pricingTier.description,
                        images: [
                            "https://j6n5mnf93j.ufs.sh/f/lD97zIJKG9tRcQNaKTSM9EdUOvL0xAnZzXK8Tk7QaC3sJBwr"
                        ]
                    },
                    currency: 'USD',
                    unit_amount: pricingTier.price * 100,
                },
                quantity: 1,
            }
        ],
        metadata: {
            jobId: jobPost.id,
        },
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_URL}/payment/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/payment/cancel`,
    })

    await inngest.send({
        name: 'job/created',
        data: {
            jobId: jobPost.id,
            expDays: validateData.listingDuration,
        }
    })


    return redirect(session.url as string)
}

export async function saveJobPost(jobId: string) {
    const user = await requireUser();
    const req = await request()
    const decision = await aj.protect(req)


    if (decision.isDenied()) {
        throw new Error('ForBidden')
    }

    await prisma.savedJobPosts.create({
        data: {
            jobPostId: jobId,
            userId: user?.id as string
        }
    });
    revalidatePath(`/job/${jobId}`)
}

export async function UnsaveJobPost(savedJobPost: string) {
    const user = await requireUser();
    const req = await request()
    const decision = await aj.protect(req)


    if (decision.isDenied()) {
        throw new Error('ForBidden')
    }

    const data = await prisma.savedJobPosts.delete({
        where: {
            id: savedJobPost,
            userId: user?.id
        },
        select: {
            jobPostId: true
        }
    });
    revalidatePath(`/job/${data.jobPostId}`)
}


export async function editJobPost(data: z.infer<typeof jobPostSchema>, jobId: string) {
    const user = await requireUser();
    const req = await request()
    const decision = await aj.protect(req)


    if (decision.isDenied()) {
        throw new Error('ForBidden')
    }

    const validateData = jobPostSchema.parse(data)

    await prisma.jobPost.update({
        where: {
            id: jobId,
            Company: {
                userId: user?.id as string
            }
        },
        data: {
            jobDescription: validateData.jobDescription,
            jobTitle: validateData.jobTitle,
            employementType: validateData.employementType,
            location: validateData.location,
            salaryFrom: validateData.salaryFrom,
            salaryTo: validateData.salaryTo,
            listingDuration: validateData.listingDuration,
            benifits: validateData.benifits,
        }
    });
    return redirect("/my-jobs")
}

export async function deleteJob(jobId: string) {
    const user = await requireUser();
    const req = await request()
    const decision = await aj.protect(req)


    if (decision.isDenied()) {
        throw new Error('ForBidden')
    }

    await prisma.jobPost.delete({
        where: {
            id: jobId,
            Company: {
                userId: user?.id
            }
        }
    });
    await inngest.send({
        name: 'job/cancel.expiration',
        data: {
            jobId: jobId
        }
    });
    return redirect('/my-jobs')
}