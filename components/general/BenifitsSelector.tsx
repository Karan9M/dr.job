import { benefits } from "@/app/utils/listOfBenifits";
import { Badge } from "../ui/badge";
import { ControllerRenderProps } from "react-hook-form";

interface iAppProps {
    field: ControllerRenderProps
}

export default function BenifitsSelector({ field }: iAppProps) {

    function toggleBenifits(benifitId: string) {
        const currentBenifit = field.value || [];
        const newBenifit = currentBenifit.includes(benifitId) ? currentBenifit.filter((id: string) => id !== benifitId) : [...currentBenifit, benifitId];

        field.onChange(newBenifit)
    }

    return (
        <div>
            <div className="flex flex-wrap gap-3">

                {benefits.map((benefit) => {
                    const isSelected = (field.value || []).includes(benefit.id)
                    return (
                        <Badge key={benefit.id} variant={isSelected?"default":"outline"} className="cursor-pointer transition-all hover:scale-105 p-2 active:scale-95 px-4 py-1.5 text-sm rounded-full"
                            onClick={() => toggleBenifits(benefit.id)}
                        >
                            <span className="flex items-center gap-2">
                                {benefit.icon}
                                {benefit.label}
                            </span>
                        </Badge>
                    )
                })}
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
                Selected Benifits : <span className="text-primary">{(field.value || []).length}</span>
            </div>
        </div>
    )
}
