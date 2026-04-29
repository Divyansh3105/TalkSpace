/**
 * validate.middleware.js
 * Generic Zod request-body validation middleware factory.
 * Usage: router.post("/route", validate(mySchema), handler)
 */

/**
 * @param {import("zod").ZodSchema} schema - Zod schema to validate req.body against
 */
export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return res.status(400).json({ message: "Validation failed", errors });
    }

    // Replace req.body with the parsed (coerced + stripped) data
    req.body = result.data;
    next();
  };
}
