import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { Order } from '../models/order.model';
import { AppError } from '../utils/appError';
import { PaymentService } from '../services/payment.service';
import { MpesaService } from '../services/payment/mpesa.service';
import { GiftPesaService } from '../services/payment/giftpesa.service';
import { AuthRequest } from '../middleware/auth';

export class OrderController {
  static getMyOrders = catchAsync(async (req: AuthRequest, res: Response) => {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product');

    res.status(200).json({
      status: 'success',
      results: orders.length,
      data: { orders },
    });
  });

  static getOrder = catchAsync(async (req: AuthRequest, res: Response) => {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate('items.product');

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    res.status(200).json({
      status: 'success',
      data: { order },
    });
  });

  static createOrder = catchAsync(async (req: AuthRequest, res: Response) => {
    const order = await Order.create({
      ...req.body,
      user: req.user._id,
    });

    res.status(201).json({
      status: 'success',
      data: { order },
    });
  });

  static processPayment = catchAsync(async (req: AuthRequest, res: Response) => {
    const { paymentMethod } = req.body;
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    let paymentResponse;

    switch (paymentMethod) {
      case 'stripe':
        paymentResponse = await PaymentService.createPaymentIntent(order._id.toString());
        break;
      case 'mpesa':
        paymentResponse = await MpesaService.initiateSTKPush(
          req.user.phoneNumber,
          order.totalAmount,
          order._id.toString()
        );
        break;
      case 'giftpesa':
        paymentResponse = await GiftPesaService.createPayment(
          order.totalAmount,
          order._id.toString(),
          req.user.email
        );
        break;
      default:
        throw new AppError('Invalid payment method', 400);
    }

    res.status(200).json({
      status: 'success',
      data: { payment: paymentResponse },
    });
  });
}