import axios from 'axios';
import { config } from '../../config/environment';

export class GiftPesaService {
  private static baseUrl = 'https://api.giftpesa.com/v1';

  static async createPayment(amount: number, orderId: string, email: string) {
    const { data } = await axios.post(
      `${this.baseUrl}/transactions`,
      {
        amount,
        currency: 'KES',
        email,
        reference: orderId,
        callback_url: `${config.API_URL}/api/payments/giftpesa/callback`,
      },
      {
        headers: {
          'Authorization': `Bearer ${config.GIFTPESA_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return data;
  }

  static async verifyPayment(transactionId: string) {
    const { data } = await axios.get(
      `${this.baseUrl}/transactions/${transactionId}`,
      {
        headers: {
          'Authorization': `Bearer ${config.GIFTPESA_API_KEY}`,
        },
      }
    );

    return data;
  }
}