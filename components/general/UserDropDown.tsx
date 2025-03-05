import { ChevronDown, Heart, Layers2, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import Link from "next/link";
import { signOut } from "@/app/utils/auth";

interface iAppProps {
    email:string,
    name:string,
    image:string
}

export default function UserDropDown({email,image,name}:iAppProps) {
  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} className="h-auto p-0 hover:bg-transparent">
                <Avatar>
                    <AvatarImage src={image} alt="Profile-img"/>
                    <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                </Avatar>
                <ChevronDown size={16} strokeWidth={2} className="ml-2 opacity-60"/>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-58" align="end">
            <DropdownMenuLabel className="flex flex-col gap-1">
                <span className="text-sm font-medium text-foreground">{name}</span>
                <span className="text-xs text-muted-foreground">{email}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator/>
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link href={'/favorites'}>
                        <Heart color="red" size={16} strokeWidth={2} className="opacity-60"/>
                        <span>Favorite Jobs</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={'/my-jobs'}>
                        <Layers2 color="green" size={16} strokeWidth={2} className="opacity-60"/>
                        <span>My Job Listings</span>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator/>
            <DropdownMenuItem asChild>
               <form action={async()=>{
                "use server"
                await signOut({
                    redirectTo:'/'
                });
               }}>
                    <button className="flex w-full items-center gap-2">
                        <LogOut color="white" size={16} strokeWidth={2} className="opacity-60" />
                        <span>Logout</span>
                    </button>
               </form>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}
