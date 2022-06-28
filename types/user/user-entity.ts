export interface UserEntity {
    id: string;
    password: string;
    firstname: string;
    lastname: string;
    address: string;
    takenBooks: string[] | [];
}

export interface  NewUserEntity extends Omit<UserEntity, 'id'> {
    id?: string;
}