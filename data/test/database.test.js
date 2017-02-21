import database from '../database'

beforeEach(() => {
  database.removeAllUsers()
});

test('adding and getting a new user', () => {
  const user = {address: "Address", age: 45, email: "jane.doe@example.com", name: "Jane Doe"}
  const id = database.addUser(user)
  const fromDB = database.getUser(id)

  expect(fromDB.name).toEqual(user.name)
  expect(fromDB.address).toEqual(user.address)
  expect(fromDB.email).toEqual(user.email)
  expect(fromDB.age).toEqual(user.age)
})

test('removing existing user', () => {
  const user = {address: "Address", age: 45, email: "jane.doe@example.com", name: "Jane Doe"}
  const id = database.addUser(user)

  database.removeUser(id)

  expect(database.getUsers().length).toEqual(0)
  expect(database.getUser(id)).toEqual(undefined)
})

test('modifying existing user', () => {
  const user = {address: "Address", age: 45, email: "jane.doe@example.com", name: "Jane Doe"}
  const id = database.addUser(user)

  database.modifyUser({id: id, age:99, name: 'Jane Fonda'})

  const updated = database.getUser(id)

  expect(updated.age).toEqual(99)
  expect(updated.name).toEqual('Jane Fonda')
})

test('filtering users by age', () => {
  const users = [
    {address: "Address", age: 45, email: "jane.doe@example.com", name: "Jane Doe"},
    {address: "Address", age: 30, email: "jane.doe@example.com", name: "Jane Doe"},
  ]
  const getAges = (filter) => database.getUsers(filter).map(u => u.age)

  users.forEach(database.addUser)

  expect(getAges()).toEqual([45,30])
  expect(getAges({minAge: 0})).toEqual([45,30])
  expect(getAges({minAge: 35})).toEqual([45])
})
