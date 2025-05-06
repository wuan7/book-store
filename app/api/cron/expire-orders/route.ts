import { expirePendingOrders } from '../../../../utils/expirePendingOrders';
import { NextResponse } from 'next/server';

export async function GET() {
  await expirePendingOrders();
  return NextResponse.json({ message: 'Đã kiểm tra đơn hết hạn' });
}
