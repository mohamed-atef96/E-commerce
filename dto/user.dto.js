const UserDto = ({ _id, name, email, isAdmin }) => ({
  id: _id,
  name,
  email,
  isAdmin,
});

module.exports = { UserDto };
