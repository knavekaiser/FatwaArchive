const userModel = new Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true, unique: true },
  pass: { type: String, require: true },
  role: { type: String, required: true },
  ghost: { type: Boolean, default: false },
});

const User = mongoose.model("User", userModel);

global.User = User;
