'use client'
import { Link2 } from "lucide-react";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { toast } from "sonner";

export default function CopyLink({jobUrl}:{jobUrl:string}) {

    async function handleCopy(){
        try {
            await navigator.clipboard.writeText(jobUrl);
            toast.success("URL copied to clipboard");
        } catch{
            toast.error("Failedto copy url")
        }
    }

  return (
    <DropdownMenuItem onSelect={handleCopy}>
        <Link2 className="size-4"/>
        <span>Copy Job URL</span>
    </DropdownMenuItem>
  )
}
