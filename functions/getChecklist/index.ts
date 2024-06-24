import { Config, Context } from '@netlify/functions';
import { isNil } from 'ramda';

import { Checklist } from '@api';

import { supabase } from '../db';

export default async (req: Request, ctx: Context) => {
    const { id } = ctx.params;
    if (isNil(id)) {
        return new Response('missing id', { status: 400 });
    }

    const { data: checklist, error } = await supabase //
        .from('checklists')
        .select(
            'pageSize:page_size, pageOrientation:page_orientation, fontSize:font_size, borderThickness:border_thickness, fontFamily:font_family, defaultColor:default_color, *, checklistItems:checklist_items (checklistId:checklist_id, *, subChecklistItems:sub_checklist_items (subChecklistId:sub_checklist_id, *))',
        )
        .eq('id', id)
        .maybeSingle<Checklist>();
    if (error) {
        console.error(error);

        return new Response(JSON.stringify(error), { status: 500 });
    }
    if (!checklist) {
        return new Response(JSON.stringify({ message: 'Checklist not found' }), { status: 404 });
    }

    const color = checklist.defaultColor;

    // @TODO: Find a better way to overwrite these meta settings (color, font-size, font-family, checklist style and/or border thickness)
    // -> https://supabase.com/docs/guides/database/json?queryGroups=database-method&database-method=js&queryGroups=language&language=js
    checklist.checklistItems = (checklist.checklistItems ?? []).map((item) => ({
        ...item,
        color: item.color ?? color,
    }));

    return ctx.json(checklist);
};

export const config: Config = {
    path: '/api/checklists/:id',
    method: 'GET',
};
