import bcrypt from 'bcrypt';
import MyPrismaClient from '@/prisma/prismaClient';
import { NextRequest, NextResponse } from 'next/server';



// GET /api/facture/all
export async function GET( request: any) {
  try {

    if (request.method === "GET") {
      // if (sessionToken && (session?.user?.role == "ADMIN" || session?.user?.role == "SUPERADMIN")) {
      // if (sessionToken) {

        let result ;

        // if(searchValue) {
        //   result = await MyPrismaClient.facture.findMany({
        //     where: {
        //       OR: [
        //         { codeMeCEF: { search : searchValue, } },
        //         { nim: { search : searchValue, } }
        //       ]
        //       // id: { in: [1, 2, 12] },
        //     },
        //     skip,
        //     take,
        //   });

        //   // result = await MyPrismaClient.$queryRaw`SELECT * FROM "facture" WHERE to_tsvector('codeMeCEF', "name"."commercialName") @@ to_tsquery('english', ${searchValue});`
        // } else {

          result = await MyPrismaClient.user.findMany({
          })

        // }

        const totalResult = await MyPrismaClient.user.count();

        return NextResponse.json({
          users: result,
          // metaData: {
          //   hasNextPage: take + skip < totalResult,
          //   totalPages: Math.ceil(totalResult / take),
          // }
        });

      // } else {
      //   return NextResponse.json({error: "Vous n'avez pas les permissions requises"}, { status: 500 });
      // }
    } else {
      throw new Error(
        `The HTTP ${request.method} method is not supported at this route.`,
      );
    }
  }
  catch (error) {
    console.log("Error :", error);
    return NextResponse.json({error: "Une erreur s'est produite"}, { status: 500 });
  }
}

export async function POST(request: any) {
  const body = await request.json();

  const { first_name, email, role, password } = body;
  console.log(first_name);

  if(!first_name || !email || !role || !password) {
    return new NextResponse('Missing Fields', { status: 400 });
  }

  const getRandomNumber = (min: any, max: any) => {
    return Math.random() * (max - min) + min
  }
  
  // Random number between 5 and 10
  const randomNumber = getRandomNumber(8, 8)
  const rand1 = parseInt(randomNumber);

  const existsUser = await MyPrismaClient.user.findUnique({
    where: {
      email
    }
  });

  if(existsUser) {
    throw new Error('Un compte correspond déjà à cette adresse email');
  } 

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await MyPrismaClient.user.create({
    data: {
      first_name,
      email,
      // phone_number: rand1.toString(),
      password: hashedPassword,
      role: role,
    }
  });

  return NextResponse.json(user);
}