import { Config, Context } from '@netlify/functions';

import { AuthForm } from '@api';

import { createSupabaseClient } from '../db';
import { storeCookie } from '../middlewares/auth';

export default async (req: Request, ctx: Context) => {
    const { email, password, rememberMe } = (await req.json()) as AuthForm;

    const supabaseClient = createSupabaseClient();
    const { data: signInData, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
    });
    if (error) {
        console.error(error);

        return new Response(JSON.stringify(error), { status: 500 });
    }

    const { data, error: updateUserError } = await supabaseClient.auth.updateUser({
        data: { rememberMe },
    });
    if (updateUserError) {
        console.error(updateUserError);

        return new Response(JSON.stringify(updateUserError), { status: 500 });
    }

    storeCookie(ctx, signInData.session);

    return Response.json(data.user);
};

export const config: Config = {
    path: '/api/auth/sign-in',
    method: 'POST',
};
