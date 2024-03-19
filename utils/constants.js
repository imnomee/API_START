// Set cookie options
export const COOKIEOPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Set to true in production for HTTPS
    sameSite: 'strict', // Add sameSite attribute
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // Set cookie expiration time
    // domain: 'example.com', // Set domain if necessary
    // path: '/', // Set path if necessary
};
