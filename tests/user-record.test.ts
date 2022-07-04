import {UserRecord} from "../records/user.record";

const defaultObj = {
    firstname: "Test firstname",
    lastname: "Test lastname",
    password: "Test password",
    address: "Test address",
}

test("Can build UserRecord", () => {
    const user = new UserRecord(defaultObj);

    expect(user.firstname).toBe("Test firstname");
    expect(user.lastname).toBe("Test lastname");
    expect(user.password).toBe("Test password");
    expect(user.address).toBe("Test address");
})

test("Validates incorrect firstname", () => {
    expect(() => new UserRecord({
        ...defaultObj,
        firstname: "",
    })).toThrow('Firstname field cannot be empty and longer than 100')
})

test("Validates incorrect lastname", () => {
    expect(() => new UserRecord({
        ...defaultObj,
        lastname: "",
    })).toThrow('Lastname field cannot be empty and longer than 100')
})

test("Validates incorrect address", () => {
    expect(() => new UserRecord({
        ...defaultObj,
        address: "",
    })).toThrow('Address field cannot be empty and longer than 1000')
})

test("Validates incorrect password", () => {
    expect(() => new UserRecord({
        ...defaultObj,
        password: "test",
    })).toThrow('Password field cannot be shorter than 6 and longer than 50')
})


