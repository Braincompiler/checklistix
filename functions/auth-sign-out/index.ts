import { Config, Context } from '@netlify/functions';

import { createSupabaseClient } from '../db';
import { AUTH_COOKIE_NAME, withAuth } from '../middlewares/auth';

// @TODO: In case the sign-out is called when the token/session is already expired thw withAuth middleware returns with 401 🤔
export default withAuth(async (req: Request, ctx: Context, accessToken?: string) => {
    const { error } = await createSupabaseClient(accessToken).auth.signOut();

    if (error) {
        console.error(error);

        return new Response(JSON.stringify(error), { status: 500 });
    }

    ctx.cookies.delete(AUTH_COOKIE_NAME);

    return new Response(null, { status: 204 });
});

export const config: Config = {
    path: '/api/auth/sign-out',
    method: 'POST',
};
