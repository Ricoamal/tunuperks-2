import axios from 'axios';
import { config } from '../../config/environment';

export class MpesaService {
  private static baseUrl = 'https://sandbox.safaricom.co.ke';
  private static auth: string | null = null;
  private static authExpiry: number = 0;

  private static async getAuth() {
    if (this.auth && Date.now() < this.authExpiry) {
      return this.auth;
    }

    const credentials = Buffer.from(
      `${config.MPESA_CONSUMER_KEY}:${config.MPESA_CONSUMER_SECRET}`
    ).toString('base64');

    const { data } = await axios.get(
      `${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      }
    );

    this.auth = data.access_token;
    this.authExpiry = Date.now() + (data.expires_in - 60) * 1000;
    return this.auth;
  }

  static async initiateSTKPush(phoneNumber: string, amount: number, orderId: string) {
    const auth = await this.getAuth();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(
      `${config.MPESA_SHORTCODE}${config.MPESA_PASSKEY}${timestamp}`
    ).toString('base64');

    const { data } = await axios.post(
      `${this.baseUrl}/mpesa/stkpush/v1/processrequest`,
      {
        BusinessShortCode: config.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: phoneNumber,
        PartyB: config.MPESA_SHORTCODE,
        PhoneNumber: phoneNumber,
        CallBackURL: `${config.API_URL}/api/payments/mpesa/callback`,
        AccountReference: orderId,
        TransactionDesc: 'TunuPerks Payment',
      },
      {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      }
    );

    return data;
  }
}