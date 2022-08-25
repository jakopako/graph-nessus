export enum Method {
  GET = 'get',
  POST = 'post',
}

export interface UserPermissionsResponse {
  type: string;
  permissions: number;
  name: string;
  username: string;
}

export interface ErrorBody {
  error?: string;
}

export interface NessusScanDetails {
  info: {
    name: string;
    object_id: string;
    scan_type: string;
    scan_start: number;
    scan_end: number;
    status: string;
    scanner_name: string;
  };
}

export interface NessusScansResponse {
  scans: NessusScanInfo[];
}

export interface NessusScanInfo {
  id: number;
}
