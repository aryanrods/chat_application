import moongoose from "mongoose";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import { type } from "os";
import { stringify } from "querystring";

const userSchema = new moongose.userSchema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    Username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilepic: {
      type: String,
      default: "",
    },
    contacts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 12);
    }
    next(); // Proceed
  } catch (error) {
    next(error);
  }
});

userSchema.methods.generateAuthToken = async function () {
  try {
    let tok = jwt.sign(
      { id: this._id, email: this.email },
      process.env.SECRET_KEY,
      {
        expiresIn: "48h",
      }
    );

    return tok;
  } catch (error) {
    console.log("Error in generating token", error);
  }
};

const userModel = mongoose.model("User", userSchema);
export default userModel;
