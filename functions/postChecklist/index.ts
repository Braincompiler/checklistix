import { Config, Context } from '@netlify/functions';

import { supabase } from '../db';
import { Tables } from '../db.types';

export default async (req: Request, ctx: Context) => {
    const data = await req.json();

    const createdChecklist = await supabase
        .from('checklists') //
        .insert<Tables<'checklists'>>({
            ...data,
        })
        .select()
        // .returns<Tables<'checklists'>>()
        .single();

    return Response.json(createdChecklist.data, {
        status: 201,
    });
};

export const config: Config = {
    path: '/api/checklists',
    method: 'POST',
};
