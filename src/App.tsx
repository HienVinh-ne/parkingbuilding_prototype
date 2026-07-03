import { useState } from 'react';
import { Role, View, User, Reservation, ParkingSlot, SystemLog, Transaction } from './types';
import {
  INITIAL_USERS,
  INITIAL_RESERVATIONS,
  INITIAL_PARKING_SLOTS,
  INITIAL_LOGS,
  INITIAL_TRANSACTIONS,
} from './mockData';

// Component imports
import RoleSwitcher from './components/RoleSwitcher';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import ParkingMapScreen from './components/ParkingMapScreen';
import ReservationScreen from './components/ReservationScreen';
import VnpayScreen from './components/VnpayScreen';
import SuccessTicketScreen from './components/SuccessTicketScreen';
import HistoryScreen from './components/HistoryScreen';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  // Global states representing active data models
  const [currentRole, setCurrentRole] = useState<Role>('guest');
  const [currentView, setCurrentView] = useState<View>('LOGIN');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [usersList, setUsersList] = useState<User[]>(INITIAL_USERS);
  const [reservationsList, setReservationsList] = useState<Reservation[]>(INITIAL_RESERVATIONS);
  const [slotsList, setSlotsList] = useState<ParkingSlot[]>(INITIAL_PARKING_SLOTS);
  const [logsList, setLogsList] = useState<SystemLog[]>(INITIAL_LOGS);
  const [transactionsList, setTransactionsList] = useState<Transaction[]>(INITIAL_TRANSACTIONS);

  // Flow context variables
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
  const [activeReservation, setActiveReservation] = useState<Reservation | null>(null);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(true);

  // Handlers for switching roles instantly via prototype switcher
  const handleRoleSwitch = (role: Role, view: View) => {
    setCurrentRole(role);
    setCurrentView(view);
    
    // Automatically login matching mockup user
    const matchedUser = usersList.find((u) => u.role === role) || null;
    setCurrentUser(matchedUser);

    // Reset flow context
    setSelectedSlot(null);
    setActiveReservation(null);
  };

  // Login handler
  const handleLoginSuccess = (role: Role, view: View, user: User) => {
    setCurrentRole(role);
    setCurrentView(view);
    setCurrentUser(user);

    // If user is not yet in usersList, add them
    if (!usersList.some((u) => u.id === user.id)) {
      setUsersList((prev) => [...prev, user]);
    }
  };

  // Onboarding registration handler
  const handleRegisterSuccess = (newUser: User) => {
    setUsersList((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    setCurrentRole('driver');
    setCurrentView('DASHBOARD_CLIENT');
  };

  // Selecting a slot to book
  const handleSelectSlot = (slot: ParkingSlot) => {
    setSelectedSlot(slot);
    setCurrentView('RESERVATION_CONFIRM');
  };

  // Form confirmation to continue to checkout
  const handleProceedToPayment = (reservation: Reservation) => {
    setActiveReservation(reservation);
    setCurrentView('PAYMENT_VNPAY');
  };

  // Payment completed successfully handler
  const handlePaymentSuccess = () => {
    if (!activeReservation) return;

    // 1. Add reservation to active list
    setReservationsList((prev) => [activeReservation, ...prev]);

    // 2. Set slot status to 'reserved' dynamically
    setSlotsList((prev) =>
      prev.map((slot) => {
        if (slot.id === activeReservation.slotId) {
          return {
            ...slot,
            status: 'reserved',
            currentSession: {
              licensePlate: activeReservation.licensePlate,
              checkInTime: activeReservation.startTime.split(' - ')[0],
              estimatedHours: activeReservation.durationHours,
              fee: activeReservation.totalFee,
            },
          };
        }
        return slot;
      })
    );

    // 3. Create a transaction
    const newTx: Transaction = {
      id: `TX${Math.floor(Math.random() * 900) + 100}`,
      licensePlate: activeReservation.licensePlate,
      slotId: activeReservation.slotId,
      amount: activeReservation.totalFee,
      timeStr: 'Vừa xong',
      method: 'VNPAY',
      status: 'success',
    };
    setTransactionsList((prev) => [newTx, ...prev]);

    // 4. Record a log in the system
    const newLog: SystemLog = {
      id: `L_${Date.now()}`,
      type: 'success',
      title: 'Đặt chỗ đỗ xe qua VNPAY',
      description: `Giao dịch ${activeReservation.id} thành công cho xe ${activeReservation.licensePlate} tại slot ${activeReservation.slotId}`,
      timeStr: 'Vừa xong',
    };
    setLogsList((prev) => [newLog, ...prev]);

    // 5. Deduct balance from user wallet (if driver/registered)
    if (currentUser) {
      setCurrentUser((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          balance: Math.max(0, prev.balance - activeReservation.totalFee),
        };
      });
    }

    // 6. Push view to payment success screen
    setCurrentView('PAYMENT_SUCCESS');
  };

  // Cancel reservation handler
  const handleCancelReservation = (id: string) => {
    const res = reservationsList.find((r) => r.id === id);
    if (!res) return;

    // Free the slot
    setSlotsList((prev) =>
      prev.map((slot) => {
        if (slot.id === res.slotId) {
          return { ...slot, status: 'available', currentSession: undefined };
        }
        return slot;
      })
    );

    // Update reservation list to CANCELLED
    setReservationsList((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return { ...r, status: 'CANCELLED' };
        }
        return r;
      })
    );

    // Log activity
    const newLog: SystemLog = {
      id: `L_${Date.now()}`,
      type: 'warning',
      title: 'Hủy đặt chỗ thành công',
      description: `Đã hủy vé đỗ xe ${res.id}, giải phóng vị trí ${res.slotId}`,
      timeStr: 'Vừa xong',
    };
    setLogsList((prev) => [newLog, ...prev]);
  };

  // Logout handler
  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentRole('guest');
    setCurrentView('LOGIN');
    setSelectedSlot(null);
    setActiveReservation(null);
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] text-slate-800">
      
      {/* 1. LOGIN SCREEN */}
      {currentView === 'LOGIN' && (
        <LoginScreen
          onLoginSuccess={handleLoginSuccess}
          onNavigateToRegister={() => setCurrentView('REGISTER')}
          usersList={usersList}
        />
      )}

      {/* 2. REGISTER SCREEN */}
      {currentView === 'REGISTER' && (
        <RegisterScreen
          onRegisterSuccess={handleRegisterSuccess}
          onNavigateToLogin={() => setCurrentView('LOGIN')}
        />
      )}

      {/* 3. PARKING MAP (HOME LANDING SCREEN FOR DRIVER/GUEST) */}
      {currentView === 'DASHBOARD_CLIENT' && (
        <ParkingMapScreen
          slots={slotsList}
          onSelectSlot={handleSelectSlot}
          onNavigateToHistory={() => setCurrentView('HISTORY')}
          currentRole={currentRole}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}

      {/* 4. CONFIGURE RESERVATION */}
      {currentView === 'RESERVATION_CONFIRM' && selectedSlot && (
        <ReservationScreen
          selectedSlot={selectedSlot}
          currentUser={currentUser}
          onBack={() => setCurrentView('DASHBOARD_CLIENT')}
          onProceedToPayment={handleProceedToPayment}
        />
      )}

      {/* 5. VNPAY SCREEN */}
      {currentView === 'PAYMENT_VNPAY' && activeReservation && (
        <VnpayScreen
          reservation={activeReservation}
          onBack={() => setCurrentView('RESERVATION_CONFIRM')}
          onCancel={() => {
            alert('Giao dịch đã bị hủy. Quay trở lại cấu hình đặt chỗ.');
            setCurrentView('RESERVATION_CONFIRM');
          }}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* 6. PAYMENT SUCCESS & ACTIVE TICKET */}
      {currentView === 'PAYMENT_SUCCESS' && activeReservation && (
        <SuccessTicketScreen
          reservation={activeReservation}
          onNavigateHome={() => setCurrentView('DASHBOARD_CLIENT')}
          onNavigateToHistory={() => setCurrentView('HISTORY')}
        />
      )}

      {/* 7. HISTORY LIST */}
      {currentView === 'HISTORY' && (
        <HistoryScreen
          reservations={reservationsList}
          currentUser={currentUser}
          onCancelReservation={handleCancelReservation}
          onNavigateHome={() => setCurrentView('DASHBOARD_CLIENT')}
          onSelectReservationDetails={(res) => {
            setActiveReservation(res);
            setCurrentView('PAYMENT_SUCCESS');
          }}
        />
      )}

      {/* 8. WEBPAGE ADMIN PORTAL DASHBOARD (STAFF/MANAGER/ADMIN) */}
      {currentView === 'ADMIN_DASHBOARD' && (
        <AdminDashboard
          initialUsers={usersList}
          initialSlots={slotsList}
          initialLogs={logsList}
          initialTransactions={transactionsList}
          currentRole={currentRole}
          onLogout={handleLogout}
        />
      )}

      {/* Global Prototype Drawer helper switcher widget */}
      <RoleSwitcher
        currentRole={currentRole}
        currentView={currentView}
        onSwitch={handleRoleSwitch}
        isOpen={roleSwitcherOpen}
        setIsOpen={setRoleSwitcherOpen}
      />
    </div>
  );
}
