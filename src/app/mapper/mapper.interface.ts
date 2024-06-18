export interface IMapper<TDTO, TVM> {
    for(): string;

    mapToVM(src: TDTO): Promise<TVM>;

    mapToDTO(src: TVM): Promise<TDTO>;
}
