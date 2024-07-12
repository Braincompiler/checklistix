import { Config, Context } from '@netlify/functions';
import { isNil } from 'ramda';

import { createSupabaseClient } from '../db';
import { withAuth } from '../middlewares/auth';

const deleteChecklist = async (req: Request, ctx: Context, accessToken?: string) => {
    const { id } = ctx.params;
    if (isNil(id)) {
        return new Response('missing id', { status: 400 });
    }

    const { data, error } = await createSupabaseClient(accessToken)
        .from('checklists') //
        .delete()
        .eq('id', id);

    if (error) {
        console.error(error);

        return new Response(JSON.stringify(error), { status: 500 });
    }

    return new Response(null, {
        status: 204,
    });
};

export default (req: Request, ctx: Context) => withAuth(deleteChecklist)(req, ctx);

export const config: Config = {
    path: '/api/checklists/:id',
    method: 'DELETE',
};
