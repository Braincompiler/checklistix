import { Config, Context } from '@netlify/functions';
import { isNil } from 'ramda';

import { createSupabaseClient } from '../db';
import { Tables } from '../db.types';
import { withAuth } from '../middlewares/auth';

const postSubChecklistItem = async (req: Request, ctx: Context, accessToken?: string) => {
    const { id } = ctx.params;
    if (isNil(id)) {
        return new Response('missing id', { status: 400 });
    }

    const data = await req.json();

    // data.sub_checklist_id = data.subChecklistId;
    // delete data.subChecklistId;

    console.log(data);

    const { data: createdChecklistItem, error } = await createSupabaseClient(accessToken)
        .from('sub_checklist_items') //
        .insert<Tables<'sub_checklist_items'>>({
            id: data.id,
            sub_checklist_id: data.subChecklistId,
            type: data.type,
            item: data.item,
            action: data.action,
            text: data.text,
        })
        .select('*')
        .maybeSingle();

    if (error) {
        console.error(error);

        return new Response(JSON.stringify(error), { status: 500 });
    }

    return Response.json(createdChecklistItem, {
        status: 201,
    });
};

export default (req: Request, ctx: Context) => withAuth(postSubChecklistItem)(req, ctx);

export const config: Config = {
    path: '/api/checklist-items/:id/sub-checklist-items',
    method: 'POST',
};
