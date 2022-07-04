import {NewUserEntity, UserEntity} from "../types";
import {ValidationError} from "../utils/errors";
import {pool} from "../utils/db";
import {v4 as uuid} from "uuid";
import {FieldPacket} from "mysql2";

type UserRecordResults = [UserEntity[], FieldPacket[]];

export class UserRecord implements UserEntity {
    id: string;
    firstname: string;
    lastname: string;
    password: string;
    address: string;


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

        this.id = obj.id;
        this.firstname = obj.firstname;
        this.lastname = obj.lastname;
        this.password = obj.password;
        this.address = obj.address;
    }

    static async getOne(id: string): Promise<UserRecord> | null {
        const [results] = await pool.execute("SELECT * FROM `users` WHERE id = :id", {
            id,
        }) as UserRecordResults;
        return results.length === 0 ? null : new UserRecord(results[0])
    }

    static async findAll(lastname: string): Promise<UserRecord[]> {
        const [results] = await pool.execute("SELECT * FROM `users` WHERE `lastname` LIKE :search", {
            search: `%${lastname}%`
        }) as UserRecordResults

        return results.map(result => new UserRecord(result))
    }

    async insert(): Promise<void> {
        if (!this.id) {
            this.id = uuid();
        } else {
            throw new ValidationError("Cannot insert somebody that already exists")
        }
        await pool.execute("INSERT INTO `users` (`id`, `firstname`, `lastname`, `address`, `password`) VALUES (:id, :firstname, :lastname, :address, :password)", this)
    }


}