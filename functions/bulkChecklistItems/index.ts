import { Config, Context } from '@netlify/functions';

import { ChecklistFormChecklistItemsInner } from '@api';

import { supabase } from '../db';
import { Tables } from '../db.types';

export default async (req: Request, ctx: Context) => {
    const checklistItems = (await req.json()) as ChecklistFormChecklistItemsInner[];

    const values: Partial<Tables<'checklist_items'>>[] = checklistItems.map((item) => ({
        id: item.id,
        page: item.page,
        column: item.column,
        position: item.position,
    }));
    for (const value of values) {
        const { error } = await supabase //
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

export const config: Config = {
    path: '/api/checklist-items/bulk',
    method: 'PATCH',
};
