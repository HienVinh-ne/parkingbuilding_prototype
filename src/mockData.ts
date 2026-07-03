import { User, Reservation, ParkingSlot, SystemLog, Transaction } from './types';

export const ADMIN_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_suVWspqEMUvAsRse3Q1H3I_bsmsLtE_9waU1HptDdCrx-QVuXXUlk-RritVBlu6we7S3e1Z8tVkeE9iLT3-BHkyUVwPaXxhXjAmxMDD0HIMhF7M0rnwDxN4A9KfSRkHpbdyLOEz42muVQfbb9mwmNuoIUrzYY-S_2DGJI_lkEiBmRywMwTWx59lXYBGgjQNgorLx2UZ8quJSJ5Mxw1ahG5PuCcsORo_327u62B-YGBisZlxGgagxBQ';
export const PARKING_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJCo_lUSBnkQm1K5M3ekLKqJH1jj3qAyGstzt5b7qJ0ldqBMwjAQw_RvfWqlrVbmoSziR5QxI3Lt7uluEwQ4h2bc7WCzJwaud5vNmz-_G3PDTb2xSqbI199VmxsjtGEzUg8WX1eVndokVtJxi3Yasv5WtDI9oudj2ikpHMVVKxQv1d-B9PPJHx42PP0gEo4KCuukRndDmM2cBjJnyWFyEdfyssJvaAQL1rMCbbATebc1Va6XTms6ihqA';
export const VNPAY_QR_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2CE0G3HJWwKBExRJ2i_wv3sRyRxfmTcSI49FkcWEINokT-nYIInjXGirV5PtkB6SzwF9Rk5sJb6gMFUhZNBUG1M4ByK9O7M5RpjBE528FTQH5AqRPgEk0M8vF82e0wW6CIDnmSIYKeqrgec8WwtKTZsj4DHdv1XwDpW_-BD4PNvyZBtisLx6Gj3LTJ9q_ls5FFElgssN6HpV-j6kh--hOEw99nPcY_1ZciqERuYwBPM4f_qcQrN30iw';
export const TICKET_QR_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4pQsnE0V1qM_ZHq1mVgT-jzHf0ixmGIktmUX7FVHegW6MCesp0NqNcYb3ohs42kU-ll2mLxScX1xO4BhcgW97hN3dG_cXfV3jBWrQXWczkQ34XNcA2bKQCHv6xpaKqNO1Ty93jbvnSjz_adGI7VXHhgiNComAUpG-QD064q8HlhzMfq9kI9DXsEr4xlaLTyAjdXJ3XqN5uKYO45TMuTp-nDYFyDVl8vP2QVhSsABBLdc9HYEsOlQS2A';

export const INITIAL_USERS: User[] = [
  {
    id: 'U001',
    name: 'Trần Nam',
    email: 'nam.tran@pbms.vn',
    phone: '0901234567',
    licensePlate: '51G-888.88',
    role: 'staff',
    joinedDate: '12/03/2024',
    status: 'ACTIVE',
    balance: 150000,
  },
  {
    id: 'U002',
    name: 'Lê Hoa',
    email: 'hoa.le@pbms.vn',
    phone: '0912345678',
    licensePlate: '59A-123.45',
    role: 'manager',
    joinedDate: '15/03/2024',
    status: 'ACTIVE',
    balance: 240000,
  },
  {
    id: 'U003',
    name: 'Phạm Việt',
    email: 'viet.pham@pbms.vn',
    phone: '0934567890',
    licensePlate: '51C-444.44',
    role: 'staff',
    joinedDate: '20/03/2024',
    status: 'INACTIVE',
    balance: 0,
  },
  {
    id: 'U004',
    name: 'Nguyễn Duy',
    email: 'duy.ng@pbms.vn',
    phone: '0909999999',
    licensePlate: '51F-999.99',
    role: 'admin',
    joinedDate: '01/01/2024',
    status: 'ACTIVE',
    balance: 1200000,
  },
  {
    id: 'U005',
    name: 'Nguyễn Văn Tài Xế',
    email: 'driver@pbms.vn',
    phone: '0987654321',
    licensePlate: '59A-123.45',
    role: 'driver',
    joinedDate: '02/07/2026',
    status: 'ACTIVE',
    balance: 500000,
  },
];

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'PB-8899-2023',
    slotId: 'A-102',
    floor: 'Tầng 1',
    licensePlate: '59A-123.45',
    vehicleType: 'oto',
    startTime: '14:30 - Hôm nay',
    endTime: '17:30 (3 giờ)',
    durationHours: 3,
    totalFee: 60000,
    status: 'UPCOMING',
    dateStr: '02 THÁNG 07, 2026',
  },
  {
    id: 'PB-9021-2023',
    slotId: 'A-102',
    floor: 'Tầng 1',
    licensePlate: '51G-888.88',
    vehicleType: 'oto',
    startTime: '08:30 - 15/10/2023',
    endTime: '12:50 (4 giờ 20 phút)',
    durationHours: 4.33,
    totalFee: 85000,
    status: 'COMPLETED',
    dateStr: '12 THÁNG 10, 2023',
  },
  {
    id: 'PB-8842-2023',
    slotId: 'C-045',
    floor: 'Tầng 3',
    licensePlate: '51H-123.45',
    vehicleType: 'oto',
    startTime: '09:00 - 10/10/2023',
    endTime: '11:00 mai (26 giờ)',
    durationHours: 26,
    totalFee: 240000,
    status: 'COMPLETED',
    dateStr: '10 THÁNG 10, 2023',
  },
];

