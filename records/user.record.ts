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
    email: string;
    username: string;
    bookId: string | null;
    currentTokenId: string | null;


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

        if( obj.password.length < 6) {
            throw new ValidationError('Password field cannot be shorter than 6');
        }

        this.id = obj.id;
        this.firstname = obj.firstname;
        this.lastname = obj.lastname;
        this.password = obj.password;
        this.address = obj.address;
        this.email = obj.email;
        this.username = obj.username;
        this.bookId= obj.username;
        this.currentTokenId = obj.currentTokenId;

    }

    static async getOne(id: string): Promise<UserRecord> | null {
        const [results] = await pool.execute("SELECT * FROM `users` WHERE id = :id", {
            id,
        }) as UserRecordResults;
        return results.length === 0 ? null : new UserRecord(results[0])
    }

    static async getOneWithEmail(email: string): Promise<UserRecord> | null {
        const [results] = await pool.execute("SELECT * FROM `users` WHERE email = :email", {
            email,
        }) as UserRecordResults;
        return results.length === 0 ? null : new UserRecord(results[0])
    }

    static async getOneWithToken(currentTokenId: string): Promise<UserRecord> | null {
        const [results] = await pool.execute("SELECT * FROM `users` WHERE currentTokenId = :currentTokenId", {
            currentTokenId,
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
        await pool.execute("INSERT INTO `users` (`id`, `firstname`, `lastname`, `address`, `password`, `email`, `username`) VALUES (:id, :firstname, :lastname, :address, :password, :email, :username)", this)
    }

    async delete():Promise<void> {
        await pool.execute("DELETE FROM `users` WHERE `id` =:id", {
            id: this.id})
    }

    async update():Promise<void> {
        await pool.execute("UPDATE `users` SET `firstname` = :firstname, `lastname` = :lastname, `address` = :address, `password` = :password, `email` = :email, `username` = :username, `currentTokenId` = :currentTokenId WHERE `id` = :id", {
            id: this.id,
            firstname: this.firstname,
            lastname: this.lastname,
            address: this.address,
            password: this.password,
            email: this.email,
            username: this.username,
            // bookId: this.bookId,
            currentTokenId: this.currentTokenId,
        });
    }

}