export interface UserEntity {
    id: string;
    firstname: string;
    lastname: string;
    address: string;
    password: string;
}

export interface  NewUserEntity extends Omit<UserEntity, 'id'> {
    id?: string;
}