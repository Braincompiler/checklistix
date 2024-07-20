import { Config, Context } from '@netlify/functions';
import { isNil } from 'ramda';

import { createSupabaseClient } from '../db';
import { Tables } from '../db.types';
import { withAuth } from '../middlewares/auth';

const patchSubChecklistItem = async (req: Request, ctx: Context, accessToken?: string) => {
    const { id } = ctx.params;
    if (isNil(id)) {
        return new Response('missing id', { status: 400 });
    }

    const supabaseClient = createSupabaseClient(accessToken);

    const { data, error } = await supabaseClient //
        .from('sub_checklist_items')
        .select('*')
        .eq('id', id)
        .maybeSingle<Tables<'sub_checklist_items'>>();
    if (error) {
        console.error(error);

        return new Response(JSON.stringify(error), { status: 500 });
    }
    if (!data) {
        return new Response(JSON.stringify({ message: 'SubChecklistItem not found' }), { status: 404 });
    }

    const updateData = await req.json();

    const { data: updatedSubChecklistItem, error: updateError } = await supabaseClient
        .from('sub_checklist_items') //
        .update<Tables<'sub_checklist_items'>>({
            ...updateData,
        })
        .eq('id', id)
        .select()
        .maybeSingle();

    if (updateError) {
        console.error(updateError);

        return new Response(JSON.stringify(updateError), { status: 500 });
    }

    return Response.json(updatedSubChecklistItem, {
        status: 200,
    });
};

export default async (req: Request, ctx: Context) => (await withAuth(patchSubChecklistItem))(req, ctx);

export const config: Config = {
    path: '/api/sub-checklist-items/:id',
    method: 'PATCH',
};
