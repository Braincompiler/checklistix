import { Config, Context } from '@netlify/functions';

import { ChecklistFormChecklistItemsInner } from '@api';

import { createSupabaseClient } from '../db';
import { Tables } from '../db.types';
import { withAuth } from '../middlewares/auth';

const bulkSubChecklistItems = async (req: Request, ctx: Context, accessToken?: string) => {
    const subChecklistItems = (await req.json()) as ChecklistFormChecklistItemsInner[];

    const values: Partial<Tables<'sub_checklist_items'>>[] = subChecklistItems.map((item) => ({
        id: item.id,
        position: item.position,
    }));
    const supabaseClient = createSupabaseClient(accessToken);
    for (const value of values) {
        const { error } = await supabaseClient //
            .from('sub_checklist_items')
            .update<Partial<Tables<'sub_checklist_items'>>>(value)
            .eq('id', value.id);
        if (error) {
            console.error(error);

            return new Response(JSON.stringify(error), { status: 500 });
        }
    }

    return new Response(null, {
        status: 204,
    });
};

export default async (req: Request, ctx: Context) => (await withAuth(bulkSubChecklistItems))(req, ctx);

export const config: Config = {
    path: '/api/sub-checklist-items/bulk',
    method: 'PATCH',
};
