const source = new Schema(
  {
    joined: { type: Date, default: Date.now },
    fatwa: { type: Number, default: 0 },
    add: { type: String, required: true, trim: true },
    about: { type: String, default: "", trim: true },
    id: { type: String, required: true, trim: true },
    pass: { type: String, required: true },
    name: {
      "en-US": { type: String, required: true, trim: true },
      "bn-BD": { type: String, required: true, trim: true },
    },
    status: { type: String, default: "pending" },
  },
  {
    discriminatorKey: "type",
  }
);

const Source = mongoose.model("Source", source);

const Jamia = Source.discriminator(
  "Jamia",
  new Schema({
    primeMufti: {
      "en-US": { type: String, required: true, trim: true },
      "bn-BD": { type: String, required: true, trim: true },
    },
    contact: { type: String, required: true, trim: true },
    founder: { type: String, default: "", trim: true },
    est: { type: String, default: "", trim: true },
    role: { type: String, default: "jamia" },
    appl: {
      name: { type: String, required: true, trim: true },
      des: { type: String, required: true, trim: true },
      mob: { type: String, required: true, trim: true },
    },
  })
);

const Mufti = Source.discriminator(
  "Mufti",
  new Schema({
    role: { type: String, default: "mufti" },
    mob: { type: String, required: true, trim: true },
    inst: {
      "en-US": { type: String, required: true, trim: true },
      "bn-BD": { type: String, required: true, trim: true },
    },
  })
);

exports.Source = Source;
exports.Jamia = Jamia;
exports.Mufti = Mufti;
