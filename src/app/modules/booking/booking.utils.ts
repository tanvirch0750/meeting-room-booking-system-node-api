export function generateTransactionId(): string {
    const timestamp = Date.now().toString(36); // Convert current timestamp to a base-36 string
    const randomNum = Math.random().toString(36).substring(2, 10); // Generate a random base-36 string
    return `txn_${timestamp}_${randomNum}`; // Combine timestamp and random string for uniqueness
}
