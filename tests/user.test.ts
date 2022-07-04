import {pool} from "../utils/db";
import {UserRecord} from "../records/user.record";


const defaultObj = {
    firstname: "Test title",
    lastname: "Test author",
    address: "Test description.",
    password: "123456",
}

afterAll(async () => {
    await pool.end();
})

test('UserRecord.getOne returns data from database for one entry.', async () => {
    const user = await UserRecord.getOne('1');

    console.log(user);
    expect(user).toBeDefined();
    expect(user.id).toBe('1');
    expect(user.firstname).toBe('Kamil');
});

test('UserRecord.getOne returns null from database for no existing entry.', async () => {
    const user = await UserRecord.getOne('---');

    expect(user).toBeNull();
});

test('UserRecord.findAll returns an array of found entries from database.', async () => {
    const users = await UserRecord.findAll('');

    expect(users).not.toEqual([]);
    expect(users[0].id).toBeDefined();
});

test('UserRecord.findAll returns an array of found entries from database when searching for S.', async () => {
    const users = await UserRecord.findAll('S');

    expect(users).not.toEqual([]);
    expect(users[0].id).toBeDefined();
})

test('UserRecord.findAll returns an empty array of found entries from database when searching for something which does not exist.', async () => {
    const users = await UserRecord.findAll('-------------------------------');

    expect(users).toEqual([]);

});

test('UserRecord.insert returns UUID.', async () => {
    const user = new UserRecord(defaultObj);
    await user.insert();

    expect(user.id).toBeDefined();
    expect(typeof user.id).toBe('string');
});

test('UserRecord.insert inserts data to database.', async () => {
    const user = new UserRecord(defaultObj);
    await user.insert();

    const foundUser = await UserRecord.getOne(user.id)

    expect(foundUser).toBeDefined();
    expect(foundUser).not.toBeNull();
    expect(foundUser.id).toBe(user.id);
})