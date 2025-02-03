"use client"

import { useState, } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import DashboardLayout from "@/app/dashboard/layout"
// import { toast } from "@/components/hooks/use-toast"
import { toast } from "sonner"
import { toast as reactToast } from 'react-hot-toast';
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { 
  CreateUserFormSchema, 
} from '@/app/libraries/definitions'
import axios from "axios"
import  { useRouter } from "next/navigation"


export default function CreateUserForm() {

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof CreateUserFormSchema>>({
    resolver: zodResolver(CreateUserFormSchema),
    defaultValues: {
      first_name: "",
      email: "",
      password: "",
      password_confirm: "",
    },
  })

  async function onSubmit(data: z.infer<typeof CreateUserFormSchema>) {

    const response = await axios.post(`/api/users`, {
      first_name: data.first_name,
      email: data.email,
      password: data.password,
      role: "USER",
    });

    if(response.data?.error) {
      setLoading(false);
      console.log(response.data.error)
    } else {
      setLoading(false);
      reactToast.success('Utilisateur créé avec succès !');
      toast.success("Utilisateur créé avec succès");

      router.push("/dashboard/users/list");
    }
  }

  return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6 mt-10 mx-auto justify-center">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom d&apos;utilisateur</FormLabel>
                <FormControl>
                  <Input placeholder="Nom complet" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>

            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="_____@___.__" {...field} />
                </FormControl>
                {/* <FormDescription>
                  Le code 
                </FormDescription> */}
                <FormMessage />
              </FormItem>

            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                  <Input placeholder=".........." {...field} />
                </FormControl>
                {/* <FormDescription>
                  Le code 
                </FormDescription> */}
                <FormMessage />
              </FormItem>

            )}
          />

          <FormField
            control={form.control}
            name="password_confirm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmer le mot de passe</FormLabel>
                <FormControl>
                  <Input placeholder="..........." {...field} />
                </FormControl>
                {/* <FormDescription>
                  Le code 
                </FormDescription> */}
                <FormMessage />
              </FormItem>

            )}
          />
          <Button type="submit">Enregistrer</Button>
        </form>
      </Form>
  )
}
