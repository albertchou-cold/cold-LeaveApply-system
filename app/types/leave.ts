import { Json } from "twilio/lib/interfaces";

export interface LeaveApplication {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  appliedAt: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  rejectionReason?: string;
  applyFolderLink?: string;
  positionarea: Array<string>;
  authposition: Array<string>;
  RandomUniqueId: string;
  is_synced: boolean;
}

export enum LeaveType {
  PERSONAL = '事假',
  FAMILYCARELEAVE_ARTICLE20 = '家庭照顧假(第20條)',
  MENSTRUAL = '生理假',
  SICK_NONHOSPITALIZED = '未住院病假',
  SICK_HOSPITALIZED = '住院病假',
  MARRIAGE = '婚假',
  BEREAVEMENT_1 = '喪假-1',
  BEREAVEMENT_2 = '喪假-2',
  BEREAVEMENT_3 = '喪假-3',
  PRENATALCHECKUP = '產檢假',
  MATERNITY_1 = '產假-1',
  MATERNITY_2 = '產假-2',
  MATERNITY_3 = '產假-3',
  MATERNITY_4 = '產假-4',
  PATERNITYCHECKUP_ARTICLE15 = '陪產檢假(第15條)',
  PARENTAL = '撫育假',
  BREASTFEEDING_ARTICLE18 = '哺(集)乳時間(第18條)',
  OFFICIAL = '公假',
  STATUTORYVOTING = '法定投票假',
  ANNUAL = '特休假',
  COMPENSATORY = '補休假',
  ORDINARYINJURYSICKLEAVE_WITHOUTPAY = '普通傷病假留職停薪',
  PARENTALLEAVE_WITHOUTPAY_ARTICLE16 = '育嬰假(育嬰留職停薪)(第16條)',
  OTHER = '其他',
}

export enum LeaveStatus {
  PENDING = '待審核',
  APPROVED = '已核准',
  REJECTED = '已拒絕',
  CANCELLED = '已取消'
}

export interface Employee {
  id: string;
  name: string;
  positionarea: Array<string>;
  authposition: Array<string>;
  position: string;
  email: string;
}

export interface LeaveApplicationRequest {
  employeeId: string;
  employeeName: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  applyFolderLink?: string;
  positionarea: Array<string>;
  authposition: Array<string>;
  RandomUniqueId?: string;
}

export interface LeaveApplicationResponse {
  success: boolean;
  message: string;
  data?: LeaveApplication | LeaveApplication[];
  error?: string;
}
