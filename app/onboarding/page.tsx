import OnboardingForm from "@/components/forms/onboarding/OnboardingForm";
import { prisma } from "../utils/db";
import { redirect } from "next/navigation";
import { requireUser } from "../utils/requireUser";

async function checkUserHasFinishedOnboarding(userId:string){
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select:{
      onboardingCompleted:true
    }
  });
  if(user?.onboardingCompleted === true){
    return redirect('/')
  }
  return user
}


export default async function OnboardingPage() {
  const session = await requireUser()
  await checkUserHasFinishedOnboarding(session?.id as string)
  return (
    <div className="flex min-h-screen flex-col w-screen items-center justify-center py-10">
      <OnboardingForm/>
    </div>
  )
}
