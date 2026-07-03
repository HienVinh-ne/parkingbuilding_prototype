import { User, Reservation, ParkingSlot, SystemLog, Transaction } from './types';

export const ADMIN_AVATAR = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80';
export const PARKING_IMAGE = 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80';
export const VNPAY_QR_IMAGE = 'https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=PBMS-VNPAY-DEMO';
export const TICKET_QR_IMAGE = 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=PBMS-TICKET-DEMO';

export const INITIAL_USERS: User[] = [
  {
    id: 'U001',
    name: 'Trần Nam',
    email: 'staff_zone_a@pbms.vn',
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
    email: 'manager_hcm@pbms.vn',
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
    email: 'root_admin@pbms.vn',
    phone: '0909999999',
    licensePlate: '51F-999.99',
    role: 'admin',
    joinedDate: '01/01/2024',
    status: 'ACTIVE',
    balance: 1200000,
  },
  {
    id: 'U005',
    name: 'Nguyễn Văn Tài',
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
    id: 'PB-8899-2026',
    slotId: 'A-102',
    floor: 'Tầng 1',
    licensePlate: '59A-123.45',
    vehicleType: 'oto',
    startTime: '14:30 - Hôm nay',
    endTime: '17:30 (3 giờ)',
    durationHours: 3,
    totalFee: 60000,
    status: 'UPCOMING',
    dateStr: '02/07/2026',
  },
  {
    id: 'PB-9021-2026',
    slotId: 'B-045',
    floor: 'Tầng 2',
    licensePlate: '51G-888.88',
    vehicleType: 'oto',
    startTime: '08:30 - 15/06/2026',
    endTime: '12:30 (4 giờ)',
    durationHours: 4,
    totalFee: 80000,
    status: 'COMPLETED',
    dateStr: '15/06/2026',
  },
  {
    id: 'PB-8842-2026',
    slotId: 'C-045',
    floor: 'Tầng hầm',
    licensePlate: '51H-123.45',
    vehicleType: 'oto',
    startTime: '09:00 - 10/06/2026',
    endTime: '11:00 (2 giờ)',
    durationHours: 2,
    totalFee: 40000,
    status: 'COMPLETED',
    dateStr: '10/06/2026',
  },
];

export const INITIAL_PARKING_SLOTS: ParkingSlot[] = [
  { id: 'A-101', zone: 'A', floor: 'Tầng 1', status: 'occupied', vehicleType: 'oto', currentSession: { licensePlate: '51G-111.11', checkInTime: '10:00', estimatedHours: 4, fee: 80000 } },
  { id: 'A-102', zone: 'A', floor: 'Tầng 1', status: 'available', vehicleType: 'oto' },
  { id: 'A-103', zone: 'A', floor: 'Tầng 1', status: 'available', vehicleType: 'oto' },
  { id: 'A-104', zone: 'A', floor: 'Tầng 1', status: 'reserved', vehicleType: 'oto', currentSession: { licensePlate: '51F-222.22', checkInTime: '15:00', estimatedHours: 2, fee: 40000 } },
  { id: 'A-105', zone: 'A', floor: 'Tầng 1', status: 'occupied', vehicleType: 'oto', currentSession: { licensePlate: '59C-333.33', checkInTime: '12:30', estimatedHours: 5, fee: 100000 } },
  { id: 'A-106', zone: 'A', floor: 'Tầng 1', status: 'available', vehicleType: 'oto' },
  { id: 'A-107', zone: 'A', floor: 'Tầng 1', status: 'available', vehicleType: 'oto' },
  { id: 'A-108', zone: 'A', floor: 'Tầng 1', status: 'reserved', vehicleType: 'oto', currentSession: { licensePlate: '51K-222.22', checkInTime: '16:00', estimatedHours: 3, fee: 60000 } },
  { id: 'B-041', zone: 'B', floor: 'Tầng 2', status: 'occupied', vehicleType: 'oto', currentSession: { licensePlate: '51H-444.44', checkInTime: '14:00', estimatedHours: 3, fee: 60000 } },
  { id: 'B-042', zone: 'B', floor: 'Tầng 2', status: 'available', vehicleType: 'oto' },
  { id: 'B-043', zone: 'B', floor: 'Tầng 2', status: 'available', vehicleType: 'oto' },
  { id: 'B-044', zone: 'B', floor: 'Tầng 2', status: 'occupied', vehicleType: 'oto', currentSession: { licensePlate: '30A-555.55', checkInTime: '13:00', estimatedHours: 4, fee: 80000 } },
  { id: 'B-045', zone: 'B', floor: 'Tầng 2', status: 'available', vehicleType: 'oto' },
  { id: 'B-046', zone: 'B', floor: 'Tầng 2', status: 'available', vehicleType: 'oto' },
  { id: 'B-047', zone: 'B', floor: 'Tầng 2', status: 'available', vehicleType: 'oto' },
  { id: 'B-048', zone: 'B', floor: 'Tầng 2', status: 'reserved', vehicleType: 'oto', currentSession: { licensePlate: '30A-777.77', checkInTime: '18:00', estimatedHours: 4, fee: 80000 } },
  { id: 'C-010', zone: 'C', floor: 'Tầng hầm', status: 'available', vehicleType: 'xemay' },
  { id: 'C-011', zone: 'C', floor: 'Tầng hầm', status: 'available', vehicleType: 'xemay' },
  { id: 'C-012', zone: 'C', floor: 'Tầng hầm', status: 'occupied', vehicleType: 'xemay', currentSession: { licensePlate: '59A-999.99', checkInTime: '08:00', estimatedHours: 10, fee: 50000 } },
  { id: 'C-013', zone: 'C', floor: 'Tầng hầm', status: 'available', vehicleType: 'xemay' },
  { id: 'C-044', zone: 'C', floor: 'Tầng hầm', status: 'reserved', vehicleType: 'oto', currentSession: { licensePlate: '60A-222.22', checkInTime: '19:00', estimatedHours: 2, fee: 40000 } },
  { id: 'C-045', zone: 'C', floor: 'Tầng hầm', status: 'available', vehicleType: 'oto' },
  { id: 'C-046', zone: 'C', floor: 'Tầng hầm', status: 'available', vehicleType: 'oto' },
  { id: 'C-047', zone: 'C', floor: 'Tầng hầm', status: 'occupied', vehicleType: 'oto', currentSession: { licensePlate: '51A-123.99', checkInTime: '09:10', estimatedHours: 6, fee: 120000 } },
];

