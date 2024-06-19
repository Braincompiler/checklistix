import { Config, Context } from '@netlify/functions';

export default async (req: Request, ctx: Context) => {
    console.log('Hello World');

    const data = {
        msg: 'Hello, world',
        geo: ctx.geo,
        url: req.url,
        params: ctx.params,
    };

    return ctx.json(data);
};

export const config: Config = {
    path: '/api/checklists',
    method: 'GET',
};
