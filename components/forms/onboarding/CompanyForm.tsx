import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { companySchema } from "@/app/utils/zodSchemas"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { countryList } from "@/app/utils/countriesList"
import { Textarea } from "@/components/ui/textarea"
import { UploadDropzone } from "@/components/general/uploadThingReexported"
import { CreateCompany } from "@/app/actions"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { XIcon } from "lucide-react"

export default function CompanyForm() {

  const [search, setSearch] = useState("");

  const form = useForm<z.infer<typeof companySchema>>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      about: "",
      location: "",
      logo: "",
      name: "",
      website: "",
      xAccount: ""
    }
  })

  const [pending, setPending] = useState(false);

  async function onSubmit(data: z.infer<typeof companySchema>) {
    //safe to use
    try {
      setPending(true)
      await CreateCompany(data);
    } catch (error) {
      if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
        console.log("Something went wrong");
      }
    } finally {
      setPending(false)
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comapny Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Comapny Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

<FormField
  control={form.control}
  name="location"
  render={({ field }) => {
    // Filter countries based on search input
    const filteredCountries = countryList.filter((country) =>
      country.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
      <FormItem>
        <FormLabel>Location</FormLabel>
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select Location" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Worldwide</SelectLabel>
              <SelectItem value="worldwide">
                <span>🌍</span>
                <span className="pl-2">Worldwide / Remote</span>
              </SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Select Location</SelectLabel>
              {/* Search Input */}
              <div className="px-2 pb-2">
                <Input
                  placeholder="Search country..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              {/* Display filtered countries */}
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country) => (
                  <SelectItem value={country.name} key={country.code}>
                    <span>{country.flagEmoji}</span>
                    <span className="pl-2">{country.name}</span>
                  </SelectItem>
                ))
              ) : (
                <p className="px-2 py-1 text-sm text-muted-foreground">
                  No country found
                </p>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    );
  }}
/>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Website</FormLabel>
                <FormControl>
                  <Input placeholder="https://yourcompany.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="xAccount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>X (Twitter) Account</FormLabel>
                <FormControl>
                  <Input placeholder="@yourcompany" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="about"
          render={({ field }) => (
            <FormItem>
              <FormLabel>About</FormLabel>
              <FormControl>
                <Textarea placeholder="Tell us about what your company does ..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem>
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

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? 'Submitting ...' : 'Continue'}
        </Button>
      </form>
    </Form>
  )
}
