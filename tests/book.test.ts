import {pool} from "../utils/db";
import {BookRecord} from "../records/book.record";

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

test('BookRecord.getOne returns null from database for unexisting entry.', async () => {
    const book = await BookRecord.getOne('---');

    expect(book).toBeNull();
});