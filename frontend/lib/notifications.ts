import type { Order, OrderItem } from '@/lib/database/mongodb.connection';
import { sendEmail, type EmailPayload, type EmailSendResult } from '@/lib/email';

export type OrderNotificationResult = {
  ok: boolean;
  payloads: EmailPayload[];
  deliveries: EmailSendResult[];
  message: string;
};

function titleCase(value: string) {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function buildOrderEmailPayloads(order: Order, items: OrderItem[]): EmailPayload[] {
  const isPaid = order.status === 'paid';


  const itemRows = items
    .map(
      (item) => `
        <tr>
          <td style="padding: 8px 0;">${item.product_name}</td>
          <td style="padding: 8px 0;">${item.quantity}</td>
          <td style="padding: 8px 0;">₦${item.unit_price.toLocaleString()}</td>
        </tr>
      `
    )
    .join('');

  const buyerTitle = isPaid ? 'Order confirmed' : 'Order received';
  const buyerIntro = isPaid
    ? `Your order <strong>${order.id}</strong> has been confirmed and paid successfully.`
    : `We have received your order <strong>${order.id}</strong> and it is currently awaiting payment confirmation.`;
  const buyerPaymentMessage = `<p><strong>Payment method:</strong> ${titleCase(order.payment_method)}</p>`;

  const buyerHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
      <h2>${buyerTitle}</h2>
      <p>Hi ${order.customer_name},</p>
      <p>${buyerIntro}</p>
      <p><strong>Payment reference:</strong> ${order.payment_reference}</p>
      ${buyerPaymentMessage}
      <p><strong>Delivery method:</strong> ${titleCase(order.delivery_method)}</p>
      <p><strong>Delivery address:</strong> ${order.address}, ${order.city}, ${order.state}</p>
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
      <p style="margin-top: 16px;"><strong>Order total:</strong> ₦${order.amount.toLocaleString()}</p>
      <p style="margin-top: 16px;">Thank you for shopping with us.</p>
    </div>
  `;

  const ownerHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
      <h2>${isPaid ? 'Payment confirmed' : 'New order received'}</h2>
      <p>${isPaid ? 'A customer payment has been verified successfully.' : 'A new Paystack order has been placed and is awaiting payment confirmation.'}</p>
      <p><strong>Order ID:</strong> ${order.id}</p>
      <p><strong>Customer:</strong> ${order.customer_name} (${order.customer_email})</p>
      <p><strong>Phone:</strong> ${order.customer_phone}</p>
      <p><strong>Payment method:</strong> ${titleCase(order.payment_method)}</p>
      <p><strong>Payment reference:</strong> ${order.payment_reference}</p>
      <p><strong>Status:</strong> ${titleCase(order.status)}</p>
      <p><strong>Delivery:</strong> ${titleCase(order.delivery_method)}</p>
      <p><strong>Address:</strong> ${order.address}, ${order.city}, ${order.state}</p>
      <p><strong>Amount:</strong> ₦${order.amount.toLocaleString()}</p>
      ${order.notes ? `<p><strong>Customer notes:</strong> ${order.notes}</p>` : ''}
    </div>
  `;

  return [
    {
      to: order.customer_email,
      subject: isPaid ? 'Order confirmed - Battery Store' : 'Order received - Battery Store',
      html: buyerHtml,
    },
    {
      to: process.env.STORE_OWNER_EMAIL ?? 'owner@example.com',
      subject: isPaid ? 'Payment confirmed - Battery Store' : 'New order received - Battery Store',
      html: ownerHtml,
    },
  ];
}

export async function sendOrderEmailNotifications(
  order: Order,
  items: OrderItem[]
): Promise<OrderNotificationResult> {
  const payloads = buildOrderEmailPayloads(order, items);
  const deliveries = await Promise.all(payloads.map((payload) => sendEmail(payload)));
  const ok = deliveries.every((delivery) => delivery.ok || delivery.skipped);
  const skipped = deliveries.every((delivery) => delivery.skipped);

  return {
    ok,
    payloads,
    deliveries,
    message: skipped
      ? 'Email sending skipped because Resend is not configured.'
      : ok
        ? 'Email notifications processed successfully.'
        : 'One or more email notifications failed.',
  };
}
