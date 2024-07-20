import { Context } from '@netlify/functions';
import { Session } from '@supabase/supabase-js';
import { sub } from 'date-fns';
import * as process from 'node:process';

import { createSupabaseClient } from '../db';

export const AUTH_COOKIE_NAME = 'checklistix';

export const withAuth = async (handler: (req: Request, ctx: Context, accessToken?: string) => Promise<Response>) => (req: Request, ctx: Context) => {
    return new Proxy(handler, {
        async apply(target: (req: Request, ctx: Context, accessToken?: string) => Promise<Response>, _: any, [r, c]: [Request, Context]) {
            const data: string = ctx.cookies.get(AUTH_COOKIE_NAME);
            if (!data) {
                return new Response('Unauthorized', { status: 401 });
            }

            const now: any = Date.now();
            const session = JSON.parse(atob(data)) as Session;
            const { access_token, refresh_token, user, expires_at = now / 1000 + 3600 } = session;

            const expires5minBefore: number = sub(expires_at * 1000, { minutes: 5 }).getTime();
            // console.log({
            //     expires_at,
            //     expires_atD: new Date(expires_at! * 1000),
            //     now,
            //     nowD: new Date(now * 1000),
            //     expires5minBefore,
            //     expires5minBeforeD: new Date(expires5minBefore * 1000),
            //     cmp: expires5minBefore < now,
            //     user,
            // });
            if (expires5minBefore < now) {
                console.log('Refresh session of', user.email);

                const supabaseClient = createSupabaseClient();
                const { data, error } = await supabaseClient.auth.refreshSession({ refresh_token });
                if (!data.session || error) {
                    console.error('refreshSession', error, __filename);

                    return new Response(JSON.stringify(error), { status: 500 });
                }

                storeCookie(c, data.session);
            }

            return target(r, c, access_token);
        },
    }).apply(undefined, [req, ctx]);
};

const HOUR = 60 * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;

export function storeCookie(ctx: Context, session: Session, extendExpires = false) {
    const expiresAt = session.expires_at ?? Date.now() / 1000;
    const rememberMe = session.user.user_metadata['rememberMe'];

    ctx.cookies.set({
        name: AUTH_COOKIE_NAME,
        value: btoa(JSON.stringify(session)),
        path: '/',
        httpOnly: true,
        expires: (rememberMe === true ? expiresAt + WEEK : expiresAt + HOUR) * 1000,
        secure: !!process.env['NETLIFY'],
    });
}
