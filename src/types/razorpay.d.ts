declare interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name?: string;
    description?: string;
    image?: string;
    order_id?: string;
    callback_url?: string;
    prefill?: {
      name?: string;
      email?: string;
      contact?: string;
    };
    notes?: Record<string, string>;
    theme?: {
      color?: string;
    };
  }
  
  declare class Razorpay {
    constructor(options: RazorpayOptions);
    open(): void;
    on(event: string, callback: (response: any) => void): void;
  }
  