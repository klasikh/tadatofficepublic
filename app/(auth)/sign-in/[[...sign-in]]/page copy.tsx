"use client"
import { FC } from 'react';
import { useFormState, useFormStatus } from 'react-dom'
import PageWrapper from "@/components/wrapper/page-wrapper";
import config from "@/config";
import { SignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { officeLogin } from "@/app/api/auth/custom/auth-custom"

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { 
  SignupFormSchema, 
  SignupFormState, 
  SigninOfficeCustomFormSchema, 
  SigninOfficeCustomFormState 
} from '@/app/libraries/definitions'


export type IForm = z.infer<typeof SigninOfficeCustomFormSchema>;

interface ILoginForm {}


const SignInPage: FC<ILoginForm> = () => {
  const router = useRouter()
  
  if (!config?.auth?.enabled || !config?.authCustom?.enabled) {
    router.back()
  }
  
  // const [state, action] = useFormState(officeLogin, undefined)
    
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<IForm>({ resolver: zodResolver(SigninOfficeCustomFormSchema) });
    
    const onSubmitReady = async (data: IForm) => {
      
      const res = await officeLogin({
          email: data.email,
          password: data.password,
          callbackUrl: '/auth/signin',
          redirect: false,
      }).then((response) =>  {
        console.log(response)
        // if (response?.errors) {
        //     return toast.error(response?.errors);
        // } else {
        //   toast.success('Connexion effectuée avec succès !');
        //   router.push('/home');
        // }
      }).catch((e) =>  {
        // console.log(e)
      });
    };

    return (
        <PageWrapper >
            <div className="flex min-w-screen justify-center my-[5rem]">
                { config?.auth?.enabled && 
                    (<SignIn fallbackRedirectUrl="/" signUpFallbackRedirectUrl="/dashboard" />)
                }
                {
                    config?.authCustom?.enabled &&
                    (
                        <form onSubmit={handleSubmit(onSubmitReady)} className="max-w-sm mx-auto">

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
                {/* {errors?.password.map((error :any) => (
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
        </PageWrapper>
    );
}


function SubmitButton() {
    // const { pending } = useFormStatus()
  
    return (
        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" >Se connecter</button>
        // <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" disabled={pending}>Se connecter</button>
    )
  }
  

export default SignInPage;