import { API_BASE_URL } from "./constants";

async function request(path, options = {}, token) {
  const hasBody = options.body !== undefined;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    let message = "Request failed";
    try {
      const data = await response.json();
      message = data.message || message;
    } catch {
      message = response.statusText || message;
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

export const api = {
  health() {
    return request("/health");
  },
  login(payload) {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  register(payload) {
    return request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  me(token) {
    return request("/me", {}, token);
  },
  serviceCategories(token) {
    return request("/service-categories", {}, token);
  },
  workerProfile(token) {
    return request("/worker/profile", {}, token);
  },
  updateWorkerProfile(payload, token) {
    return request("/worker/profile", {
      method: "PUT",
      body: JSON.stringify(payload)
    }, token);
  },
  contractorProfile(token) {
    return request("/contractor/profile", {}, token);
  },
  createServiceBooking(payload, token) {
    return request("/service-bookings", {
      method: "POST",
      body: JSON.stringify(payload)
    }, token);
  },
  myServiceBookings(token) {
    return request("/service-bookings/my", {}, token);
  },
  availableServiceBookings(token) {
    return request("/service-bookings/available", {}, token);
  },
  acceptServiceBooking(id, token) {
    return request(`/service-bookings/${id}/accept`, {
      method: "POST"
    }, token);
  },
  updateServiceBookingStatus(id, status, token) {
    return request(`/service-bookings/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    }, token);
  },
  workerJobs(token) {
    return request("/worker/jobs", {}, token);
  },
  createConstructionJob(payload, token) {
    return request("/construction-jobs", {
      method: "POST",
      body: JSON.stringify(payload)
    }, token);
  },
  openConstructionJobs(token) {
    return request("/construction-jobs/open", {}, token);
  },
  acceptConstructionJob(id, token) {
    return request(`/construction-jobs/${id}/accept`, {
      method: "POST"
    }, token);
  },
  updateConstructionJobStatus(id, status, token) {
    return request(`/construction-jobs/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    }, token);
  },
  myConstructionJobs(token) {
    return request("/construction-jobs/my", {}, token);
  },
  contractorJobs(token) {
    return request("/contractor/jobs/my", {}, token);
  },
  adminDashboard(token) {
    return request("/admin/dashboard", {}, token);
  },
  adminUsers(token) {
    return request("/admin/users", {}, token);
  },
  adminBookings(token) {
    return request("/admin/bookings", {}, token);
  },
  adminJobs(token) {
    return request("/admin/jobs", {}, token);
  }
};
