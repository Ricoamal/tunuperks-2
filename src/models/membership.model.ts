import mongoose from 'mongoose';

export interface IMembership {
  name: string;
  description: string;
  price: number;
  duration: number; // in days
  benefits: string[];
  isActive: boolean;
}

const membershipSchema = new mongoose.Schema<IMembership>(
  {
    name: {
      type: String,
      required: [true, 'Membership name is required'],
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
    },
    benefits: [{
      type: String,
      required: [true, 'Benefits are required'],
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Membership = mongoose.model<IMembership>('Membership', membershipSchema);