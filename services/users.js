const model = require('../models/users');
const { NotFoundError, WrongInputError} = require('./errors');

function getAllUsers() {
   return model.getAll()
  }
  
function addUser(firstName, lastName, email) {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!firstName || !lastName || !email) {
        throw new WrongInputError('first name, last name and email are required.' );
    }
    
    if (!emailRegex.test(email)) {
        throw new WrongInputError('Invalid email format.' );
    }
    // check if email already exists

    return model.addUser(firstName, lastName, email);
}


async function updateUser(id, firstName, lastName, email) {
    user = await model.getUser(id)
    if (!user || user.length === 0){
        throw new NotFoundError('user is not found' );

    }

 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!firstName || !lastName || !email) {
        throw new WrongInputError('first name, last name and email are required.' );
    }
    
    if (!emailRegex.test(email)) {
        throw new WrongInputError('Invalid email format.' );
    }
    return model.updateUser(id, firstName, lastName, email);

}


async function deleteUser(id) {

    user = await model.getUser(id)
    if (!user|| user.length === 0){
        throw new NotFoundError('user is not found' );

    }
        return model.deleteUser(id);
     

}

  module.exports = {
    getAllUsers,
    addUser, 
    updateUser,
    deleteUser
  }