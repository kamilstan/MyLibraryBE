import {BookEntity, NewBookEntity} from "../types";
import {ValidationError} from "../utils/errors";
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";
import {v4 as uuid} from "uuid";

type BookRecordResults = [BookEntity[], FieldPacket[]];

export class BookRecord implements BookEntity {

    id: string;
    title: string;
    author: string;
    description: string;
    review: number;
    count: number;

    constructor(obj: NewBookEntity) {
        if(!obj.title || obj.title.length > 200) {
            throw new ValidationError('Title of the book field cannot be empty and longer than 200');
        }

        if(!obj.author || obj.author.length > 100) {
            throw new ValidationError('Author field cannot be empty and longer than 100');
        }

        if(!obj.description || obj.description.length > 1000) {
            throw new ValidationError('Description field cannot be empty and longer than 1000');
        }

        if(typeof obj.review !== "number") {
            throw new ValidationError('Review field has to be a number');
        }

        this.id = obj.id;
        this.title = obj.title;
        this.author = obj.author;
        this.description = obj.description;
        this.review = obj.review;
        this.count = obj.count;
    }

    static async getOne(id: string): Promise<BookRecord> | null {
        const [results] = await pool.execute("SELECT * FROM `books` WHERE id = :id", {
            id,
        }) as BookRecordResults;
        return results.length === 0 ? null : new BookRecord(results[0])
    }

    static async findAll(title: string): Promise<BookRecord[]> {
        const [results] = await pool.execute("SELECT * FROM `books` WHERE `title` LIKE :search", {
            search: `%${title}%`
        }) as BookRecordResults

        return results.map(result => new BookRecord(result))
    }

    async insert(): Promise<void> {
        if (!this.id) {
            this.id = uuid();
        } else {
            throw new ValidationError("Cannot insert something that already exists")
        }
        await pool.execute("INSERT INTO `books` (`id`, `title`, `author`, `description`, `review`, `count`) VALUES (:id, :title, :author, :description, :review, :count)", this)
    }

}