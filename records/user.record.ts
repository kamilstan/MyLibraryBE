import {NewUserEntity, UserEntity} from "../types";
import {ValidationError} from "../utils/errors";


export class UserRecord implements UserEntity {
    id: string;
    firstname: string;
    lastname: string;
    password: string;
    address: string;
    takenBooks: string[] | [];


    constructor(obj: NewUserEntity) {
        if(!obj.firstname || obj.firstname.length > 100) {
            throw new ValidationError('Firstname field cannot be empty and longer than 100');
        }

        if(!obj.lastname || obj.lastname.length > 100) {
            throw new ValidationError('Lastname field cannot be empty and longer than 100');
        }

        if(!obj.address || obj.address.length > 1000) {
            throw new ValidationError('Address field cannot be empty and longer than 1000');
        }

        if( obj.password.length < 6 || obj.password.length > 50 ) {
            throw new ValidationError('Password field cannot be shorter than 6 and longer than 50');
        }

        this.firstname = obj.firstname;
        this.lastname = obj.lastname;
        this.password = obj.password;
        this.address = obj.address;
        this.takenBooks = obj.takenBooks;

    }


}