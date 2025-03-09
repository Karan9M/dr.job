"use client"
import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { Heart, Loader2 } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GenralSubmitButtonProps {
    text: string;
    variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined
    width? : string;
    icon?:ReactNode
}

export default function GenralSubmitButton({ text , variant , width ,icon }: GenralSubmitButtonProps) {

    const { pending } = useFormStatus();

    return (
        <Button variant={variant} className={width} disabled={pending}>
            {pending ? (
                <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Submitting ...</span>
                </>
            ) : (
                <>
                {icon && <div>{icon}</div>}
                    <span>{text}</span>
                </>
            )}
        </Button>
    )
}


export function SaveJobButton({savedJob}:{savedJob:boolean}){
    const {pending} = useFormStatus()
    return(
        <Button variant={"outline"} type="submit" disabled={pending}>
            {pending ? (
                <>
                <Loader2 className="size-4 animate-spin"/>
                <span>Saving ...</span>
                </>
            ):(
                <>
                <Heart className={cn(
                    savedJob ? 'fill-current text-red-500' : '',
                    'size-4 transition-colors'
                )}/>
                {savedJob ? 'Saved' :"Save Job"}
                </>
            )}  
        </Button>
    )
}