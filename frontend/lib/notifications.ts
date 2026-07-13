import type { Order, OrderItem } from '@/lib/mongodb';

export type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

export function buildOrderEmailPayloads(order: Order, items: OrderItem[]): EmailPayload[] {
  const itemRows = items
    .map(
      (item) => `
        <tr>
          <td style="padding: 8px 0;">${item.product_id}</td>
          <td style="padding: 8px 0;">${item.quantity}</td>
          <td style="padding: 8px 0;">₦${item.price_at_purchase.toLocaleString()}</td>
        </tr>
      `
    )
    .join('');

  const buyerHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
      <h2>Order confirmed</h2>
      <p>Hi ${order.customer_name},</p>
      <p>Your order <strong>${order.id}</strong> has been confirmed and paid successfully.</p>
      <p><strong>Payment reference:</strong> ${order.payment_reference}</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
        <thead>
          <tr>
            <th align="left">Item</th>
            <th align="left">Qty</th>
            <th align="left">Price</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>
      <p style="margin-top: 16px;">Thank you for shopping with us.</p>
    </div>
  `;

  const ownerHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
      <h2>New order received</h2>
      <p>A new order has been paid successfully.</p>
      <p><strong>Order ID:</strong> ${order.id}</p>
      <p><strong>Customer:</strong> ${order.customer_name} (${order.customer_email})</p>
      <p><strong>Payment reference:</strong> ${order.payment_reference}</p>
      <p><strong>Amount:</strong> ₦${order.amount.toLocaleString()}</p>
    </div>
  `;

  return [
    {
      to: order.customer_email,
      subject: 'Order confirmed - Battery Store',
      html: buyerHtml,
    },
    {
      to: process.env.STORE_OWNER_EMAIL ?? 'owner@example.com',
      subject: 'New order received - Battery Store',
      html: ownerHtml,
    },
  ];
}
