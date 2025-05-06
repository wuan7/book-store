export const VNPAY_CONFIG = {
  tmnCode: process.env.VNP_TMN_CODE || "",
  hashSecret: process.env.VNP_HASH_SECRET || "",
  returnUrl:
    process.env.VNP_RETURN_URL_SUCESS || "http://localhost:3000/payment-return",
  vnpUrl: process.env.VNP_URL || "",
};