export const INITIAL_LOGS: SystemLog[] = [
  {
    id: 'L1',
    type: 'success',
    title: 'Đăng nhập thành công',
    description: 'Admin đã đăng nhập vào hệ thống từ IP 192.168.1.1',
    timeStr: '10:45 - Hôm nay',
  },
  {
    id: 'L2',
    type: 'info',
    title: 'Cập nhật cấu hình',
    description: 'Thay đổi biểu phí đỗ xe khu vực A bởi Điều hành Trần Nam',
    timeStr: '09:30 - Hôm nay',
  },
  {
    id: 'L3',
    type: 'error',
    title: 'Cảnh báo camera',
    description: 'Mất kết nối với Camera cổng số 3 (LPR-03)',
    timeStr: '08:15 - Hôm nay',
  },
  {
    id: 'L4',
    type: 'success',
    title: 'Thanh toán VNPAY',
    description: 'Giao dịch #VNP88273 hoàn tất thành công (50.000 VNĐ)',
    timeStr: '07:55 - Hôm nay',
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 'TX001', licensePlate: '59A-123.45', slotId: 'A-102', amount: 60000, timeStr: '14:35 - Hôm nay', method: 'VNPAY', status: 'success' },
  { id: 'TX002', licensePlate: '51G-888.88', slotId: 'B-045', amount: 80000, timeStr: '12:50 - 15/06/2026', method: 'VNPAY', status: 'success' },
  { id: 'TX003', licensePlate: '51H-123.45', slotId: 'C-045', amount: 40000, timeStr: '11:02 - 10/06/2026', method: 'VNPAY', status: 'success' },
  { id: 'TX004', licensePlate: '59A-999.99', slotId: 'C-012', amount: 50000, timeStr: '18:05 - Hôm nay', method: 'Ví điện tử', status: 'success' },
];

export const REVENUE_DATA_WEEK = [
  { day: 'Thứ 2', revenue: 1200000, occupancy: 72 },
  { day: 'Thứ 3', revenue: 1450000, occupancy: 78 },
  { day: 'Thứ 4', revenue: 1300000, occupancy: 75 },
  { day: 'Thứ 5', revenue: 1600000, occupancy: 82 },
  { day: 'Thứ 6', revenue: 1850000, occupancy: 89 },
  { day: 'Thứ 7', revenue: 2400000, occupancy: 95 },
  { day: 'Chủ nhật', revenue: 2100000, occupancy: 91 },
];
