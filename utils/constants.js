// ITEM_FIELDS to return for each item
export const ITEM_FIELDS = 'title description price quantity condition';

// USER_FIELDS to return for each seller
export const USER_FIELDS =
    'username sellerRating email firstName lastName accountRole';

// Enum representing item conditions
export const ITEM_CONDITION = {
    USED: 'used',
    NEW: 'new',
    REFURB: 'refurbrished',
};

// Enum representing payment options
export const PAYMENT_OPTIONS = {
    CREDIT_CARD: 'credit_card',
    PAYPAL: 'paypal',
    EASYPAISA: 'easypaisa',
    JAZZCASH: 'jazzcash',
    BANK: 'bank',
};

// Enum representing listing durations
export const LISTING_DAYS = {
    THREE: 'three',
    WEEK: 'week',
    MONTH: 'month',
};

// Enum representing account roles
export const ACCOUNT_ROLES = {
    ADMIN: 'admin',
    USER: 'user',
};
