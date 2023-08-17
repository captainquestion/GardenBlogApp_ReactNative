const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  garden: { type: Array, default: [] },
  likes: { type: Number, default: 0 },
  sharedBy: { type: String, required: true },
  postId: { type: String, required: true, unique: true },
  gardenPicture: { type: String, default: null },
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  garden: { type: Array, default: [] },
  posts: { type: [PostSchema], default: [] },
});

module.exports = mongoose.model('User', UserSchema);





// const mongoose = require('mongoose');

// const UserSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   garden: { type: Array, default: [] }
// });

// module.exports = mongoose.model('User', UserSchema);
