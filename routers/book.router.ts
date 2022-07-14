import {Router} from "express";
import {BookRecord} from "../records/book.record";
import {ValidationError} from "../utils/errors";

export const bookRouter = Router()

     .get('/search/:title?', async (req, res) => {
         const books = await BookRecord.findAll(req.params.title ?? '')
         res.json(books)
     })

    .get('/:id', async (req, res) => {
        const book = await BookRecord.getOne(req.params.id)
        res.json(book)
    })

    .post('/', async (req, res) => {
        const book = new BookRecord(req.body);
            await book.insert()
        res.json(book)
    })

    .delete('/:id', async (req, res) => {
        const book = await BookRecord.getOne(req.params.id);

        if(!book) {
            throw new ValidationError('There is no such book.')
        }

        // if(await book.countGivenBooks() > 0) {
        //     throw new ValidationError('Cannot remove taken book')
        // }

        await book.delete();
        res.end();
    })

