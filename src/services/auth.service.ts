import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/user.model';
import { config } from '../config/environment';
import { AppError } from '../utils/appError';

export class AuthService {
  static generateToken(user: IUser): string {
    return jwt.sign({ id: user._id }, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRES_IN,
    });
  }

  static async register(userData: Partial<IUser>) {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new AppError('Email already exists', 400);
    }

    const user = await User.create(userData);
    const token = this.generateToken(user);

    return { user, token };
  }

  static async login(email: string, password: string) {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = this.generateToken(user);
    return { user, token };
  }
}