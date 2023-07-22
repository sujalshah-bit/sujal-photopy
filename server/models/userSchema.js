
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

module.exports = User;













// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },

//   gallery: [gallerySchema], // Use the modified gallerySchema directly
// });

// // Hash the password before saving it to the database
// userSchema.pre('save', async function (next) {
//     if (this.isModified('password')) {
//       try {
//         const hashedPassword = await bcrypt.hash(this.password, saltRounds);
//         this.password = hashedPassword;
//       } catch (error) {
//         return next(error);
//       }
//     }
//     next();
//   });

// const User = mongoose.model('User', userSchema);

// module.exports = User;
