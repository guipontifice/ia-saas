"use client"
import * as z from "zod";
import axios from "axios";
import { Download, ImageIcon, MusicIcon } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { IFormSchema, formSchema } from "./constants";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Heading } from "@/src/components/heading";
import { Form, FormControl, FormField, FormItem } from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import Loader from "@/src/components/loader";
import { Empty } from "@/src/components/empty";
import { zodResolver } from "@hookform/resolvers/zod";

const MusicPage = () => {
    const router = useRouter();
  const [music, setMusic] = useState<string>() 

  const form = useForm<IFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  })
    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: IFormSchema) => {
        try {
          setMusic(undefined)  
          console.log(values)
            const response = await axios.post('/api/music', values)
            const urls = response.data.map((image: { url: string }) => image.url)
            setMusic(response.data.audio)
            form.reset()
        } catch (error: any) {
            console.log(error)
        } finally {
            router.refresh()
        }

    };
    return (
      <div>
        <Heading
          title="Music Generation"
          description="Turn your prompt into music."
          icon={MusicIcon}
          iconColor="text-emerald-500"
          bgColor="bg-emerald-500/10"
        />
  
        <div className="px-4 lg:px-8">
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
              >
                <FormField
                  name="prompt"
                  render={({ field }) => (
                    <FormItem className="col-span-12 lg:col-span-10">
                      <FormControl className="m-0 p-0">
                        <Input
                          className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                          disabled={isLoading}
                          placeholder="Piano solo"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
  
                <Button
                  className="col-span-12 lg:col-span-2 w-full"
                  disabled={isLoading}
                  type="submit"
                >
                  Generate
                </Button>
              </form>
            </Form>
          </div>
  
          <div className="space-y-4 mt-4">
            {isLoading && (
              <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
                <Loader />
              </div>
            )}
  
            {!music && !isLoading && <Empty label="No music generated." />}
  
            {music && (
              <audio controls className="w-full mt-8">
                <source src={music} />
              </audio>
            )}
          </div>
        </div>
      </div>
    )
  }

  export default MusicPage
  