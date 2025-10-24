const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const WebUsersSchema = new mongoose.Schema({
  uid: {
    type: String,
    required:true
  },
  firstName: {
    type: String,
    required:true
  },
  lastName: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: { 
    type: String, 
    required: true,
    select: false,
  },
  employeenum: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true,
    enum: ["Professor", "Sub Admin"]
  },
  useravatar: {
    type: String,
    required: true
  },
  isApproved: {
    type: Boolean,
    required: true,
    default: false
  },
  is_deleted: {
    type: Boolean,
    required: true,
    default: false
  },
  lifespan: { 
    type: Date, 
    required: true, 
    index: { expires: 0 } 
  },
  theme:{
    type: String,
    required: true,
    default: "#ffffff"
  }
  }, { timestamps: true })

WebUsersSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

WebUsersSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const WebUsersModel = mongoose.model("webusers", WebUsersSchema);

module.exports = WebUsersModel;