"use server"

import MyPrismaClient from "@/prisma/prismaClient";
import NextAuth, { AuthOptions, NextAuthOptions } from "next-auth";
import bcrypt from "bcrypt";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import type { NextApiRequest, NextApiResponse } from "next";

import { 
  SignupOfficeCustomFormSchema, 
    SignupOfficeCustomFormState, 
    SigninOfficeCustomFormSchema, 
    SigninOfficeCustomFormState 
} from '@/app/libraries/definitions'

const secretKey = "someLetters1234567890@And@NumbersABCDEFGHToHash";
const key = new TextEncoder().encode(secretKey);

  export async function encrypt(payload: any) {
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("10 sec from now")
      .sign(key);
  } 
  
  export async function decrypt(input: string): Promise<any> {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    return payload;
  }
  
export async function officeLogin(req: any) {

    console.log(req);
    // 1. Validate form fields
    const validatedFields = SigninOfficeCustomFormSchema.safeParse({
      // email: req.get('email'),
      // password: req.get('password'),
      email: req.email,
      password: req.password,
    })

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }

    // Call the provider or db to create a user...
    const { email, password } = validatedFields.data
  
    // Verify credentials && get the user
    if (!email || !password) {
        throw new Error("Veuillez svp renseigner tous les champs");
        // res.status(401).send({ message: "Veuillez svp renseigner tous les champs" });

    }

    const userLogged: any = await MyPrismaClient.user.findUnique({
        where: {
            email: email,
        },
    });

    if(!userLogged?.id) {
        throw new Error("Aucun utilisateur trouvé");
        // res.status(401).send({ message: "Aucun utilisateur trouvé" });

    }

    const passwordVerified = await bcrypt.compare(
        password,
        userLogged?.password
    );

    if(!passwordVerified) {
        throw new Error("Mot de passe incorrect");
    }

    // Create the session
    let expires
    if(req.remember) {
        expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    } else {
        expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    }

    // 2. Encrypt the session ID
    const sessionToken = await encrypt({ userLogged, expires })
    
    let sessionData = await MyPrismaClient.session.create({
        data: {
            sessionToken: sessionToken,
            userId: userLogged?.id,
            expires: expires,
        },
      });

    const sessionId = sessionData.id

    // 3. Store the session in cookies for optimistic auth checks
    const cookieStore = (await cookies()).set('session', sessionToken, {
      httpOnly: true,
      secure: true,
      expires: expires,
      sameSite: 'lax',
      path: '/',
    })

    return { user: userLogged };
  }
  
    
export async function officeRegister( req: any) {

    console.log(req);
    // 1. Validate form fields
    const validatedFields = SignupOfficeCustomFormSchema.safeParse({
      name: req.name,
      email: req.email,
      password: req.password,
    })

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }

    // Call the provider or db to create a user...
    const { name, email, password } = validatedFields.data
  
    // Verify credentials && get the user
    if (!name || !email || !password) {
        throw new Error("Veuillez svp renseigner tous les champs");
        // res.status(401).send({ message: "Veuillez svp renseigner tous les champs" });

    }

    const userLogged = await MyPrismaClient.user.findUnique({
        where: {
            email: email,
        },
    });

    if(userLogged?.id) {
        throw new Error("Il existe déjà un compte avec cette adresse email");

    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    let sessionData = await MyPrismaClient.user.create({
      data: {
          first_name: name,
          email: email,
          password: hashedPassword,
      },
    });

    return { user: userLogged };
  }
  

  export async function logout() {
    // Destroy the session
    (await cookies()).set("session", "", { expires: new Date(0) });
  }
  