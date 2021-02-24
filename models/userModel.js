const userModel = new Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  mob: { type: String, required: true, unique: true },
  pass: { type: String, require: true },
  role: { type: String, required: true },
  status: { type: String, default: "active" },
});

const User = mongoose.model("User", userModel);
global.User = User;

const gCloud = new Schema(
  {
    month: { type: String, required: true, unique: true },
    usage: {
      translate: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);
global.GCloud = mongoose.model("GCloud", gCloud);
