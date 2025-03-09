import { prisma } from "@/app/utils/db";
import { stripe } from "@/app/utils/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";

export async function POST(req:Request) {
    const body = await req.text();
    const headersList = await headers();

    const signature = headersList.get("Stripe-Signature") as string

    let event : Stripe.Event;
    try{
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    }
    catch {
        return new Response("WebHook Error",{status:400})
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if(event.type === "checkout.session.completed" ){
        const customerId = session.customer

        const jobId = await session.metadata?.jobId
        if(!jobId){
            return new Response("Job ID not found",{status:400})
        }

        const comapny = await prisma.user.findUnique({
            where: {
                stripeCustromerId:customerId as string
            },
            select:{
                Company:{
                    select:{
                        id:true,
                    }
                }
            }
        })
        if(!comapny){
            return new Response("Company not found for User",{status:400})
        }
        await prisma.jobPost.update({
            where:{
                id:jobId,
                companyId:comapny?.Company?.id as string
            },
            data:{
                status:"ACTIVE"
            }
        })
    }
    return new Response(null,{status:200})
}