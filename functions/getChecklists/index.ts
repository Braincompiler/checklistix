import { Config, Context } from '@netlify/functions';
import { v4 as uuidv4 } from 'uuid';

import { Checklist } from '../api';

export default async (req: Request, ctx: Context) => {
    const checklists: Checklist[] = [
        {
            id: uuidv4(),
            name: 'Checklist #1',
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            // style: 'Dots',
            // pageSize: 'A4',
            // pageOrientation: 'Portrait',
            // columns: 2,
            // fontSize: 10,
            // borderThickness: 2,
            // fontFamily: 'sans-serif',
            // checklistItems: [],
        },
        {
            id: uuidv4(),
            name: 'Checklist #2',
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            // style: 'Dots',
            // pageSize: 'A4',
            // pageOrientation: 'Portrait',
            // columns: 2,
            // fontSize: 10,
            // borderThickness: 2,
            // fontFamily: 'sans-serif',
            // checklistItems: [],
        },
        {
            id: uuidv4(),
            name: 'Checklist #3',
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            // style: 'Dots',
            // pageSize: 'A4',
            // pageOrientation: 'Portrait',
            // columns: 2,
            // fontSize: 10,
            // borderThickness: 2,
            // fontFamily: 'sans-serif',
            // checklistItems: [],
        },
    ];
    return ctx.json(checklists);
};

export const config: Config = {
    path: '/api/checklists',
    method: 'GET',
};
