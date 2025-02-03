// imports
import MyPrismaClient from "@/prisma/prismaClient";
import NextAuth, { AuthOptions, NextAuthOptions } from "next-auth";
import bcrypt from "bcrypt";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from "@auth/prisma-adapter";

export const authOptions: AuthOptions = {
//   debug: true,
  // adding prisma adapter
  adapter: PrismaAdapter(MyPrismaClient) as any,

  providers: [
    // we have the google auth privider for now
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    EmailProvider({
        server: {
          host: process.env.SMTP_HOST as string,
          port: Number(process.env.SMTP_PORT),
          auth: {
            user: process.env.SMTP_USER as string,
            pass: process.env.SMTP_PASSWORD as string,
          },
        },
        from: process.env.EMAIL_FROM as string,
    }),
    CredentialsProvider({
        //@ts-ignore
        id: "surfer-login",
        name: "SurferLogin",
        credentials: {
          // ... credentials for Siwe provider
          first_name: { label: "Nom", type: "text" },
          last_name: { label: "Prénoms", type: "text" },
          email: { label: "Email", type: "text" },
          phone_number: { label: "Numéro de téléphone", type: "text" },
        },
        async authorize(credentials: any): Promise<any> {
            if (!credentials?.first_name || !credentials?.last_name  || !credentials?.phone_number) {
              throw new Error("Veuillez svp renseignez tous les champs");
            }

            let surfer = await MyPrismaClient.user.findUnique({
                where: {
                    phone_number: credentials.phone_number,
                },
            });

            if(!surfer) {   
              surfer = await MyPrismaClient.user.create({
                data: {
                  first_name: credentials.first_name,
                  last_name: credentials.last_name,
                  email: credentials.email,
                  phone_number: credentials.phone_number,
                }
              });
            } 

            return surfer;
        },
    }),
    CredentialsProvider({
        id: "office-login",
        name: 'OfficeLogin',
        // The credentials is used to generate a suitable form on the sign in page.
        // You can specify whatever fields you are expecting to be submitted.
        // e.g. domain, username, password, 2FA token, etc.
        // You can pass any HTML attribute to the <input> tag through the object.
        credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Mot de passe", type: "password" },
        },
        async authorize(credentials: any): Promise<any> {

          if (!credentials?.email || !credentials?.password) {
              throw new Error("Veuillez svp renseigner tous les champs");
          }

          const user = await MyPrismaClient.user.findUnique({
              where: {
                  email: credentials.email,
              },
          });

          if(!user || !user.password) {
              throw new Error("Aucun compte ne correspond à cette adresse email");
          }

          const passwordVerified = await bcrypt.compare(
              credentials.password,
              user.password
          );

          if(!passwordVerified) {
              throw new Error("Mot de passe incorrect");
          }
          
          return user;

        },
    }),
  ],

  callbacks: {
    // jwt is the token that we get from the provider this will run only once when the user logs in
    async jwt({ token, user, session, trigger, account, profile, isNewUser  }) {
        // console.log("jwt callback", { token, user, session })

        if(trigger === "update" && session?.first_name) {
            token.first_name = session.first_name;
            token.last_name = session.last_name;
        }

        if (account) {
          token.accessToken = account.access_token;
        }

        // here we are getting the user from database
        let dbUser;
        if(token.email) {
          dbUser = await MyPrismaClient.user.findFirst({
              where: {
                email: token.email?.toString(),
              },
          });
        } else {
          dbUser = await MyPrismaClient.user.findFirst({
            where: {
              phone_number: token.phone_number?.toString(),
            },
        });
        }

        if (!dbUser) {
            token.id = user!.id;
            return token;
        }

        // update user in the database 
        // const newUser = await MyPrismaClient.user.update({
        //     where: {
        //         id: token.id,
        //     },
        //     data: {
        //         name: token.name,
        //     },
        // });
        // console.log("newUser", newUser);

        // jwt token returning the user data with the role
        return {
            ...token,
            id: dbUser.id,
            first_name: dbUser.first_name,
            last_name: dbUser.last_name,
            phone_number: dbUser.phone_number,
            role: dbUser.role,
            email: dbUser.email,
            picture: dbUser.profile_image_url,
        };
    },

    // session is the session object that we get from the jwt callback, we can get session data client side using useSession hook
    async session({ session, token, user }: any) {
        // console.log("session callback", { token, user, session })
      if (token) {
        session.user.id = token.id;
        session.user.first_name = token.first_name;
        session.user.last_name = token.last_name;
        session.user.phone_number = token.phone_number;
        session.user.email = token.email;
        session.user.picture = token.picture;
        session.user.role = token.role;
        session.user.jti = token.jti;
      }

      // we returned all the user data
      return session;
    },
  },

  // this is the secret that we use to encrypt the jwt token
  secret: process.env.NEXTAUTH_SECRET,
  // session: { strategy: "jwt", maxAge: 60 },
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
  debug: process.env.NODE_ENV === "development",

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    // maxAge: 60,
    maxAge: 60 * 60 * 24 * 30,
    // encryption: true,
  },
  
  pages: {
    signIn: "/sign-in",
    signOut: "/auth/signout",
    error: "/not-found",
  },


};

export default NextAuth(authOptions);