export const INITIAL_PARKING_SLOTS: ParkingSlot[] = [
  // Floor 1
  { id: 'A-101', zone: 'A', floor: 'Tầng 1', status: 'occupied', vehicleType: 'oto', currentSession: { licensePlate: '51G-111.11', checkInTime: '10:00', estimatedHours: 4, fee: 80000 } },
  { id: 'A-102', zone: 'A', floor: 'Tầng 1', status: 'available', vehicleType: 'oto' },
  { id: 'A-103', zone: 'A', floor: 'Tầng 1', status: 'available', vehicleType: 'oto' },
  { id: 'A-104', zone: 'A', floor: 'Tầng 1', status: 'reserved', vehicleType: 'oto', currentSession: { licensePlate: '51F-222.22', checkInTime: '15:00', estimatedHours: 2, fee: 40000 } },
  { id: 'A-105', zone: 'A', floor: 'Tầng 1', status: 'occupied', vehicleType: 'oto', currentSession: { licensePlate: '59C-333.33', checkInTime: '12:30', estimatedHours: 5, fee: 100000 } },
  // Floor 2
  { id: 'B-041', zone: 'B', floor: 'Tầng 2', status: 'occupied', vehicleType: 'oto', currentSession: { licensePlate: '51H-444.44', checkInTime: '14:00', estimatedHours: 3, fee: 60000 } },
  { id: 'B-045', zone: 'B', floor: 'Tầng 2', status: 'available', vehicleType: 'oto' },
  { id: 'B-048', zone: 'B', floor: 'Tầng 2', status: 'reserved', vehicleType: 'oto', currentSession: { licensePlate: '30A-555.55', checkInTime: '18:00', estimatedHours: 4, fee: 80000 } },
  // Floor Basement (Tầng hầm)
  { id: 'C-010', zone: 'C', floor: 'Tầng hầm', status: 'available', vehicleType: 'xemay' },
  { id: 'C-012', zone: 'C', floor: 'Tầng hầm', status: 'occupied', vehicleType: 'xemay', currentSession: { licensePlate: '59A-999.99', checkInTime: '08:00', estimatedHours: 10, fee: 50000 } },
  { id: 'C-045', zone: 'C', floor: 'Tầng hầm', status: 'available', vehicleType: 'oto' },
];

export const INITIAL_LOGS: SystemLog[] = [
  {
    id: 'L1',
    type: 'success',
    title: 'Đăng nhập thành công',
    description: 'Admin đã đăng nhập vào hệ thống từ IP 192.168.1.1',
    timeStr: '10:45:23 - Hôm nay',
  },
  {
    id: 'L2',
    type: 'info',
    title: 'Cập nhật cấu hình',
    description: 'Thay đổi biểu phí đỗ xe khu vực A bởi Điều hành Trần Nam',
    timeStr: '09:30:12 - Hôm nay',
  },
  {
    id: 'L3',
    type: 'error',
    title: 'Cảnh báo camera',
    description: 'Mất kết nối với Camera cổng số 3 (LPR-03)',
    timeStr: '08:15:00 - Hôm nay',
  },
  {
    id: 'L4',
    type: 'success',
    title: 'Thanh toán VNPAY',
    description: 'Giao dịch #VNP88273 hoàn tất thành công (50,000 VNĐ)',
    timeStr: '07:55:45 - Hôm nay',
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 'TX001', licensePlate: '59A-123.45', slotId: 'A-102', amount: 60000, timeStr: '14:35 - Hôm nay', method: 'VNPAY', status: 'success' },
  { id: 'TX002', licensePlate: '51G-888.88', slotId: 'A-102', amount: 85000, timeStr: '12:50 - 15/10/2023', method: 'VNPAY', status: 'success' },
  { id: 'TX003', licensePlate: '51H-123.45', slotId: 'C-045', amount: 240000, timeStr: '11:02 - 10/10/2023', method: 'VNPAY', status: 'success' },
  { id: 'TX004', licensePlate: '59A-999.99', slotId: 'C-012', amount: 50000, timeStr: '18:05 - Hôm nay', method: 'Ví điện tử', status: 'success' },
];
export const REVENUE_DATA_WEEK = [
  { day: 'Thứ 2', revenue: 1200000, occupancy: 72 },
  { day: 'Thứ 3', revenue: 1450000, occupancy: 78 },
  { day: 'Thứ 4', revenue: 1300000, occupancy: 75 },
  { day: 'Thứ 5', revenue: 1600000, occupancy: 82 },
  { day: 'Thứ 6', revenue: 1850000, occupancy: 89 },
  { day: 'Thứ Bảy', revenue: 2400000, occupancy: 95 },
  { day: 'Chủ Nhật', revenue: 2100000, occupancy: 91 },
];
