import { Config, Context } from '@netlify/functions';

import { ChecklistOverviewItem } from '../api';
import { supabase } from '../db';

export default async (req: Request, ctx: Context) => {
    const { data: checklists, error } = await supabase
        .from('checklists') //
        .select('id, title, created, updated')
        .returns<ChecklistOverviewItem[]>();

    if (error) {
        console.error(error);

        return new Response(JSON.stringify(error), { status: 500 });
    }

    return ctx.json(checklists);
};

export const config: Config = {
    path: '/api/checklists',
    method: 'GET',
};
