import { Config, Context } from '@netlify/functions';

import { ChecklistOverviewItem } from '../api';
import { createSupabaseClient } from '../db';
import { withAuth } from '../middlewares/auth';

const getChecklists = async (req: Request, ctx: Context, accessToken?: string) => {
    const supabaseClient = createSupabaseClient(accessToken);

    const { data: checklists, error } = await supabaseClient
        .from('checklists') //
        .select('id, title, created, updated')
        .returns<ChecklistOverviewItem[]>();

    if (error) {
        console.error(error);

        return new Response(JSON.stringify(error), { status: 500 });
    }

    return ctx.json(checklists);
};

export default (req: Request, ctx: Context) => withAuth(getChecklists)(req, ctx);

export const config: Config = {
    path: '/api/checklists',
    method: 'GET',
};
