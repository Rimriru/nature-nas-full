import mongoose from 'mongoose';
import bcrypt from 'mongoose-bcrypt';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Требуется имя пользователя'],
      unique: true
    },
    password: {
      type: String,
      required: [true, 'Требуется пароль'],
      bcrypt: true
    }
  },
  { versionKey: false }
);

userSchema.plugin(bcrypt);

const User = mongoose.model('user', userSchema);
export default User;
