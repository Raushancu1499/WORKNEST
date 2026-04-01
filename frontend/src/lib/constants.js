const DEFAULT_DEV_API_BASE_URL = "http://localhost:8081/api";
const DEFAULT_PROD_API_BASE_URL = "https://worknest-api-raushancu1499.onrender.com/api";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? DEFAULT_PROD_API_BASE_URL : DEFAULT_DEV_API_BASE_URL);

export const ROLES = {
  CUSTOMER: "CUSTOMER",
  WORKER: "WORKER",
  CONTRACTOR: "CONTRACTOR",
  ADMIN: "ADMIN"
};

export const NON_ADMIN_ROLES = [
  ROLES.CUSTOMER,
  ROLES.WORKER,
  ROLES.CONTRACTOR
];

export const SERVICE_CATEGORIES = [
  "PLUMBING",
  "ELECTRICAL",
  "PAINTING",
  "CARPENTRY",
  "INTERIOR",
  "CLEANING"
];

export const SERVICE_BOOKING_STATUSES = [
  "PENDING",
  "ACCEPTED",
  "COMPLETED",
  "CANCELLED"
];

export const CONSTRUCTION_JOB_STATUSES = [
  "OPEN",
  "PARTIALLY_FILLED",
  "FILLED",
  "COMPLETED",
  "CANCELLED"
];
