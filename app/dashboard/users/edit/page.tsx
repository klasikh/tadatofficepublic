"use client"

import { useEffect, useState, } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import DashboardLayout from "@/app/dashboard/layout"
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
import  { useParams, useRouter } from "next/navigation"


type UserType = {
    id: string;
    first_name: string;
    email: string;
};
  
  
export default function EditUserForm() {

    const params = useParams()
    const router = useRouter();

    const userId = params.id;

    const [theUser, setTheUser] = useState<UserType>();
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
    const fetchTheUser = async () => {
        setLoading(true);
        const response = await axios.get(`/api/users/id`, {
          params: {
            userId: userId
          }
        });
        console.log(response)
        if(response.data?.error) {
          setLoading(false);
          console.log(response.data.error)
        } else {
          setLoading(false);
          setTheUser(response.data?.facture);
        }
    }

    async function onSubmit(data: z.infer<typeof CreateUserFormSchema>) {

        const response = await axios.put(`/api/users/edit/`, {
            first_name: data.first_name,
            email: data.email,
            password: data.password,
            role: "USER",
        });

        if(response.data?.error) {
            setLoading(false);
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
                    {/* <FormDescription>
                    Le code 
                    </FormDescription> */}
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
