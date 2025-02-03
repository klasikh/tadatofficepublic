import MyPrismaClient from "@/prisma/prismaClient";
import { getSession } from "next-auth/react";
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers'
import path from "path";
import { writeFile } from "fs";


export async function GET(request: NextRequest) {

  try {

    const session = await getSession();

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")?.toString();

    if (request.method === "GET") {
        // console.log(userId)
        if(userId) {
            let user = await MyPrismaClient.user.findUnique({
                where: {
                    id: userId.toString(),
                },
            });

            if(user) {
                return NextResponse.json({
                    message: "SUCCESS",
                    user: user
                });
            }else {
                return NextResponse.json({ error: "Aucun utilisateur trouvé", status: 400 });
            }

        } else {
            return new NextResponse('Aucune ID renseignée !', { status: 400 });
        }

    } else {
      throw new Error(
        `The HTTP ${request.method} method is not supported at this route.`,
      );
    }
  }
  catch (error) {
    return NextResponse.json({error: "Une erreur s'est produite"}, { status: 500 });
  }

}

export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")?.toString();

    const user = await MyPrismaClient.user.findUnique({
        where: { id: userId }
    });

    if(!user) {
        return NextResponse.json({ error: "Aucune utilisateur trouvé" }, { status: 404 });
    }

    await MyPrismaClient.user.delete({
        where: { id: userId }
    });

    return NextResponse.json({ data: "Suppression effectuée" });
}
