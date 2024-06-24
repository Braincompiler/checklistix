import { Config, Context } from '@netlify/functions';
import { isNil } from 'ramda';

import { supabase } from '../db';
import { Tables } from '../db.types';

export default async (req: Request, ctx: Context) => {
    const { id } = ctx.params;
    if (isNil(id)) {
        return new Response('missing id', { status: 400 });
    }

    const { data, error } = await supabase //
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

    const { data: updatedChecklistItem, error: updateError } = await supabase
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

export const config: Config = {
    path: '/api/checklist-items/:id',
    excludedPath: ['/api/checklist-items/bulk'],
    method: 'PATCH',
};
