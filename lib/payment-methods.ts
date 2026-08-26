export const PAYMENT_METHODS = {
  BKASH: {
    name: "bKash",
    number: process.env.BKASH_NUMBER || "01XXXXXXXXX",
    type: "Personal",
  },

  NAGAD: {
    name: "Nagad",
    number: process.env.NAGAD_NUMBER || "01XXXXXXXXX",
    type: "Personal",
  },

  ROCKET: {
    name: "Rocket",
    number: process.env.ROCKET_NUMBER || "01XXXXXXXXX",
    type: "Personal",
  },
} as const;
