import { IntegrationProviderAPIError } from '@jupiterone/integration-sdk-core';
import fetch, { RequestInit, Response as NodeFetchResponse } from 'node-fetch';
import {
  NessusHostDetails,
  NessusScanDetails,
  NessusScansResponse,
  NessusVulnerability,
} from './types';
import { ErrorBody, Method, UserPermissionsResponse } from './types';

interface CreateNessusClientParams {
  accessKey: string;
  secretKey: string;
  nessusHost: string;
}

export class NessusAPIClient {
  private readonly nessusHost: string;
  private readonly headers: RequestInit['headers'];

  constructor(options: CreateNessusClientParams) {
    this.nessusHost = options.nessusHost;

    this.headers = {
      'Content-type': 'application/json',
      Accept: 'application/json',
      'Accept-encoding': 'identity',
      'X-ApiKeys': `accessKey=${options.accessKey}; secretKey=${options.secretKey};`,
    };
  }

  public async fetchUserPermissions() {
    return this.request<UserPermissionsResponse>('/session', Method.GET);
  }

  public async fetchScanIds() {
    const scans = await this.request<NessusScansResponse>('/scans', Method.GET);
    return scans.scans.map((s) => s.id);
  }

  public async fetchScanDetails(scanId: number) {
    return this.request<NessusScanDetails>(`/scans/${scanId}`, Method.GET);
  }

  public async fetchHostDetails(scanId: number, hostId: number) {
    return this.request<NessusHostDetails>(
      `/scans/${scanId}/hosts/${hostId}`,
      Method.GET,
    );
  }

  public async fetchVulnerabilityDetails(
    scanId: number,
    hostId: number,
    vulnId: number,
  ) {
    return this.request<NessusVulnerability>(
      `/scans/${scanId}/hosts/${hostId}/plugins/${vulnId}`,
      Method.GET,
    );
  }

  private async request<T>(url: string, method: Method, body?: {}): Promise<T> {
    const requestOptions: RequestInit = {
      method,
      headers: this.headers,
    };
    if (body) {
      requestOptions.body = JSON.stringify(body);
    }
    const resp = await fetch(
      `https://${this.nessusHost}` + url,
      requestOptions,
    );
    if (resp.status >= 400) {
      let message: string | undefined;
      try {
        const errorBody: ErrorBody = await resp.json();
        message = errorBody.error;
      } catch (e) {
        // pass
      }
      throw new IntegrationProviderAPIError({
        code: 'NessusClientApiError',
        message: message || `${resp.statusText}: ${resp.url}`,
        status: resp.status,
        endpoint: resp.url,
        statusText: message!,
      });
    } else {
      return resp.json();
    }
  }
}
