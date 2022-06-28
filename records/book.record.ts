import {BookEntity, NewBookEntity} from "../types";
import {ValidationError} from "../utils/errors";

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

        this.title = obj.title;
        this.author = obj.author;
        this.description = obj.description;
        this.review = obj.review;
        this.count = obj.count;
    }

}