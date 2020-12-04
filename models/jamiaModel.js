// const jamia = new Schema({
//   joined: { type: Date, default: Date.now },
//   fatwa: { type: Number, default: 0, required: true },
//   name: {
//     "en-US": { type: String, required: true, trim: true },
//     "bn-BD": { type: String, required: true, trim: true },
//   },
//   founder: { type: String, default: "", trim: true },
//   est: { type: String, default: "", trim: true },
//   address: { type: String, required: true, trim: true },
//   contact: { type: String, required: true, trim: true },
//   about: { type: String, default: "", trim: true },
//   primeMufti: {
//     "en-US": { type: String, required: true, trim: true },
//     "bn-BD": { type: String, required: true, trim: true },
//   },
//   id: { type: String, required: true, trim: true, unique: true },
//   password: { type: String, required: true },
//   applicant: {
//     name: { type: String, required: true, trim: true },
//     designation: { type: String, required: true, trim: true },
//     mobile: { type: String, required: true, trim: true },
//   },
//   role: { type: String, default: "jamia" },
//   ghost: { type: Boolean, default: false },
// });

// const jamiaSubmissions = new Schema({
//   submitted: { type: Date, default: Date.now },
//   name: { type: String, required: true, trim: true },
//   address: { type: String, required: true, trim: true },
//   contact: { type: String, required: true, trim: true },
//   primeMufti: { type: String, required: true, trim: true },
//   id: { type: String, required: true, trim: true, unique: true },
//   password: { type: String, required: true },
//   applicant: {
//     name: { type: String, required: true, trim: true },
//     designation: { type: String, required: true, trim: true },
//     mobile: { type: String, required: true, trim: true },
//   },
// });

const passRecoveryToken = new Schema(
  {
    id: { type: String, required: true, unique: true },
    code: { type: String, required: true },
    expireAt: { type: Date, default: Date.now, index: { expires: "1m" } },
    try: { type: Number, default: 0 },
  },
  { timestamp: true }
);

// const JamiaSubmissions = mongoose.model("JamiaSubmissions", jamiaSubmissions);
// const Jamia = mongoose.model("Jamia", jamia);
const PassRecoveryToken = mongoose.model(
  "PassRecoveryToken",
  passRecoveryToken
);

// exports.JamiaSubmissions = JamiaSubmissions;
// exports.Jamia = Jamia;
exports.PassRecoveryToken = PassRecoveryToken;
