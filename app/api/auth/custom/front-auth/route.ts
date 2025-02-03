// import type { NextARequest, NextApiResponse } from "next";
import bcrypt from 'bcrypt';
import MyPrismaClient from '@/prisma/prismaClient';
import { NextRequest, NextResponse } from 'next/server';
import { SignJWT, jwtVerify } from "jose";

const secretKey = "someLetters1234567890@And@NumbersABCDEFGHToHash";
const key = new TextEncoder().encode(secretKey);

async function encrypt(payload: any) {
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("10 sec from now")
      .sign(key);
} 
  

export async function POST( req: any) {
    const body = await req.json();
    const { email, password } = body;

    if(!email || !password) {
        return NextResponse.json({ error: 'Veuillez renseigner tous les champs svp !', status: 400 });
    }

    const existsUser: any = await MyPrismaClient.user.findUnique({
        where: {
            email: email,
        }
    });

    if(!existsUser?.id) {
        return NextResponse.json({ error: "Un compte correspond déjà à cette adresse email", status: 400 });
    }


    const passwordVerified = await bcrypt.compare(
        password,
        existsUser?.password
    );

    if(!passwordVerified) {
        return NextResponse.json({ error: "Mot de passe incorrect", status: 400 });
    }

    // Encrypt the session
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const sessionToken = await encrypt({ existsUser, expires })
    return NextResponse.json( { message: "SUCCESS", user: existsUser, token: sessionToken } );
}