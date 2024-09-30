import { Config, Context } from '@netlify/functions';

import { AuthForm } from '@api';

import { createSupabaseClient } from '../db';

export default async (req: Request, ctx: Context) => {
    const authData = (await req.json()) as AuthForm;

    const { data, error } = await createSupabaseClient().auth.signUp({
        email: authData.email,
        password: authData.password,
        options: {
            emailRedirectTo: 'http://localhost:8888/',
        },
    });

    if (error) {
        console.error(error);

        return new Response(JSON.stringify(error), { status: 500 });
    }

    return Response.json(data);
};

export const config: Config = {
    path: '/api/auth/sign-up',
    method: 'POST',
};
