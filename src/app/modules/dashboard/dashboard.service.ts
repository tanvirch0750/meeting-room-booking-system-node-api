import { Booking } from '../booking/booking.model';
import { Slot } from '../slot/slot.model';
import { User } from '../user/user.model';

const getDashboardDataFromDb = async () => {
    // Step 1: Total Bookings
    const totalBookings = await Booking.countDocuments({ isDeleted: false });

    // Step 2: Total Revenue
    const totalRevenue = await Booking.aggregate([
        { $match: { isDeleted: false, isConfirmed: 'confirmed' } },
        { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
        { $project: { _id: 0, totalRevenue: 1 } },
    ]);

    // Step 3: Total Users
    const totalUsers = await User.countDocuments({ isDeleted: false });

    // Step 4: Total Available Slots
    const totalAvailableSlots = await Slot.countDocuments({
        isDeleted: false,
        isBooked: false,
    });

    // Step 5: Recent 5 Bookings
    const recentBookings = await Booking.find({ isDeleted: false })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'name email')
        .populate('room', 'name roomNo');

    // Step 6: Total Bookings Amount by Every Month (for all time)
    const totalBookingsByMonth = await Booking.aggregate([
        { $match: { isDeleted: false, isConfirmed: 'confirmed' } },
        {
            $group: {
                _id: {
                    year: { $year: { $toDate: '$date' } },
                    month: { $month: { $toDate: '$date' } },
                },
                totalAmount: { $sum: '$totalAmount' },
                count: { $sum: 1 },
            },
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } }, // Sort by year and month
    ]);

    // Step 7: Total Bookings Amount by Current Month
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const totalBookingsByCurrentMonth = await Booking.aggregate([
        {
            $match: {
                isDeleted: false,
                isConfirmed: 'confirmed',
                date: {
                    $gte: new Date(`${currentYear}-${currentMonth}-01`),
                    $lt: new Date(`${currentYear}-${currentMonth + 1}-01`),
                },
            },
        },
        {
            $group: {
                _id: null,
                totalAmount: { $sum: '$totalAmount' },
                count: { $sum: 1 },
            },
        },
    ]);

    // Step 8: Total Confirmed and Unconfirmed Bookings (Optional)
    const bookingStatusCount = await Booking.aggregate([
        {
            $group: {
                _id: '$isConfirmed',
                count: { $sum: 1 },
            },
        },
    ]);

    return {
        totalBookings,
        totalRevenue: totalRevenue[0]?.totalRevenue || 0,
        totalUsers,
        totalAvailableSlots,
        recentBookings,
        totalBookingsByMonth,
        totalBookingsByCurrentMonth: totalBookingsByCurrentMonth[0] || {
            totalAmount: 0,
            count: 0,
        },
        bookingStatusCount,
    };
};

export const dashboardServices = {
    getDashboardDataFromDb,
};
