import { Config, Context } from '@netlify/functions';
import { v4 as uuidv4 } from 'uuid';

import type {
    Checklist,
    ColumnBreak,
    PageBreak,
    SectionTitle,
    SubChecklist,
    SubChecklistItemCheckItem,
    SubChecklistItemPostcondition,
    SubChecklistItemPrecondition,
    SubChecklistItemSubtitle,
    TextBox,
} from '../api';

export default async (req: Request, ctx: Context) => {
    const { id } = ctx.params;
    const subCheckListId = uuidv4();

    const checklist: Checklist = {
        id,
        name: 'Checklist #1',
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        style: 'Dots',
        pageSize: 'A4',
        pageOrientation: 'Portrait',
        columns: 2,
        fontSize: 10,
        borderThickness: 2,
        fontFamily: 'sans-serif',
        checklistItems: [
            {
                id: subCheckListId,
                checklistId: id,
                type: 'SubChecklist',
                title: 'Preliminary Preflight Procedure',
                color: '#ededed',
                items: [
                    {
                        id: uuidv4(),
                        subCheckListId,
                        type: 'CheckItem',
                        item: 'ADIRU Switch',
                        action: 'OFF 30 seconds, then ON',
                    } as SubChecklistItemCheckItem,
                    {
                        id: uuidv4(),
                        subCheckListId,
                        type: 'CheckItem',
                        item: 'Outside Check',
                        action: 'Done',
                    } as SubChecklistItemCheckItem,
                    {
                        id: uuidv4(),
                        subCheckListId,
                        type: 'Subtitle',
                        text: 'Sub title',
                    } as SubChecklistItemSubtitle,
                    {
                        id: uuidv4(),
                        subCheckListId,
                        type: 'CheckItem',
                        item: 'THRUST & REV THRUST Levers',
                        action: 'Down/Closed',
                    } as SubChecklistItemCheckItem,
                    {
                        id: uuidv4(),
                        subCheckListId,
                        type: 'CheckItem',
                        item: 'SPEEDBRAKE lever',
                        action: 'DOWN',
                    } as SubChecklistItemCheckItem,
                    {
                        id: uuidv4(),
                        subCheckListId,
                        type: 'CheckItem',
                        item: 'FUEL CONTROL switches',
                        action: 'CUTOFF',
                    } as SubChecklistItemCheckItem,
                    {
                        id: uuidv4(),
                        subCheckListId,
                        type: 'Precondition',
                        text: 'Precondition',
                    } as SubChecklistItemPrecondition,
                    {
                        id: uuidv4(),
                        subCheckListId,
                        type: 'Postcondition',
                        text: 'Postcondition',
                    } as SubChecklistItemPostcondition,
                ],
            } as SubChecklist,
            {
                id: uuidv4(),
                checklistId: id,
                type: 'SubChecklist',
                title: 'Preflight Procedure',
                color: '#ededed',
                items: [
                    {
                        id: uuidv4(),
                        subCheckListId,
                        type: 'CheckItem',
                        item: 'ADIRU Switch',
                        action: 'OFF 30 seconds, then ON',
                    } as SubChecklistItemCheckItem,
                    {
                        id: uuidv4(),
                        subCheckListId,
                        type: 'CheckItem',
                        item: 'Outside Check',
                        action: 'Done',
                    } as SubChecklistItemCheckItem,
                    {
                        id: uuidv4(),
                        subCheckListId,
                        type: 'Subtitle',
                        text: 'Sub title',
                    } as SubChecklistItemSubtitle,
                    {
                        id: uuidv4(),
                        subCheckListId,
                        type: 'CheckItem',
                        item: 'THRUST & REV THRUST Levers',
                        action: 'Down/Closed',
                    } as SubChecklistItemCheckItem,
                    {
                        id: uuidv4(),
                        subCheckListId,
                        type: 'CheckItem',
                        item: 'SPEEDBRAKE lever',
                        action: 'DOWN',
                    } as SubChecklistItemCheckItem,
                    {
                        id: uuidv4(),
                        subCheckListId,
                        type: 'CheckItem',
                        item: 'FUEL CONTROL switches',
                        action: 'CUTOFF',
                    } as SubChecklistItemCheckItem,
                    {
                        id: uuidv4(),
                        subCheckListId,
                        type: 'Precondition',
                        text: 'Precondition',
                    } as SubChecklistItemPrecondition,
                    {
                        id: uuidv4(),
                        subCheckListId,
                        type: 'Postcondition',
                        text: 'Postcondition',
                    } as SubChecklistItemPostcondition,
                ],
            } as SubChecklist,
            {
                id: uuidv4(),
                checklistId: id,
                type: 'TextBox',
                color: '#ededed',
                text: 'Nullam vitae nisl nec arcu posuere dapibus. Praesent nec lorem sed sapien accumsan placerat et eu nisl. Phasellus non condimentum velit. Integer sit amet tempor mi. Vestibulum quis turpis ligula. In hac habitasse platea dictumst. Nullam et dolor eget justo elementum fringilla non in tellus.',
            } as TextBox,
            {
                id: uuidv4(),
                checklistId: id,
                type: 'ColumnBreak',
            } as ColumnBreak,
            {
                id: uuidv4(),
                checklistId: id,
                type: 'SectionTitle',
                text: 'Section Title',
                color: '#11CCEE',
            } as SectionTitle,
            {
                id: uuidv4(),
                checklistId: id,
                type: 'PageBreak',
            } as PageBreak,
            {
                id: uuidv4(),
                checklistId: id,
                type: 'SectionTitle',
                text: 'Section Title Page 2',
                color: '#11CCEE',
            } as SectionTitle,
            {
                id: subCheckListId,
                checklistId: id,
                type: 'SubChecklist',
                title: 'Preliminary Preflight Procedure Page 2',
                color: '#ededed',
                items: [
                    {
                        id: uuidv4(),
                        subCheckListId,
                        type: 'CheckItem',
                        item: 'ADIRU Switch',
                        action: 'OFF 30 seconds, then ON',
                    } as SubChecklistItemCheckItem,
                    {
                        id: uuidv4(),
                        subCheckListId,
                        type: 'CheckItem',
                        item: 'Outside Check',
                        action: 'Done',
                    } as SubChecklistItemCheckItem,
                    {
                        id: uuidv4(),
                        subCheckListId,
                        type: 'Subtitle',
                        text: 'Sub title',
                    } as SubChecklistItemSubtitle,
                    {
                        id: uuidv4(),
                        subCheckListId,
                        type: 'CheckItem',
                        item: 'THRUST & REV THRUST Levers',
                        action: 'Down/Closed',
                    } as SubChecklistItemCheckItem,
                    {
                        id: uuidv4(),
                        subCheckListId,
                        type: 'CheckItem',
                        item: 'SPEEDBRAKE lever',
                        action: 'DOWN',
                    } as SubChecklistItemCheckItem,
                    {
                        id: uuidv4(),
                        subCheckListId,
                        type: 'CheckItem',
                        item: 'FUEL CONTROL switches',
                        action: 'CUTOFF',
                    } as SubChecklistItemCheckItem,
                    {
                        id: uuidv4(),
                        subCheckListId,
                        type: 'Precondition',
                        text: 'Precondition',
                    } as SubChecklistItemPrecondition,
                    {
                        id: uuidv4(),
                        subCheckListId,
                        type: 'Postcondition',
                        text: 'Postcondition',
                    } as SubChecklistItemPostcondition,
                ],
            } as SubChecklist,
        ],
    };
    return ctx.json(checklist);
};

export const config: Config = {
    path: '/api/checklists/:id',
    method: 'GET',
};
