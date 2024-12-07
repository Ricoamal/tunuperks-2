import Stripe from 'stripe';
import { config } from '../config/environment';
import { AppError } from '../utils/appError';
import { Order } from '../models/order.model';

const stripe = new Stripe(config.STRIPE_SECRET_KEY);

export class PaymentService {
  static async createPaymentIntent(orderId: string) {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new AppError('Order not found', 404);
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalAmount * 100),
      currency: 'usd',
      metadata: { orderId: order._id.toString() },
    });

    return paymentIntent;
  }

  static async handleWebhook(event: Stripe.Event) {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await Order.findByIdAndUpdate(paymentIntent.metadata.orderId, {
          paymentStatus: 'completed',
          paymentId: paymentIntent.id,
        });
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        await Order.findByIdAndUpdate(failedPayment.metadata.orderId, {
          paymentStatus: 'failed',
        });
        break;
    }
  }
}