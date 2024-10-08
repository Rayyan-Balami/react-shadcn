import { z } from "zod";

export const codeSchema = z
  .object({
    code: z
      .string()
      .min(5, "Minimum 5 characters")
      .max(10, "Maximum 10 characters"),
    type: z.enum(["all", "specific", "category"]).default("all"),
    products: z.array(z.string()).optional(),
    usagePeriod: z
      .enum(["noLimit", "limitedCount", "limitedDay"])
      .default("noLimit"),
    limitedUsage: z.coerce.number().optional(),
    discountRate: z.enum(["percentage", "amount"]).default("percentage"),
    discountRateValue: z.coerce.number().min(1, "Minimum value is 1"),
    minimumPurchaseAmount: z.coerce.number().min(0).optional(),
    maximumPurchaseAmount: z.coerce.number().min(0).optional(),
    maximumDiscountAmount: z.coerce.number().min(0).optional(),
  })
  .refine(
    (data) =>
      data.type === "all" || (data.products && data.products.length > 0),
    {
      path: ["products"],
      message: "Products are required for this type",
    }
  )
  .refine(
    (data) =>
      data.usagePeriod === "noLimit" ||
      (data.limitedUsage && data.limitedUsage >= 1),
    {
      path: ["limitedUsage"],
      message: "Limited usage must be at least 1",
    }
  )
  .refine(
    (data) =>
      data.discountRate !== "percentage" || data.discountRateValue <= 100,
    {
      message: "Percentage discount cannot exceed 100%",
      path: ["discountRateValue"],
    }
  )
  .refine(
    (data) =>
      !data.minimumPurchaseAmount ||
      !data.maximumPurchaseAmount ||
      data.minimumPurchaseAmount < data.maximumPurchaseAmount,
    {
      path: ["maximumPurchaseAmount"],
      message:
        "Maximum purchase amount must be greater than minimum purchase amount",
    }
  )
  .refine(
    (data) =>
      !data.minimumPurchaseAmount ||
      !data.maximumDiscountAmount ||
      data.minimumPurchaseAmount < data.maximumDiscountAmount,
    {
      path: ["maximumDiscountAmount"],
      message:
        "Maximum discount amount must be greater than minimum purchase amount",
    }
  )
  .refine(
    (data) =>
      !data.maximumPurchaseAmount ||
      !data.maximumDiscountAmount ||
      data.maximumDiscountAmount < data.maximumPurchaseAmount,
    {
      path: ["maximumDiscountAmount"],
      message:
        "Maximum discount amount must be less than maximum purchase amount",
    }
  );
