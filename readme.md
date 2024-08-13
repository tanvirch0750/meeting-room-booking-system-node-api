## Meeting Room Booking System for Co-working spaces

This web application streamlines the process of reserving co-working spaces for meetings and discussions. It provides distinct functionalities for both administrators and users, ensuring smooth management and booking experiences.

### Admin Actions:

-   Room Management: Admins can create, update, and delete rooms, specifying details such as the room name, number, floor, capacity, price per slot, and amenities.
-   Slot Management: Admins create time slots for each room by setting the date, start time, and end time, ensuring a range of booking options for users.
-   Inventory Management: Admins maintain up-to-date information on room availability and slot schedules.
    User Interactions:

### User Actions

-   Booking Creation: Users can book rooms by selecting available time slots for their meetings. They specify the date, select desired slots, and choose a room.
-   Cost Calculation: The system automatically calculates the total cost based on the number of slots selected and the price per slot.
-   Real-Time Availability: Users receive immediate feedback on room and slot availability, preventing booking conflicts.

### Validation & Error Handling:

-   The system features robust validation and error handling mechanisms, ensuring reliable operations and guiding users through potential booking conflicts or errors.

### For Run the project locally

-   reomove package-lock.json file
-   npm install
-   npm run start:dev

### Technology Stack

-   TypeScript: Programming language
-   Express.js: Web framework
-   Mongoose: ODM and validation library for MongoDB
-   Zod: Schema validation
-   JWT (JSON Web Token): Authentication

### Apllication Routes

-   Root route: https://room-booking-node.vercel.app

#### User Routes

-   User Sign Up (POST): https://room-booking-node.vercel.app/api/auth/signup

    -   Request body:

    ```
    {
        "name": "Abu Sayed",
        "email": "banlar-bir@gmail.com",
        "password": "1234",
        "phone": "1234567890",
        "role": "admin", //role can be user or admin
        "address": "Rangpur"
    }

    ```

-   User login (POST): https://room-booking-node.vercel.app/api/auth/login

#### Room Routes

-   Create Room - (admin) (POST): https://room-booking-node.vercel.app/api/rooms
-   Get all rooms (GET): https://room-booking-node.vercel.app/api/rooms
-   Get single room (GET): https://room-booking-node.vercel.app/api/rooms/66bb697bd4466a0652710d25
-   Update room (admin) (PUT): https://room-booking-node.vercel.app/api/rooms/66bb697bd4466a0652710d25
-   Delete room (admin) (DELETE): https://room-booking-node.vercel.app/api/rooms/66bb697bd4466a0652710d25

#### Orders Routes

-   Create slot (admin) (POST): https://room-booking-node.vercel.app/api/slots
-   Get available slots (GET): https://room-booking-node.vercel.app/api/slots/availability
-   Get available slots by date and room id (GET): https://room-booking-node.vercel.app/api/slots/availability?date=2024-08-12&roomId=66b91d60da0cda3c66265732

#### Room Routes

-   Create Booking - (user) (POST): https://room-booking-node.vercel.app/api/bookings
-   Get all bookings - (admin) (GET): https://room-booking-node.vercel.app/api/bookings
-   Get bookings by user - (user) (GET): https://room-booking-node.vercel.app/api/my-bookings
-   Update bookings - (admin) (PUT): https://room-booking-node.vercel.app/api/bookings/66bb6c474b3573ad3c7e35b
-   Delete bookings (admin) (DELETE): https://room-booking-node.vercel.app/api/bookings/66bb6c474b3573ad3c7e35b

### Bonus Implemetation

1. No Data Found
2. Error Handeling with middleware
3. Not Found Route
4. Zod validation
