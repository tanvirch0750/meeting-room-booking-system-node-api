import { readFileSync } from 'fs';
import { join } from 'path';
import { Booking } from '../booking/booking.model';
import { Slot } from '../slot/slot.model';
import { verifyPayment } from './payment.utils';

const confirmationService = async (transactionId: string, status: string) => {
    const verifyResponse = await verifyPayment(transactionId);

    let result;
    let message = '';

    if (verifyResponse && verifyResponse?.pay_status === 'Successful') {
        result = await Booking.findOneAndUpdate(
            { trxId: transactionId },
            {
                isConfirmed: 'confirmed',
            },
        );
        message = 'Successfully Paid!';
    } else {
        message = 'Payment Failed!';
    }

    const filePath = join(__dirname, '../../views/confirmation.html');
    let template = readFileSync(filePath, 'utf-8');

    template = template.replace('{{message}}', message);

    return template;
};

const failedService = async (transactionId: string, status: string) => {
    await Booking.findOneAndUpdate(
        { trxId: transactionId },
        {
            isConfirmed: 'cancelled',
        },
    );

    const booking = await Booking.findOne({ trxId: transactionId });

    let slots;

    if (booking) {
        slots = booking.slots;
    }

    // Mark the slots as booked
    await Slot.updateMany({ _id: { $in: slots } }, { isBooked: false });

    let message = 'Payment Paid!';

    const filePath = join(__dirname, '../../views/failed.html');
    let template = readFileSync(filePath, 'utf-8');

    template = template.replace('{{message}}', message);

    return template;
};

export const paymentServices = {
    confirmationService,
    failedService,
};
