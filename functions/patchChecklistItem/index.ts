import { Config, Context } from '@netlify/functions';
import { isNil } from 'ramda';

import { createSupabaseClient } from '../db';
import { Tables } from '../db.types';
import { withAuth } from '../middlewares/auth';

const patchChecklistItem = async (req: Request, ctx: Context, accessToken?: string) => {
    const { id } = ctx.params;
    if (isNil(id)) {
        return new Response('missing id', { status: 400 });
    }

    const supabaseClient = createSupabaseClient(accessToken);

    const { data, error } = await supabaseClient //
        .from('checklist_items')
        .select('*')
        .eq('id', id)
        .maybeSingle<Tables<'checklist_items'>>();
    if (error) {
        console.error(error);

        return new Response(JSON.stringify(error), { status: 500 });
    }
    if (!data) {
        return new Response(JSON.stringify({ message: 'ChecklistItem not found' }), { status: 404 });
    }

    const updateData = await req.json();

    const { data: updatedChecklistItem, error: updateError } = await supabaseClient
        .from('checklist_items') //
        .update<Tables<'checklist_items'>>({
            ...updateData,
        })
        .eq('id', id)
        .select()
        .maybeSingle();

    if (updateError) {
        console.error(updateError);

        return new Response(JSON.stringify(updateError), { status: 500 });
    }

    return Response.json(updatedChecklistItem, {
        status: 200,
    });
};

export default async (req: Request, ctx: Context) => (await withAuth(patchChecklistItem))(req, ctx);

export const config: Config = {
    path: '/api/checklist-items/:id',
    excludedPath: ['/api/checklist-items/bulk'],
    method: 'PATCH',
};
