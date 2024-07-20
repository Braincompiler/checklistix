import { Config, Context } from '@netlify/functions';

import { ChecklistForm } from '@api';

import { createSupabaseClient } from '../db';
import { withAuth } from '../middlewares/auth';

const postChecklist = async (req: Request, ctx: Context, accessToken?: string) => {
    const newChecklist = (await req.json()) as ChecklistForm;

    const { data: createdChecklist, error } = await createSupabaseClient(accessToken)
        .from('checklists') //
        .insert({
            border_thickness: newChecklist.borderThickness,
            columns: newChecklist.columns,
            created: new Date().toISOString(),
            default_color: newChecklist.defaultColor,
            font_family: newChecklist.fontFamily,
            font_size: newChecklist.fontSize,
            page_orientation: newChecklist.pageOrientation,
            page_size: newChecklist.pageSize,
            style: newChecklist.style,
            title: newChecklist.title,
        })
        .select()
        .single();

    if (error) {
        console.error(error);

        return new Response(JSON.stringify(error), { status: 500 });
    }

    return Response.json(createdChecklist, {
        status: 201,
    });
};

export default async (req: Request, ctx: Context) => (await withAuth(postChecklist))(req, ctx);

export const config: Config = {
    path: '/api/checklists',
    method: 'POST',
};
