export type Role = 'guest' | 'driver' | 'staff' | 'manager' | 'admin';

export type View =
  | 'LOGIN'
  | 'REGISTER'
  | 'RESERVATION_CONFIRM'
  | 'PAYMENT_VNPAY'
  | 'PAYMENT_SUCCESS'
  | 'HISTORY'
  | 'DASHBOARD_CLIENT'
  | 'ADMIN_DASHBOARD'
  | 'PARKING_MAP'
  | 'TRANSACTIONS'
  | 'USER_MGMT'
  | 'REPORTS'
  | 'SYSTEM_SETTINGS';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  licensePlate: string;
  role: Role;
  joinedDate: string;
  status: 'ACTIVE' | 'INACTIVE';
  balance: number;
}

export interface Reservation {
  id: string;
  slotId: string;
  floor: string;
  licensePlate: string;
  vehicleType: 'oto' | 'xemay';
  startTime: string;
  endTime: string;
  durationHours: number;
  totalFee: number;
  status: 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
  dateStr: string;
}

export interface ParkingSlot {
  id: string;
  zone: 'A' | 'B' | 'C';
  floor: string;
  status: 'available' | 'reserved' | 'occupied';
  vehicleType: 'oto' | 'xemay';
  currentSession?: {
    licensePlate: string;
    checkInTime: string;
    estimatedHours: number;
    fee: number;
  };
}

export interface SystemLog {
  id: string;
  type: 'success' | 'info' | 'error' | 'warning';
  title: string;
  description: string;
  timeStr: string;
}

export interface Transaction {
  id: string;
  licensePlate: string;
  slotId: string;
  amount: number;
  timeStr: string;
  method: string;
  status: 'success' | 'failed' | 'pending';
}
