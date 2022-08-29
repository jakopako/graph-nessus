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
    object_id: number;
    scan_type: string;
    scan_start: number;
    scan_end: number;
    status: string;
    scanner_name: string;
  };
  hosts: {
    host_id: number;
  }[];
}

export interface NessusScansResponse {
  scans: NessusScanInfo[];
}

export interface NessusScanInfo {
  id: number;
}

export interface NessusHostDetails {
  info: {
    'mac-address': string;
    'host-fqdn': string;
    'host-ip': string;
    'operating-system': string;
    host_start: string;
    scan_id: number;
  };
  vulnerabilities: {
    host_id: number;
    plugin_id: number;
  }[];
}

export interface NessusVulnerability {
  outputs: {
    severity: number;
    plugin_output: string;
  }[];
  info: {
    plugindescription: {
      severity: number;
      pluginname: string;
      pluginattributes: {
        synopsis: string;
        description: string;
        plugin_name: string;
        risk_information: {
          cvss3_vector: string;
          cvss3_base_score: string;
        };
      };
      pluginfamily: string;
      pluginid: string;
    };
  };
}
