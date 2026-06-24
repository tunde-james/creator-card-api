const CreatorCardsMessages = {

  CREATOR_CARD_CREATED: 'Creator Card Created Successfully.',
  CREATOR_CARD_RETRIEVED: 'Creator Card Retrieved Successfully.',
  CREATOR_CARD_DELETED: 'Creator Card Deleted Successfully.',

  
  SLUG_ALREADY_TAKEN: 'Slug is already taken',
  ACCESS_CODE_REQUIRED: 'access_code is required when access_type is private',
  ACCESS_CODE_ON_PUBLIC: 'access_code can only be set on private cards',
  CARD_NOT_FOUND: 'Creator card not found',
  DRAFT_NOT_FOUND: 'Creator card not found',
  PRIVATE_ACCESS_REQUIRED: 'This card is private. An access code is required',
  INVALID_ACCESS_CODE: 'Invalid access code',
  INVALID_URL: 'URL must start with http:// or https://',
  RATES_REQUIRED: 'Rates must be a non-empty array when service_rates is provided',
};

module.exports = CreatorCardsMessages;