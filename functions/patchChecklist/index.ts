import { Config, Context } from '@netlify/functions';
import { isNil } from 'ramda';

import { Checklist } from '@api';

import { createSupabaseClient } from '../db';
import { Tables } from '../db.types';
import { mapChecklistVMToDTO } from '../mapping';
import { withAuth } from '../middlewares/auth';

const patchChecklist = async (req: Request, ctx: Context, accessToken?: string) => {
    const { id } = ctx.params;
    if (isNil(id)) {
        return new Response('missing id', { status: 400 });
    }

    const supabaseClient = createSupabaseClient(accessToken);

    const { data, error } = await supabaseClient //
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

    const updatedChecklist = await supabaseClient
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

export default async (req: Request, ctx: Context) => (await withAuth(patchChecklist))(req, ctx);

export const config: Config = {
    path: '/api/checklists/:id',
    method: 'PATCH',
};
