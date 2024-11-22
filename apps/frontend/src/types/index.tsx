export interface CreateElementDataSchema {
    imageUrl: string;
    static: boolean;
    width: number;
    height: number;
}
export interface CreateElementFunctionSchema {
    (data: CreateElementDataSchema): Promise<void>;
}

export interface CreateAvatarDataSchema {
    imageUrl: string;
    name: string;
}
export interface CreateAvatarFunctionSchema {
    (data: CreateAvatarDataSchema): Promise<void>;
}

export interface CreateSpaceDataSchema {
    name: string;
    dimensions: string;
    mapId: string;
}
export interface CreateSpaceFunctionSchema {
    (data: CreateSpaceDataSchema): Promise<void>;
}

export interface CreateMapDataSchema {
    thumbnail: string;
    dimensions: string;
    name: string,
    defaultElements: Array<{
        elementId: string,
        x: number,
        y: number
    }>
}
export interface CreateMapFunctionSchema {
    (data: CreateMapDataSchema): Promise<void>;
}


export type CallbackFunctionData = CreateMapDataSchema | CreateSpaceDataSchema | CreateElementDataSchema | CreateAvatarDataSchema
export type CallbackFunctions<T> = (data: T) => Promise<void>

export interface ModalState<T> {
    open: boolean,
    modalName: string,
    callback: CallbackFunctions<T>
}

export interface CustomModalProps<T> {
    modalName: string;
    cancel: () => void;
    callback: CallbackFunctions<T>,
}
export type ModalStateUnion =
    | ModalState<CreateElementDataSchema>
    | ModalState<CreateMapDataSchema>
    | ModalState<CreateAvatarDataSchema>
    | ModalState<CreateSpaceDataSchema>;

export interface Element {
    id: string;
    width: number;
    height: number;
    image: string;
    static: boolean;
}

export interface CustomDropdownWithImageProps {
    elementList: Element[];
    selectedElementId: string | null;
    onSelect: (elementId: string) => void;
}