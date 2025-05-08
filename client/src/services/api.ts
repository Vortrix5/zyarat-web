import axiosInstance from '@/lib/axios';
import type {
  ApiResponse,
  Institution,
  Announcement,
  Ticket,
  Complaint,
  AdminStats,
  InstitutionStats,
} from '@/types';

// Auth services
export const login = async (email: string, password: string) => {
  const response = await axiosInstance.post<
    ApiResponse<{ token: string; user: { id: string; role: string } }>
  >('/auth/login', { email, password });
  return response.data;
};

// Admin services
export const getAdminStats = async () => {
  const response = await axiosInstance.get<ApiResponse<AdminStats>>(
    '/admin/stats'
  );
  return response.data;
};

export const getVerifiedInstitutions = async () => {
  const response = await axiosInstance.get<ApiResponse<Institution[]>>(
    '/admin/institutions/verified'
  );
  return response.data;
};

export const getPendingInstitutions = async () => {
  const response = await axiosInstance.get<ApiResponse<Institution[]>>(
    '/admin/institutions/pending'
  );
  return response.data;
};

export const approveInstitution = async (institutionId: string) => {
  const response = await axiosInstance.post<ApiResponse<Institution>>(
    `/admin/institutions/${institutionId}/approve`
  );
  return response.data;
};

export const rejectInstitution = async (institutionId: string) => {
  const response = await axiosInstance.post<ApiResponse<Institution>>(
    `/admin/institutions/${institutionId}/reject`
  );
  return response.data;
};

export const getComplaints = async () => {
  const response = await axiosInstance.get<ApiResponse<Complaint[]>>(
    '/admin/complaints'
  );
  return response.data;
};

export const resolveComplaint = async (
  complaintId: string,
  resolution: string
) => {
  const response = await axiosInstance.post<ApiResponse<Complaint>>(
    `/admin/complaints/${complaintId}/resolve`,
    { resolution }
  );
  return response.data;
};

// Institution services
export const getInstitutionStats = async (institutionId: string) => {
  const response = await axiosInstance.get<ApiResponse<InstitutionStats>>(
    `/institutions/${institutionId}/stats`
  );
  return response.data;
};

export const getInstitutionDetails = async (institutionId: string) => {
  const response = await axiosInstance.get<ApiResponse<Institution>>(
    `/institutions/${institutionId}`
  );
  return response.data;
};

export const updateInstitution = async (
  institutionId: string,
  data: Partial<Institution>
) => {
  const response = await axiosInstance.put<ApiResponse<Institution>>(
    `/institutions/${institutionId}`,
    data
  );
  return response.data;
};

// Announcements services
export const getAnnouncements = async (institutionId: string) => {
  const response = await axiosInstance.get<ApiResponse<Announcement[]>>(
    `/institutions/${institutionId}/announcements`
  );
  return response.data;
};

export const createAnnouncement = async (
  institutionId: string,
  data: { title: string; content: string }
) => {
  const response = await axiosInstance.post<ApiResponse<Announcement>>(
    `/institutions/${institutionId}/announcements`,
    data
  );
  return response.data;
};

export const updateAnnouncement = async (
  institutionId: string,
  announcementId: string,
  data: { title: string; content: string }
) => {
  const response = await axiosInstance.put<ApiResponse<Announcement>>(
    `/institutions/${institutionId}/announcements/${announcementId}`,
    data
  );
  return response.data;
};

export const deleteAnnouncement = async (
  institutionId: string,
  announcementId: string
) => {
  const response = await axiosInstance.delete<ApiResponse<{ success: boolean }>>(
    `/institutions/${institutionId}/announcements/${announcementId}`
  );
  return response.data;
};

// Tickets services
export const getTickets = async (institutionId: string) => {
  const response = await axiosInstance.get<ApiResponse<Ticket[]>>(
    `/institutions/${institutionId}/tickets`
  );
  return response.data;
};

export const createTicket = async (
  institutionId: string,
  data: { name: string; price: number; description: string }
) => {
  const response = await axiosInstance.post<ApiResponse<Ticket>>(
    `/institutions/${institutionId}/tickets`,
    data
  );
  return response.data;
};

export const updateTicket = async (
  institutionId: string,
  ticketId: string,
  data: { name: string; price: number; description: string; isActive: boolean }
) => {
  const response = await axiosInstance.put<ApiResponse<Ticket>>(
    `/institutions/${institutionId}/tickets/${ticketId}`,
    data
  );
  return response.data;
};

export const deleteTicket = async (
  institutionId: string,
  ticketId: string
) => {
  const response = await axiosInstance.delete<ApiResponse<{ success: boolean }>>(
    `/institutions/${institutionId}/tickets/${ticketId}`
  );
  return response.data;
};