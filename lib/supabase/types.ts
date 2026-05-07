export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UnitStatus = "vermietet" | "frei" | "unbekannt";
export type LeaseStatus = "active" | "ended" | "draft";
export type ReceivableStatus = "open" | "partial" | "paid" | "cancelled";
export type ReceivableType = "rent" | "deposit" | "utility" | "other";
export type TaskStatus = "open" | "done" | "archived";
export type TaskPriority = "low" | "normal" | "high";
export type DocumentType =
  | "mietvertrag"
  | "uebergabeprotokoll"
  | "kautionsnachweis"
  | "nebenkostenabrechnung"
  | "rechnung"
  | "sonstiges";

export type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  created_at: string;
  updated_at: string;
};

export type Account = {
  id: string;
  name: string;
  owner_user_id: string;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
};

export type Property = {
  id: string;
  account_id: string;
  name: string;
  street: string;
  postal_code: string;
  city: string;
  country: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
};

export type Unit = {
  id: string;
  account_id: string;
  property_id: string;
  name: string;
  floor: string | null;
  size_sqm: number | string | null;
  rooms: number | string | null;
  status: UnitStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
};

export type Tenant = {
  id: string;
  account_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
};

export type Lease = {
  id: string;
  account_id: string;
  unit_id: string;
  tenant_id: string | null;
  start_date: string | null;
  end_date: string | null;
  payment_due_day: number;
  status: LeaseStatus;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
};

export type RentTerm = {
  id: string;
  account_id: string;
  lease_id: string;
  valid_from: string;
  cold_rent: number | string;
  utilities: number | string;
  total_rent: number | string;
  reason: string | null;
  created_at: string;
};

export type Deposit = {
  id: string;
  account_id: string;
  lease_id: string;
  agreed_amount: number | string;
  paid_amount: number | string;
  held_at: string | null;
  returned_amount: number | string | null;
  returned_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Receivable = {
  id: string;
  account_id: string;
  lease_id: string | null;
  type: ReceivableType;
  label: string;
  due_date: string;
  amount: number | string;
  status: ReceivableStatus;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
};

export type Payment = {
  id: string;
  account_id: string;
  receivable_id: string | null;
  lease_id: string | null;
  amount: number | string;
  paid_at: string;
  method: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Document = {
  id: string;
  account_id: string;
  property_id: string | null;
  unit_id: string | null;
  tenant_id: string | null;
  lease_id: string | null;
  deposit_id: string | null;
  type: DocumentType;
  title: string;
  file_path: string;
  mime_type: string;
  file_size: number;
  uploaded_by: string | null;
  created_at: string;
  archived_at: string | null;
};

export type Task = {
  id: string;
  account_id: string;
  property_id: string | null;
  unit_id: string | null;
  tenant_id: string | null;
  lease_id: string | null;
  title: string;
  description: string | null;
  due_date: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
};

export type Communication = {
  id: string;
  account_id: string;
  tenant_id: string | null;
  unit_id: string | null;
  type: "notiz" | "telefonat" | "email" | "brief" | "gespraech";
  subject: string;
  body: string | null;
  happened_at: string;
  created_at: string;
};
