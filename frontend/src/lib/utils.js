import { ROLES } from "./constants";

export function dashboardPathForRole(role) {
  switch (role) {
    case ROLES.CUSTOMER:
      return "/dashboard/customer";
    case ROLES.WORKER:
      return "/dashboard/worker";
    case ROLES.CONTRACTOR:
      return "/dashboard/contractor";
    case ROLES.ADMIN:
      return "/dashboard/admin";
    default:
      return "/";
  }
}

export function formatEnumLabel(value) {
  return String(value || "")
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

export function formatCurrency(value) {
  const amount = Number(value || 0);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatDate(value) {
  if (!value) {
    return "TBD";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

export function formatDateTime(value) {
  if (!value) {
    return "TBD";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export function todayString() {
  return new Date().toISOString().slice(0, 10);
}

export function nextWeekString() {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString().slice(0, 10);
}

export function createEmptyWorkerJobs() {
  return {
    availableServiceBookings: [],
    acceptedServiceBookings: [],
    availableConstructionJobs: [],
    acceptedConstructionJobs: []
  };
}

export function bookingStatusActions(status) {
  if (status === "PENDING") {
    return ["CANCELLED"];
  }

  if (status === "ACCEPTED") {
    return ["COMPLETED", "CANCELLED"];
  }

  return [];
}

export function constructionStatusActions(status) {
  if (status === "OPEN") {
    return ["PARTIALLY_FILLED", "FILLED", "CANCELLED"];
  }

  if (status === "PARTIALLY_FILLED") {
    return ["FILLED", "COMPLETED", "CANCELLED"];
  }

  if (status === "FILLED") {
    return ["COMPLETED", "CANCELLED"];
  }

  if (status === "COMPLETED" || status === "CANCELLED") {
    return [];
  }

  return [];
}
