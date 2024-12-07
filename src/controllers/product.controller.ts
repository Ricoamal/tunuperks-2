import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { Product } from '../models/product.model';
import { AppError } from '../utils/appError';

export class ProductController {
  static getAllProducts = catchAsync(async (req: Request, res: Response) => {
    const products = await Product.find();
    
    res.status(200).json({
      status: 'success',
      results: products.length,
      data: { products },
    });
  });

  static getProduct = catchAsync(async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    res.status(200).json({
      status: 'success',
      data: { product },
    });
  });

  static createProduct = catchAsync(async (req: Request, res: Response) => {
    const product = await Product.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { product },
    });
  });

  static updateProduct = catchAsync(async (req: Request, res: Response) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    res.status(200).json({
      status: 'success',
      data: { product },
    });
  });

  static deleteProduct = catchAsync(async (req: Request, res: Response) => {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
}