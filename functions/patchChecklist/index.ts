import { Config, Context } from '@netlify/functions';
import { isNil } from 'ramda';

import { Checklist } from '@api';

import { supabase } from '../db';
import { Tables } from '../db.types';
import { mapChecklistVMToDTO } from '../mapping';

export default async (req: Request, ctx: Context) => {
    const { id } = ctx.params;
    if (isNil(id)) {
        return new Response('missing id', { status: 400 });
    }

    const { data, error } = await supabase //
        .from('checklists')
        .select('*')
        .eq('id', id)
        .maybeSingle<Tables<'checklists'>>();
    if (error) {
        console.error(error);

        return new Response(JSON.stringify(error), { status: 500 });
    }
    if (!data) {
        return new Response(JSON.stringify({ message: 'Checklist not found' }), { status: 404 });
    }

    // const checklist = data as unknown as Checklist;

    const updateData = (await req.json()) as Checklist;
    // @TODO: Validation?

    delete updateData.checklistItems;

    console.log(updateData);

    const updatedChecklist = await supabase
        .from('checklists') //
        .update({
            ...mapChecklistVMToDTO(updateData),
            updated: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

    return Response.json(updatedChecklist.data, {
        status: 200,
    });
};

export const config: Config = {
    path: '/api/checklists/:id',
    method: 'PATCH',
};
