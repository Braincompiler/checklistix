import { Context } from '@netlify/functions';

export const AUTH_COOKIE_NAME = 'checklistix';

export const withAuth = (handler: (req: Request, ctx: Context, accessToken?: string) => Promise<Response>) => (req: Request, ctx: Context) => {
    return new Proxy(handler, {
        apply(target: (req: Request, ctx: Context, accessToken?: string) => Promise<Response>, _: any, [r, c]: [Request, Context]) {
            const token = ctx.cookies.get(AUTH_COOKIE_NAME);
            if (!token) {
                return new Response('Unauthorized', { status: 401 });
            }

            return target(r, c, token);
        },
    }).apply(undefined, [req, ctx]);
};
