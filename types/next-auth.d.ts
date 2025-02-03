import NextAuth from 'next-auth';

declare module 'next-auth' {
    interface User {
        id: string
        first_name: string
        last_name: string
        email: string
        phone_number: string
        role: string
        // accessToken: string
    }

    interface Session {
        user: {
            id: string;
        } & Session['user'];
        expires: string
        error: string
    }
}