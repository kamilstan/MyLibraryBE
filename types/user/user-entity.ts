export interface UserEntity {
    id: string;
    firstname: string;
    lastname: string;
    address: string;
    password: string;
    email: string;
    username: string;
    bookId: string | null;
    currentTokenId: string | null;
}

export interface  NewUserEntity extends Omit<UserEntity, 'id' | 'bookId' | 'currentTokenId'> {
    id?: string;
    bookId?: string | null;
    currentTokenId?: string | null;
}

export interface SetBookForUserReq {
    bookId: string;
}

export interface LoginUserEntity {
    id: string;
    password: string;
    email: string;
}