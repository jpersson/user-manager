// Model types
class User {
  constructor (object) {
    this.id = object.id
    this.name = object.name
    this.email = object.email
    this.address = object.address
    this.age = object.age
  }
}
class Manager {
  constructor(id) {
    this.id = id
  }
}

let userIdSequence = 0

const manager = new Manager(1)
const users = []
const getNextUserId = () => (userIdSequence++).toString()

// Mock data
function setupTestData() {
  [
    {name:'John Doe', age: 23, email: 'john.doe@example.com', address: 'Address'},
    {name:'Jane Doe', age: 45, email: 'jane.doe@example.com', address: 'Address'},
  ].map(addUser)
}

function _userIndexById(id) {
  return users.findIndex(user => user.id == id)
}

function addUser(input) {
  const newUser = new User(Object.assign({id: getNextUserId()}, input))
  users.push(newUser)
  return newUser.id
}

function removeUser(id) {
  const index = _userIndexById(id)
  if (index !== -1) users.splice(index, 1)
}

function removeAllUsers() {
  users.splice(0)
}

function modifyUser(user) {
  const index = _userIndexById(user.id)
  if (index !== -1) {
    users[index] = new User(Object.assign({id: user.id}, user))
  }
}

function getUser(id) {
  return users.find(user => user.id == id)
}

function getUsers(filter = {}) {
  if(filter.minAge) return users.filter(user => user.age >= filter.minAge)
  else return users
}

setupTestData()

module.exports = {
  addUser,
  getManager: () => manager,
  getUser,
  getUsers,
  modifyUser,
  removeAllUsers,
  removeUser,
  setupTestData,
  Manager,
  User
}
