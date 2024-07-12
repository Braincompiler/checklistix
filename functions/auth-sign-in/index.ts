import { Config, Context } from '@netlify/functions';

import { AuthForm } from '@api';

import { createSupabaseClient } from '../db';
import { AUTH_COOKIE_NAME } from '../middlewares/auth';

export default async (req: Request, ctx: Context) => {
    const authData = (await req.json()) as AuthForm;

    const { data, error } = await createSupabaseClient().auth.signInWithPassword({
        email: authData.email,
        password: authData.password,
    });

    if (error) {
        console.error(error);

        return new Response(JSON.stringify(error), { status: 500 });
    }

    ctx.cookies.set({
        name: AUTH_COOKIE_NAME,
        value: data.session.access_token,
        path: '/',
        httpOnly: true,
        expires: new Date((data.session.expires_at ?? Date.now() + (data.session?.expires_in ?? 3600)) * 1000),
    });

    return Response.json(data.session);
};

export const config: Config = {
    path: '/api/auth/sign-in',
    method: 'POST',
};
