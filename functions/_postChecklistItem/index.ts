import { Config, Context } from '@netlify/functions';
import { isNil } from 'ramda';

import { createSupabaseClient } from '../db';
import { Tables } from '../db.types';
import { withAuth } from '../middlewares/auth';

const postChecklistItem = async (req: Request, ctx: Context, accessToken?: string) => {
    const { id } = ctx.params;
    if (isNil(id)) {
        return new Response('missing id', { status: 400 });
    }

    const supabaseClient = createSupabaseClient(accessToken);

    const { count, error: matchedChecklistError } = await supabaseClient //
        .from('checklists')
        .select('*', {
            head: true,
            count: 'exact',
        })
        .eq('id', id)
        .maybeSingle();

    // console.log(matchedChecklistError, count);
    if (matchedChecklistError) {
        console.error(matchedChecklistError);

        return new Response(JSON.stringify(matchedChecklistError), { status: 500 });
    }
    if (!count || count < 1) {
        return new Response(JSON.stringify({ message: 'Checklist not found' }), { status: 404 });
    }

    const data = await req.json();

    delete data.subChecklistItems;
    delete data.checklistId;

    const { data: createdChecklistItem, error } = await supabaseClient
        .from('checklist_items') //
        .insert<Tables<'checklist_items'>>({
            ...data,
            checklist_id: id,
        })
        .select()
        .maybeSingle();

    if (error) {
        console.error(error);

        return new Response(JSON.stringify(error), { status: 500 });
    }

    return Response.json(createdChecklistItem, {
        status: 201,
    });
};

export default async (req: Request, ctx: Context) => (await withAuth(postChecklistItem))(req, ctx);

export const config: Config = {
    path: '/api/checklists/:id/checklist-items',
    method: 'POST',
};
