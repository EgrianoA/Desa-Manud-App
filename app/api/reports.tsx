import { useState } from "react";
import useApiHooks, { errorResponse } from "../utilities/useApiHooks";
import { UploadedFile } from "./types/uploadedfile";
import { IUser } from "./users";

export enum ReportType {
  Kebersihan = "kebersihan",
  Keamanan = "keamanan",
  LainLain = "lainLain",
}

export enum StatusType {
  New = "new",
  OnCheck = "onCheck",
  Cancelled = "cancelled",
  Rejected = "rejected",
  Done = "done",
}

export type IReport = {
  _id: string;
  reportNo: string;
  type: ReportType;
  description: string;
  notes: string;
  attachment: UploadedFile[];
  status: StatusType;
  createdAt: Date;
  reportedBy: Pick<IUser, "userFullName">;
};

type FetchReportParams = {
  page?: number;
  pageSize?: number;
  query?: string;
};

export const useFetchReports = ({
  page = 1,
  pageSize = 10,
  query,
}: FetchReportParams) => {
  const [response, setResponse] = useState({ errorResponse });
  const params = `page=${page}&size=${pageSize}${
    query ? `&query=${JSON.stringify(query)}` : ""
  }`;
  try {
    const response = useApiHooks({
      method: "get",
      url: `${process.env.BE_BASEURL}/api/reports?${params}`,
    });
    return response;
    console.log(response);
  } catch {
    return response.errorResponse;
  }
};
