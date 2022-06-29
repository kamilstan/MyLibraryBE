import {pool} from "../utils/db";
import {BookRecord} from "../records/book.record";


const defaultObj = {
    title: "Test title",
    author: "Test author",
    description: "Test description.",
    review: 0,
    count: 1,
}

afterAll(async () => {
    await pool.end();
})

test('BookRecord.getOne returns data from database for one entry.', async () => {
    const book = await BookRecord.getOne('a');

    console.log(book);
    expect(book).toBeDefined();
    expect(book.id).toBe('a');
    expect(book.title).toBe('Potop');
});

test('BookRecord.getOne returns null from database for no existing entry.', async () => {
    const book = await BookRecord.getOne('---');

    expect(book).toBeNull();
});

test('BookRecord.findAll returns an array of found entries from database.', async () => {
    const books = await BookRecord.findAll('');

    expect(books).not.toEqual([]);
    expect(books[0].id).toBeDefined();
});

test('BookRecord.findAll returns an array of found entries from database when searching for a.', async () => {
    const books = await BookRecord.findAll('t');

    expect(books).not.toEqual([]);
    expect(books[0].id).toBeDefined();
})

test('BookRecord.findAll returns an empty array of found entries from database when searching for something which does not exist.', async () => {
    const books = await BookRecord.findAll('-------------------------------');

    expect(books).toEqual([]);

});

test('BookRecord.insert returns UUID.', async () => {
    const book = new BookRecord(defaultObj);
    await book.insert();

    expect(book.id).toBeDefined();
    expect(typeof book.id).toBe('string');
});

test('BookRecord.insert inserts data to database.', async () => {
    const book = new BookRecord(defaultObj);
    await book.insert();

    const foundBook = await BookRecord.getOne(book.id)

    expect(foundBook).toBeDefined();
    expect(foundBook).not.toBeNull();
    expect(foundBook.id).toBe(book.id);
})