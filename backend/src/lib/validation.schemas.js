/**
 * validation.schemas.js
 * Zod schemas for all user-facing input endpoints.
 * Limits are chosen to match the Mongoose schema maxlength constraints.
 */

import { z } from "zod";

// ─── Shared field definitions ────────────────────────────────────────────────

const fullNameField = z
  .string({ required_error: "Full name is required" })
  .trim()
  .min(1, "Full name cannot be empty")
  .max(100, "Full name must be 100 characters or fewer");

const emailField = z
  .string({ required_error: "Email is required" })
  .trim()
  .toLowerCase()
  .email("Invalid email format")
  .max(254, "Email must be 254 characters or fewer");

const passwordField = z
  .string({ required_error: "Password is required" })
  .min(6, "Password must be at least 6 characters")
  .max(128, "Password must be 128 characters or fewer");

const bioField = z
  .string()
  .trim()
  .max(300, "Bio must be 300 characters or fewer")
  .optional();

const locationField = z
  .string()
  .trim()
  .max(100, "Location must be 100 characters or fewer")
  .optional();

const profilePicField = z
  .string()
  .trim()
  .max(2048, "Profile picture URL must be 2048 characters or fewer")
  .optional();

// ─── Auth schemas ─────────────────────────────────────────────────────────────

export const signupSchema = z.object({
  fullName: fullNameField,
  email: emailField,
  password: passwordField,
});

export const loginSchema = z.object({
  email: emailField,
  password: passwordField,
});

// ─── Onboarding schema ────────────────────────────────────────────────────────

export const onboardSchema = z.object({
  fullName: fullNameField,
  bio: z
    .string({ required_error: "Bio is required" })
    .trim()
    .min(1, "Bio cannot be empty")
    .max(300, "Bio must be 300 characters or fewer"),
  location: z
    .string({ required_error: "Location is required" })
    .trim()
    .min(1, "Location cannot be empty")
    .max(100, "Location must be 100 characters or fewer"),
  profilePic: profilePicField,
});

// ─── Profile update schema ────────────────────────────────────────────────────

export const updateProfileSchema = z
  .object({
    fullName: fullNameField.optional(),
    bio: bioField,
    location: locationField,
    profileImage: profilePicField,
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided to update",
  });
