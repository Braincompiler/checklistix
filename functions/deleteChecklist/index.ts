import { Config, Context } from '@netlify/functions';
import { isNil } from 'ramda';

import { supabase } from '../db';

export default async (req: Request, ctx: Context) => {
    const { id } = ctx.params;
    if (isNil(id)) {
        return new Response('missing id', { status: 400 });
    }

    const { data, error } = await supabase
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

export const config: Config = {
    path: '/api/checklists/:id',
    method: 'DELETE',
};
