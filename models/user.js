import { Schema, model } from 'mongoose'
import { hash } from 'bcrypt'
  // This code creates a new schema that is used to define the User model
// The schema contains the fields for a user, as well as the timestamps
// that are automatically added when the user is created and updated
const UserSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      auto: true
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'customer',
      autopopulate: true
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      required: true
    },
    password: {
      type: String
    },
    role: {
      type: String,
      default: 'User',
      enum: ['User', 'Manager', 'Admin']
    },
    active: {
      type: Boolean,
      default: true
    },
    last: {
      type: Date
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: true
  }
)

UserSchema.static('register',  async function(email, password) {
  return await model('User').create({email, password: await hash(password, 10)})
})

const User = model('User', UserSchema, 'users')
export default User