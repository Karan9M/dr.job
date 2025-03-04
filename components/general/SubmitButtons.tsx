"use client"
import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

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
