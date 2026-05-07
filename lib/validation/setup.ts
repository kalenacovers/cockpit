import { rentedUnitSchema } from "@/lib/validation/property";

export const setupSchema = rentedUnitSchema.superRefine((data, ctx) => {
  if (data.status === "vermietet") {
    if (!data.first_name) {
      ctx.addIssue({
        code: "custom",
        path: ["first_name"],
        message: "Bitte gib den Vornamen des Mieters ein.",
      });
    }
    if (!data.last_name) {
      ctx.addIssue({
        code: "custom",
        path: ["last_name"],
        message: "Bitte gib den Nachnamen des Mieters ein.",
      });
    }
  }
});
