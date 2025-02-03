"use client"
import { FC } from 'react';
import { useFormState, useFormStatus } from 'react-dom'
import PageWrapper from "@/components/wrapper/page-wrapper";
import config from "@/config";
import { SignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { officeRegister } from "@/app/api/auth/custom/auth-custom"

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { 
  SignupOfficeCustomFormSchema, 
} from '@/app/libraries/definitions'
import Image from "next/image"


export type IForm = z.infer<typeof SignupOfficeCustomFormSchema>;

interface ISignupForm {}

const SignUpPage: FC<ISignupForm> = () =>  {
    const router = useRouter()
  
    // if (!config?.auth?.enabled || !config?.authCustom?.enabled) {
    //   router.back()
    // }
    
      const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<IForm>({ resolver: zodResolver(SignupOfficeCustomFormSchema) });
      
      const onSubmitReady = async (data: IForm) => {
        
        const res = await officeRegister({
            name: data.name,
            email: data.email,
            password: data.password,
            // callbackUrl: '/auth/signin',
            // redirect: false,
        }).then((response) =>  {
          console.log(response)
          // if (response?.errors) {
          //     return toast.error(response?.errors);
          // } else {
          //   toast.success('Connexion effectuée avec succès !');
            toast.success('Inscription effectuée avec succès !');
          //   router.push('/home');
          // }
        }).catch((e) =>  {
          // console.log(e)
        });
      };

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
              <Image 
                className="w-8 h-8 mr-2" 
                src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" 
                alt="logo" 
                width={80}
                height={80}
              />
              TADAT Office
          </a>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                  <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                      Inscription
                  </h1>

                  { config?.auth?.enabled && 
                    (
                <SignUp fallbackRedirectUrl="/" signInFallbackRedirectUrl="/dashboard" />)
        
        
            }
                {
                    config?.authNextAuth?.enabled &&
                    (
                        <form onSubmit={handleSubmit(onSubmitReady)} className="max-w-sm mx-auto">

<div className="mb-5">
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom complet</label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z"/>
                <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z"/>
              </svg>
            </div>
            <input type="text" id="name" {...(register('name'))} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John Doe" />
          </div>
          { errors?.name && <p className="ms-1 text-sm text-red-600 dark:text-red-500"><span className="font-medium">{ errors?.name.message }</span></p> }
        </div>

        <div className="mb-5">
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z"/>
                <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z"/>
              </svg>
            </div>
            <input type="text" id="email" {...(register('email'))} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="_____@___.__" />
          </div>
          { errors?.email && <p className="ms-1 text-sm text-red-600 dark:text-red-500"><span className="font-medium">{ errors?.email.message }</span></p> }
        </div>

        <div className="mb-5">
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mot de passe</label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z"/>
                <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z"/>
              </svg>
            </div>
            <input type="password" id="password" {...(register('password'))} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
          </div>
          {errors?.password && (
            <div className="ms-1">
              <p className="text-sm text-gray-700">Le mot de passe doit contenir :</p>
              <ul className="ms-4 text-sm text-red-600 dark:text-red-500">
              {errors.password?.message}
                {/* {errors.password?.message.map((error :any) => (
                  <li key={error}  className="font-medium">- {error}</li>
                ))} */}
              </ul>
            </div>
          )}
        </div>

        <SubmitButton />
      </form>
                    )
                }
                

                </div>
      </div>
  </div>
</section>
    );
}

function SubmitButton() {
    const { pending } = useFormStatus()
  
    return (
        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" disabled={pending} >S&apos;inscrire</button>
    )
  }
  

export default SignUpPage;