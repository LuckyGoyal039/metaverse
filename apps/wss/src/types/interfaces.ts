export interface playerSchema {
    x: number,
    y: number,
    avatarImage: string,
    name: string
}
export interface playersSchema {
    [id: string]: playerSchema
}


