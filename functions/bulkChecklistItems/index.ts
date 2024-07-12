import { Config, Context } from '@netlify/functions';

import { ChecklistFormChecklistItemsInner } from '@api';

import { createSupabaseClient } from '../db';
import { Tables } from '../db.types';
import { withAuth } from '../middlewares/auth';

const bulkChecklistItems = async (req: Request, ctx: Context, accessToken?: string) => {
    const checklistItems = (await req.json()) as ChecklistFormChecklistItemsInner[];

    const values: Partial<Tables<'checklist_items'>>[] = checklistItems.map((item) => ({
        id: item.id,
        page: item.page,
        column: item.column,
        position: item.position,
    }));
    for (const value of values) {
        const { error } = await createSupabaseClient(accessToken) //
            .from('checklist_items')
            .update<Partial<Tables<'checklist_items'>>>(value)
            .eq('id', value.id);
        if (error) {
            console.error(error);

            return new Response(JSON.stringify(error), { status: 500 });
        }
    }

    return Response.json(null, {
        status: 200,
    });
};

export default async (req: Request, ctx: Context) => withAuth(bulkChecklistItems)(req, ctx);

export const config: Config = {
    path: '/api/checklist-items/bulk',
    method: 'PATCH',
};
