import { Resend } from 'resend';
import { db } from '@/database/client';
import { productTable } from '@/database/schema';
import { inArray } from 'drizzle-orm';

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL || 'orders@orders.java-lights.com';
const fromName = process.env.RESEND_FROM_NAME || 'JAVALIGHTS & PLUGS CONCEPTS';
const storeOwnerEmail = process.env.STORE_OWNER_EMAIL || 'javalights2@gmail.com';

const resend = resendApiKey ? new Resend(resendApiKey) : null;

export interface CustomerOrderDetails {
  orderId: string;
  orderReference: string;
  amount: number;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    deliveryMethod: string;
    paymentMethod: string;
    notes?: string;
    items: Array<{
      id: string;
      quantity: number;
      color?: string;
    }>;
    totals: {
      subtotal: number;
      deliveryFee: number;
      vatAmount: number;
      total: number;
    };
  };
  paymentReference?: string;
  paidAt?: Date | string;
}

interface ItemSummary {
  name: string;
  sku: string;
  quantity: number;
  price: number;
  color?: string;
  imageUrl?: string;
}

async function resolveOrderItems(items: Array<{ id: string; quantity: number; color?: string }>): Promise<ItemSummary[]> {
  if (!items || items.length === 0) return [];
  const ids = items.map((i) => i.id);

  let products: Array<{ id: string; name: string; sku: string; price: number; images: unknown }> = [];

  try {
    if (process.env.DATABASE_URL) {
      products = await db
        .select({
          id: productTable.id,
          name: productTable.name,
          sku: productTable.sku,
          price: productTable.price,
          images: productTable.images,
        })
        .from(productTable)
        .where(inArray(productTable.id, ids));
    }
  } catch (err) {
    console.warn('[EmailService] Could not query products from DB:', err);
  }

  const map = new Map(products.map((p) => [p.id, p]));

  return items.map((item) => {
    const prod = map.get(item.id);
    let imageUrl: string | undefined;
    if (prod?.images) {
      try {
        const parsed = typeof prod.images === 'string' ? JSON.parse(prod.images) : prod.images;
        if (Array.isArray(parsed) && parsed.length > 0) imageUrl = parsed[0];
      } catch {
        // ignore
      }
    }

    return {
      name: prod?.name || `Product #${item.id}`,
      sku: prod?.sku || '',
      quantity: item.quantity,
      price: prod ? Number(prod.price) : 0,
      color: item.color,
      imageUrl,
    };
  });
}

function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Builds HTML for Buyer Confirmation Email
 */
