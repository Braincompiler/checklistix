import { isNil } from 'ramda';

import { Checklist } from '@api';

import { IMapper } from './mapper.interface';

export const CHECKLIST_TYPE_ID = 'Checklist';

export interface IChecklistVM extends Omit<Checklist, 'created' | 'updated'> {
    created: Date;
    updated: Date | null;
}

export class ChecklistMapper implements IMapper<Checklist, IChecklistVM> {
    public for(): string {
        return CHECKLIST_TYPE_ID;
    }

    public async mapToVM(src: Checklist): Promise<IChecklistVM> {
        return {
            ...src,
            created: new Date(src.created),
            updated: src.updated ? new Date(src.updated) : null,
        };
    }

    public async mapToDTO(src: IChecklistVM): Promise<Checklist> {
        return {
            ...src,
            created: src.created.toISOString(),
            updated: src.updated?.toISOString(),
        };
    }
}

export function checklistMapToVM(src: Checklist): IChecklistVM {
    return {
        ...src,
        created: new Date(src.created),
        updated: !isNil(src.updated) ? new Date(src.updated) : null,
    };
}

export function checklistMapToDTO(src: IChecklistVM): Checklist {
    return {
        ...src,
        created: src.created.toISOString(),
        updated: src.updated?.toISOString(),
    };
}
