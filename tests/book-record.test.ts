import {BookRecord} from "../records/book.record";

const defaultObj = {
    title: "Test title",
    author: "Test author",
    description: "Test description.",
    review: 0,
    isAvailable: true,
}

test("Can build BookRecord", () => {
    const book = new BookRecord(defaultObj);

    expect(book.title).toBe("Test title");
    expect(book.author).toBe("Test author");
    expect(book.description).toBe("Test description.");
    expect(book.review).toBe(0);
    expect(book.isAvailable).toBe(true);
})

test("Validates incorrect title", () => {
    expect(() => new BookRecord({
        ...defaultObj,
        title: "",
    })).toThrow('Title of the book field cannot be empty and longer than 200')
})

test("Validates incorrect author", () => {
    expect(() => new BookRecord({
        ...defaultObj,
        author: "",
    })).toThrow('Author field cannot be empty and longer than 100')
})

test("Validates incorrect description", () => {
    expect(() => new BookRecord({
        ...defaultObj,
        description: "",
    })).toThrow('Description field cannot be empty and longer than 1000')
})


