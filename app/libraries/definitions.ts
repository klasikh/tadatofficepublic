import { z } from 'zod'

export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Doit contenir au moins 3 caractères.' })
    .trim(),
  email: z.string().email({ message: 'Adresse email invalide.' }).trim(),
  password: z
    .string()
    .min(8, { message: 'au moins 8 caractères' })
    .regex(/[a-zA-Z]/, { message: 'au moins une lettre.' })
    .regex(/[0-9]/, { message: 'au moins un nombre.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'au moins un caractère spécial.',
    })
    .trim(),
})

export const SignupOfficeCustomFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Doit contenir au moins 3 caractères.' })
    .trim(),
  email: z.string().email({ message: 'Adresse email invalide.' }).trim(),
  password: z
    .string()
    .min(8, { message: 'au moins 8 caractères' })
    .regex(/[a-zA-Z]/, { message: 'au moins une lettre.' })
    .regex(/[0-9]/, { message: 'au moins un nombre.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'au moins un caractère spécial.',
    })
    .trim(),
})

export const CreateUserFormSchema = z .object({
      first_name: z.string({required_error: "Le nom complet est requis",})
        .min(1, { message: 'Nom complet est requis' }),
      // surname: z.string().min(1, { message: 'Prénoms est requis' }),
      email: z.string({required_error: "Adresse email est requise",})
      .email({ message: 'Adresse email est requise' }),
      password: z.string({
        required_error: "Mot de passe est requis",
        invalid_type_error: "Doit contenir au moins 8 caratères",
      }).min(8, { message: 'Doit contenir au moins 8 caratères' }),
      password_confirm: z.string({
        required_error: "Confirmé mot de passe est requis",
        invalid_type_error: "Doit contenir au moins 8 caratères",
      }).min(8, { message: 'Doit contenir au moins 8 caratères' }),
  })
  .refine((data) => data.password === data.password_confirm, {
      message: "Les mots de passes ne sont pas identiques",
      path: ['password_confirm'],
  })

export const SigninOfficeCustomFormSchema = z.object({
    email: z.string().email({ message: 'Adresse email invalide.' }).trim(),
    password: z
      .string()
      .min(8, { message: 'Doit contenir au moins 8 caractères' })
      // .regex(/[a-zA-Z]/, { message: 'au moins une lettre.' })
      // .regex(/[0-9]/, { message: 'au moins un nombre.' })
      // .regex(/[^a-zA-Z0-9]/, { message: 'au moins un caractère spécial.',})
      .trim(),
  })
  
export type SignupFormState =
  | {
      errors?: {
        name?: string[]
        email?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined

export type SignupOfficeCustomFormState =
  | {
      errors?: {
        name?: string[]
        email?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined

export type SigninOfficeCustomFormState =
  | {
      errors?: {
        email?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined
