"use client"
import { FC, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom'
import PageWrapper from "@/components/wrapper/page-wrapper";
import config from "@/config";
import { SignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast as reactToast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { officeLogin } from "@/app/api/auth/custom/auth-custom"

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { 
  SigninOfficeCustomFormSchema, 
} from '@/app/libraries/definitions'
import Image from "next/image"
import Logo from "@/assets/images/tadat_favicon.ico";


export type IForm = z.infer<typeof SigninOfficeCustomFormSchema>;

interface ILoginForm {}


const SignInPage: FC<ILoginForm> = () => {
  const router = useRouter()
  
  const [loading, setLoading] = useState(false);

  // if (!config?.auth?.enabled || !config?.authCustom?.enabled) {
  //   router.back()
  // }
  
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<IForm>({ resolver: zodResolver(SigninOfficeCustomFormSchema) });
    
    const onSubmitReady = async (data: IForm) => {
      setLoading(true); 
      const res = await signIn('office-login', {
          email: data.email,
          password: data.password,
          callbackUrl: '/',
          redirect: false,
      }).then((response) =>  {
        // console.log(response)
        if (response?.error) {
          setLoading(false);
          return reactToast.error(response?.error);
        } else {
          setLoading(false);
          reactToast.success('Connexion effectuée avec succès !');
          router.push('/dashboard');
        }
      }).catch((e) =>  {
          setLoading(false);
          // console.log(e)
      });
    };

    return (
      <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
              <Image 
                className="w-8 h-8 mr-2" 
                src={Logo}
                alt="logo" 
                width={80}
                height={80}
              />
              TADAT DGI
          </a>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                  <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                      Connexion
                  </h1>
                { config?.auth?.enabled && 
                    (<SignIn fallbackRedirectUrl="/" signUpFallbackRedirectUrl="/dashboard" />)
                }
                {
                    config?.authNextAuth?.enabled &&
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
              <ul className="ms-4 text-sm text-red-600 dark:text-red-500">
              {errors.password?.message}
                {/* {errors.password?.message.map((error :any) => (
                  <li key={error}  className="font-medium">- {error}</li>
                ))} */}
              </ul>
            </div>
          )}
        </div>

        <div className="mb-5">
          {
            loading
            ? (
              <button type="submit" className="w-full flex text-center justify-center items-center cursor-pointer rounded-lg border border-primary p-4 text-white transition hover:bg-opacity-80">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></div> &nbsp;
                Connexion en cours..
              </button>
            )
            : (
              <button type="submit" className="w-full cursor-pointer rounded-lg border border-primary p-4 text-white transition hover:bg-opacity-80">
                Se connecter
              </button>
            )
          }
        </div>

        {/* <SubmitButton /> */}
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
        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" disabled={pending}>Se connecter</button>
    )
  }
  

export default SignInPage;