function buildBuyerConfirmationHtml(order: CustomerOrderDetails, resolvedItems: ItemSummary[]): string {
  const customer = order.customerInfo;
  const fullName = `${customer.firstName} ${customer.lastName}`.trim();

  const itemsHtml = resolvedItems
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px 8px; border-bottom: 1px solid #E5E7EB; vertical-align: middle;">
        <div style="font-weight: 600; color: #111827; font-size: 14px;">${item.name}</div>
        <div style="font-size: 12px; color: #6B7280;">SKU: ${item.sku || 'N/A'}${item.color ? ` | Color: ${item.color}` : ''}</div>
      </td>
      <td style="padding: 12px 8px; border-bottom: 1px solid #E5E7EB; text-align: center; color: #374151; font-size: 14px; vertical-align: middle;">
        ${item.quantity}
      </td>
      <td style="padding: 12px 8px; border-bottom: 1px solid #E5E7EB; text-align: right; color: #111827; font-weight: 600; font-size: 14px; vertical-align: middle;">
        ${formatNaira(item.price * item.quantity)}
      </td>
    </tr>
  `
    )
    .join('');

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation - ${order.orderReference}</title>
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F3F4F6; margin: 0; padding: 24px 12px; color: #1F2937;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
      
      <!-- Header -->
      <div style="background-color: #0D1B2A; padding: 28px 24px; text-align: center; border-bottom: 4px solid #CC0000;">
        <h1 style="color: #FFFFFF; margin: 0; font-size: 22px; letter-spacing: 0.5px; text-transform: uppercase;">JAVALIGHTS & PLUGS CONCEPTS</h1>
        <p style="color: #9CA3AF; margin: 6px 0 0; font-size: 13px;">Premium Electrical Switches, Sockets & Lighting Solutions</p>
      </div>

      <!-- Main Body -->
      <div style="padding: 32px 24px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="display: inline-block; background-color: #ECFDF5; border-radius: 50%; padding: 12px; margin-bottom: 12px;">
            <span style="font-size: 28px; line-height: 1;">✓</span>
          </div>
          <h2 style="margin: 0; color: #065F46; font-size: 20px;">Payment Confirmed & Order Placed!</h2>
          <p style="margin: 8px 0 0; color: #4B5563; font-size: 14px;">Hi ${fullName}, thank you for your purchase. We are preparing your order for dispatch.</p>
        </div>

        <!-- Order Summary Box -->
        <div style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="color: #6B7280; padding: 4px 0;">Order Reference:</td>
              <td style="text-align: right; font-weight: 700; color: #111827; padding: 4px 0;">${order.orderReference}</td>
            </tr>
            <tr>
              <td style="color: #6B7280; padding: 4px 0;">Payment Status:</td>
              <td style="text-align: right; font-weight: 700; color: #059669; padding: 4px 0;">SUCCESSFUL (PAID)</td>
            </tr>
            <tr>
              <td style="color: #6B7280; padding: 4px 0;">Delivery Method:</td>
              <td style="text-align: right; text-transform: capitalize; color: #111827; padding: 4px 0;">${customer.deliveryMethod}</td>
            </tr>
          </table>
        </div>

        <!-- Items Table -->
        <h3 style="margin: 0 0 12px; font-size: 16px; color: #111827; border-bottom: 2px solid #F3F4F6; padding-bottom: 8px;">Items Ordered</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #F9FAFB; text-align: left; font-size: 12px; color: #6B7280; text-transform: uppercase;">
              <th style="padding: 8px; font-weight: 600;">Product</th>
              <th style="padding: 8px; text-align: center; font-weight: 600;">Qty</th>
              <th style="padding: 8px; text-align: right; font-weight: 600;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <!-- Totals Breakdown -->
        <div style="background-color: #F9FAFB; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 4px 0; color: #4B5563;">Subtotal:</td>
              <td style="padding: 4px 0; text-align: right; color: #111827;">${formatNaira(customer.totals.subtotal)}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #4B5563;">Delivery Fee:</td>
              <td style="padding: 4px 0; text-align: right; color: #111827;">${customer.totals.deliveryFee === 0 ? 'Free' : formatNaira(customer.totals.deliveryFee)}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #4B5563;">VAT:</td>
              <td style="padding: 4px 0; text-align: right; color: #111827;">${formatNaira(customer.totals.vatAmount)}</td>
            </tr>
            <tr style="border-top: 1px solid #D1D5DB; font-size: 16px;">
              <td style="padding: 10px 0 0; font-weight: 700; color: #0D1B2A;">Total Paid:</td>
              <td style="padding: 10px 0 0; text-align: right; font-weight: 700; color: #CC0000; font-size: 18px;">${formatNaira(order.amount)}</td>
            </tr>
          </table>
        </div>

        <!-- Delivery Address -->
        <div style="border-left: 4px solid #CC0000; padding: 8px 16px; background-color: #FDF2F2; border-radius: 0 8px 8px 0; margin-bottom: 28px;">
          <h4 style="margin: 0 0 4px; color: #991B1B; font-size: 14px; text-transform: uppercase;">Delivery Information</h4>
          <p style="margin: 0; color: #374151; font-size: 13px; line-height: 1.5;">
            <strong>Recipient:</strong> ${fullName}<br>
            <strong>Phone:</strong> ${customer.phone}<br>
            <strong>Address:</strong> ${customer.address}, ${customer.city}, ${customer.state} State
          </p>
        </div>

        <div style="text-align: center; color: #6B7280; font-size: 13px; line-height: 1.5;">
          Have questions regarding your order? Simply reply to this email or contact us at <a href="mailto:javalights2@gmail.com" style="color: #CC0000; text-decoration: none; font-weight: 600;">javalights2@gmail.com</a>.
        </div>
      </div>

      <!-- Footer -->
      <div style="background-color: #F9FAFB; padding: 16px 24px; text-align: center; border-top: 1px solid #E5E7EB; font-size: 12px; color: #9CA3AF;">
        © ${new Date().getFullYear()} JAVALIGHTS & PLUGS CONCEPTS. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
}

/**
 * Builds HTML for Store Owner Notification Email
 */
function buildOwnerNotificationHtml(order: CustomerOrderDetails, resolvedItems: ItemSummary[]): string {
  const customer = order.customerInfo;
  const fullName = `${customer.firstName} ${customer.lastName}`.trim();

  const itemsHtml = resolvedItems
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px 8px; border-bottom: 1px solid #E5E7EB;">
        <strong style="color: #111827;">${item.name}</strong><br>
        <span style="font-size: 12px; color: #6B7280;">SKU: ${item.sku || 'N/A'}${item.color ? ` | Color: ${item.color}` : ''}</span>
      </td>
      <td style="padding: 10px 8px; border-bottom: 1px solid #E5E7EB; text-align: center; font-weight: 600;">
        ${item.quantity}
      </td>
      <td style="padding: 10px 8px; border-bottom: 1px solid #E5E7EB; text-align: right; font-weight: 600;">
        ${formatNaira(item.price * item.quantity)}
      </td>
    </tr>
  `
    )
    .join('');

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Order Alert - ${order.orderReference}</title>
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F3F4F6; margin: 0; padding: 24px 12px; color: #1F2937;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
      
      <!-- Top banner -->
      <div style="background-color: #CC0000; padding: 24px; text-align: center; color: #FFFFFF;">
        <span style="background-color: rgba(255, 255, 255, 0.2); padding: 4px 12px; border-radius: 16px; font-size: 12px; font-weight: 600; text-transform: uppercase;">
          New Paid Order Alert
        </span>
        <h1 style="margin: 12px 0 0; font-size: 24px; font-weight: 700;">${formatNaira(order.amount)} Received</h1>
        <p style="margin: 4px 0 0; font-size: 14px; opacity: 0.9;">Order Ref: ${order.orderReference}</p>
      </div>

      <div style="padding: 24px;">
        <!-- Customer Details Card -->
        <div style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 12px; font-size: 15px; color: #111827; text-transform: uppercase; border-bottom: 1px solid #E5E7EB; padding-bottom: 6px;">Customer Details</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="color: #6B7280; padding: 4px 0; width: 120px;">Customer:</td>
              <td style="font-weight: 600; color: #111827; padding: 4px 0;">${fullName}</td>
            </tr>
            <tr>
              <td style="color: #6B7280; padding: 4px 0;">Email:</td>
              <td style="color: #111827; padding: 4px 0;"><a href="mailto:${customer.email}" style="color: #CC0000;">${customer.email}</a></td>
            </tr>
            <tr>
              <td style="color: #6B7280; padding: 4px 0;">Phone:</td>
              <td style="font-weight: 600; color: #111827; padding: 4px 0;"><a href="tel:${customer.phone}" style="color: #111827; text-decoration: none;">${customer.phone}</a></td>
            </tr>
            <tr>
              <td style="color: #6B7280; padding: 4px 0;">Delivery Address:</td>
              <td style="color: #111827; padding: 4px 0;">${customer.address}, ${customer.city}, ${customer.state} State</td>
            </tr>
            <tr>
              <td style="color: #6B7280; padding: 4px 0;">Delivery Method:</td>
              <td style="text-transform: capitalize; color: #111827; padding: 4px 0;">${customer.deliveryMethod}</td>
            </tr>
            ${customer.notes ? `
            <tr>
              <td style="color: #6B7280; padding: 4px 0;">Order Notes:</td>
              <td style="color: #B45309; padding: 4px 0; font-style: italic;">${customer.notes}</td>
            </tr>` : ''}
          </table>
        </div>

        <!-- Ordered Items -->
        <h3 style="margin: 0 0 12px; font-size: 15px; color: #111827; text-transform: uppercase;">Items to Dispatch</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #F3F4F6; text-align: left; color: #6B7280;">
              <th style="padding: 8px;">Item</th>
              <th style="padding: 8px; text-align: center;">Qty</th>
              <th style="padding: 8px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <!-- Revenue Breakdown -->
        <div style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 14px; margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px;">
            <span style="color: #6B7280;">Items Subtotal:</span>
            <span>${formatNaira(customer.totals.subtotal)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px;">
            <span style="color: #6B7280;">Delivery Fee:</span>
            <span>${formatNaira(customer.totals.deliveryFee)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px;">
            <span style="color: #6B7280;">VAT (7.5%):</span>
            <span>${formatNaira(customer.totals.vatAmount)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: 700; border-top: 1px solid #E5E7EB; padding-top: 8px;">
            <span style="color: #0D1B2A;">Total Paid:</span>
            <span style="color: #CC0000;">${formatNaira(order.amount)}</span>
          </div>
        </div>

        <div style="text-align: center;">
          <a href="tel:${customer.phone}" style="display: inline-block; background-color: #0D1B2A; color: #FFFFFF; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px;">
            Call Customer (${customer.phone})
          </a>
        </div>
      </div>

      <div style="background-color: #F9FAFB; padding: 12px 24px; text-align: center; border-top: 1px solid #E5E7EB; font-size: 12px; color: #9CA3AF;">
        Automated Store Alert from JAVALIGHTS & PLUGS CONCEPTS Web Portal
      </div>
    </div>
  </body>
  </html>
  `;
}

/**
 * Main email sender function triggered after payment is confirmed
 */
export async function sendOrderPaymentEmails(order: CustomerOrderDetails): Promise<{
  buyerSent: boolean;
  ownerSent: boolean;
  buyerError?: string;
  ownerError?: string;
}> {
  if (!resend) {
    console.warn('[EmailService] Resend API key is not configured. Skipping email dispatch.');
    return {
      buyerSent: false,
      ownerSent: false,
      buyerError: 'RESEND_API_KEY missing',
      ownerError: 'RESEND_API_KEY missing',
    };
  }

  const sender = `${fromName} <${fromEmail}>`;
  const resolvedItems = await resolveOrderItems(order.customerInfo.items);

  let buyerSent = false;
  let ownerSent = false;
  let buyerError: string | undefined;
  let ownerError: string | undefined;

  // 1. Send Buyer Confirmation Email
  if (order.customerInfo.email) {
    try {
      const buyerResponse = await resend.emails.send({
        from: sender,
        to: order.customerInfo.email,
        replyTo: storeOwnerEmail,
        subject: `Order Confirmed: ${order.orderReference} - JAVALIGHTS & PLUGS CONCEPTS`,
        html: buildBuyerConfirmationHtml(order, resolvedItems),
      });

      if (buyerResponse.error) {
        buyerError = buyerResponse.error.message;
        console.error('[EmailService] Buyer email send error:', buyerResponse.error);
      } else {
        buyerSent = true;
        console.log(`[EmailService] Buyer confirmation email sent to ${order.customerInfo.email} (${buyerResponse.data?.id})`);
      }
    } catch (err) {
      buyerError = err instanceof Error ? err.message : String(err);
      console.error('[EmailService] Unexpected error sending buyer email:', err);
    }
  }

  // 2. Send Owner Notification Email
  if (storeOwnerEmail) {
    try {
      const ownerResponse = await resend.emails.send({
        from: sender,
        to: storeOwnerEmail,
        replyTo: order.customerInfo.email,
        subject: `🔔 New Order Placed: ${order.orderReference} (${formatNaira(order.amount)})`,
        html: buildOwnerNotificationHtml(order, resolvedItems),
      });

      if (ownerResponse.error) {
        ownerError = ownerResponse.error.message;
        console.error('[EmailService] Owner notification email send error:', ownerResponse.error);
      } else {
        ownerSent = true;
        console.log(`[EmailService] Owner alert email sent to ${storeOwnerEmail} (${ownerResponse.data?.id})`);
      }
    } catch (err) {
      ownerError = err instanceof Error ? err.message : String(err);
      console.error('[EmailService] Unexpected error sending owner email:', err);
    }
  }

  return {
    buyerSent,
    ownerSent,
    buyerError,
    ownerError,
  };
}
