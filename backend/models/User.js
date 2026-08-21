// User model - yahan define kar rahe hain ke MongoDB me user document kaisa dikhega
// plus password hash karne aur match karne ke helper methods (register/login me use hote hain)
import mongoose from "mongoose"; // Schema aur Model banane ke liye
import bcrypt from "bcryptjs"; // password hash karne ke liye - plain text kabhi save nahi karte

// Schema batata hai ke user document me kaunse fields honge aur unki validation rules
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true, // aage peeche ki extra space khud remove ho jati hai
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name must be under 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // ek email sirf ek hi user ke liye ho sakta hai (unique index bhi ban jata hai)
      lowercase: true, // "A@B.com" aur "a@b.com" dono ek jaise treat honge
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"], // basic email format check
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // normal query me password field wapis nahi aayega - extra security
    },
    role: {
      type: String,
      enum: ["user", "admin"], // bas yehi do values allowed hain
      default: "user", // by default har koi normal user hoga, admin manually banana padega
    },
  },
  {
    timestamps: true, // createdAt aur updatedAt khud add ho jayenge
  }
);

// pre-save hook - document save hone se pehle yeh khud chal jata hai
// yahan hum password ko hash karte hain taake DB me plain text kabhi na jaye
userSchema.pre("save", async function (next) {
  // agar password change hi nahi hua (jaise profile update me sirf name badla ho)
  // to dobara hash karne ki zarurat nahi, time bachao
  if (!this.isModified("password")) {
    return next();
  }

  // salt ek random value hai jo hash ke sath mix hoti hai
  // taake same password bhi alag hash bane (rainbow-table attack se bachne ke liye)
  const salt = await bcrypt.genSalt(10);

  // ab plain password ko hash se replace kar do save hone se pehle
  this.password = await bcrypt.hash(this.password, salt);
  next(); // ab asal save operation chalne do
});

// yeh method login ke waqt use hota hai - user.matchPassword("typed123") call karke
// check karte hain ke typed password DB wale hash se match karta hai ya nahi
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Schema ko Model me convert kar diya - Mongoose khud "users" collection use karega
export default mongoose.model("User", userSchema);