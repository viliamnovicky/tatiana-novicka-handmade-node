const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
    name: {
        type: "String",
        unique: [true, "Tento už´vateľ už existuje."],
        required: [true, "Prosím, zadajte meno užívateľa."]
    },
    password: {
        type: "String",
        required: [true, "Prosím, zadajte heslo."]
    },
    passwordConfirm: {
        type: "String",
        required: [true, "Prosím, zopakujte heslo."]
    },
    passwordChangedAt: {
        type: Date,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
})

adminSchema.pre(/^find/, function (next) {
    // this points to current query
    this.find({ active: { $ne: false } }); // active != false
    next();
});

adminSchema.pre('save', async function (next) {
    // only runs if password was modified
    if (!this.isModified('password')) return next();

    // hash the password, optimal cost number is 12
    this.password = await bcrypt.hash(this.password, 14); // more higher number = better encryption = more cpu power needed

    // delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});

adminSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000; // Somethimes token is created before passwordChangedAt, then we cannot log in, setting passwordChangedAt 1 second to the past fix this problem
    next();
});

adminSchema.methods.correctPassword = async function (
    candidatePassword,
    adminPassword
  ) {
    return await bcrypt.compare(candidatePassword, adminPassword);
  };
  
  adminSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(
        this.passwordChangedAt.getTime() / 1000,
        10
      );
      return JWTTimestamp < changedTimestamp;
    }
  
    // False means NOT changed
    return false;
  };
  
  adminSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
  
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  
    console.log({ resetToken }, this.passwordResetToken);
  
    return resetToken;
  };
  
  const Admin = mongoose.model('Admin', adminSchema);
  
  module.exports = Admin;