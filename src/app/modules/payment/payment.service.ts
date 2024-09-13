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

    // const filePath = join(__dirname, '../../views/confirmation.html');
    // let template = readFileSync(filePath, 'utf-8');

    // template = template.replace('{{message}}', message);

    let template = `
    <!doctype html>
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Payment Confirmation</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body {
                    font-family: 'Arial', sans-serif;
                    background-color: #f4f4f9;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    color: #333;
                }
                .container {
                    background-color: white;
                    padding: 2rem;
                    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
                    border-radius: 12px;
                    text-align: center;
                    max-width: 400px;
                    width: 90%;
                }
                h1 {
                    font-size: 2rem;
                    color: #4caf50;
                    margin-bottom: 1rem;
                }
                p {
                    font-size: 1rem;
                    line-height: 1.6;
                    color: #666;
                }
                .checkmark {
                    font-size: 3rem;
                    color: #4caf50;
                    margin-bottom: 1.5rem;
                }
                .btn {
                    display: inline-block;
                    padding: 0.75rem 1.5rem;
                    background-color: #4caf50;
                    color: white;
                    text-decoration: none;
                    border-radius: 8px;
                    margin-top: 1.5rem;
                    font-size: 1rem;
                    transition: background-color 0.3s;
                }
                .btn:hover {
                    background-color: #43a047;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="checkmark">✔</div>
                <h1>Payment Successfull</h1>
                <p>
                    Thank you for your payment! Your transaction has been
                    successfully processed. If you have any questions or concerns,
                    feel free to contact our support team.
                </p>
                <a href="https://meet-easee.netlify.app/my-bookings" class="btn"
                    >Your Bookings</a
                >
            </div>
        </body>
    </html>
    
    `;

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

    // let message = 'Payment Paid!';

    // const filePath = join(__dirname, '../../views/failed.html');
    // let template = readFileSync(filePath, 'utf-8');

    // template = template.replace('{{message}}', message);

    let template = `
    <!doctype html>
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Payment Failed</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body {
                    font-family: 'Arial', sans-serif;
                    background-color: #fdf2f2;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    color: #333;
                }
                .container {
                    background-color: white;
                    padding: 2rem;
                    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
                    border-radius: 12px;
                    text-align: center;
                    max-width: 400px;
                    width: 90%;
                }
                h1 {
                    font-size: 2rem;
                    color: #f44336;
                    margin-bottom: 1rem;
                }
                p {
                    font-size: 1rem;
                    line-height: 1.6;
                    color: #666;
                }
                .icon {
                    font-size: 3rem;
                    color: #f44336;
                    margin-bottom: 1.5rem;
                }
                .btn {
                    display: inline-block;
                    padding: 0.75rem 1.5rem;
                    background-color: #f44336;
                    color: white;
                    text-decoration: none;
                    border-radius: 8px;
                    margin-top: 1.5rem;
                    font-size: 1rem;
                    transition: background-color 0.3s;
                }
                .btn:hover {
                    background-color: #e53935;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="icon">✖</div>
                <h1>Payment Failed</h1>
                <p>
                    Unfortunately, your payment could not be processed at this time.
                    Please check your payment details and try again. If the issue
                    persists, contact our support team for assistance.
                </p>
                <a href="https://meet-easee.netlify.app/rooms" class="btn">Try Again</a>
            </div>
        </body>
    </html>
    
    `;

    return template;
};

export const paymentServices = {
    confirmationService,
    failedService,
};
