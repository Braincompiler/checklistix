import { BorderThickness, Checklist, ChecklistStyle, PageOrientation, PageSize } from '@api';

import { Tables } from './db.types';

export function mapChecklistDTOToVM(dto: Tables<'checklists'>): Checklist {
    return {
        id: dto.id,
        title: dto.title,
        created: dto.created,
        updated: dto.updated ?? undefined,
        style: dto.style as ChecklistStyle,
        pageSize: dto.page_size as PageSize,
        pageOrientation: dto.page_orientation as PageOrientation,
        columns: dto.columns,
        fontSize: dto.font_size,
        borderThickness: dto.border_thickness as BorderThickness,
        fontFamily: dto.font_family,
        defaultColor: dto.default_color,
    };
}

export function mapChecklistVMToDTO(vm: Checklist): Tables<'checklists'> {
    return {
        id: vm.id,
        title: vm.title ?? '',
        created: vm.created,
        updated: vm.updated ?? null,
        style: vm.style,
        page_size: vm.pageSize,
        page_orientation: vm.pageOrientation,
        columns: vm.columns,
        font_size: vm.fontSize,
        border_thickness: vm.borderThickness,
        font_family: vm.fontFamily,
        default_color: vm.defaultColor,
    };
}
