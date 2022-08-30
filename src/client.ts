import { IntegrationProviderAuthenticationError } from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from './config';
import {
  NessusHostDetails,
  NessusScanDetails,
  NessusVulnerability,
} from './nessus/types';
import { NessusAPIClient } from './nessus/client';

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

/**
 * An APIClient maintains authentication state and provides an interface to
 * third party data APIs.
 *
 * It is recommended that integrations wrap provider data APIs to provide a
 * place to handle error responses and implement common patterns for iterating
 * resources.
 */
export class APIClient {
  constructor(readonly config: IntegrationConfig) {
    this.client = new NessusAPIClient({
      accessKey: this.config.accessKey,
      secretKey: this.config.secretKey,
      nessusHost: this.config.nessusHost,
    });
  }

  client: NessusAPIClient;

  public async verifyAuthentication(): Promise<void> {
    try {
      await this.client.fetchUserPermissions();
    } catch (err) {
      throw new IntegrationProviderAuthenticationError({
        cause: err,
        endpoint: err.endpoint,
        status: err.status,
        statusText: `Failed to authenticate with the nessus API: ${err.statusText}`,
      });
    }
  }

  /**
   * Iterates each scan resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateScans(
    iteratee: ResourceIteratee<NessusScanDetails>,
  ): Promise<void> {
    const scanIds = await this.client.fetchScanIds();
    for (const scanId of scanIds) {
      const scanInfo = await this.client.fetchScanDetails(scanId);
      await iteratee(scanInfo);
    }
  }

  public async iterateHosts(
    iteratee: ResourceIteratee<NessusHostDetails>,
    scanId: number,
  ): Promise<void> {
    const scanInfo = await this.client.fetchScanDetails(scanId);
    for (const host of scanInfo.hosts) {
      const hostInfo = await this.client.fetchHostDetails(scanId, host.host_id);
      await iteratee(hostInfo);
    }
  }

  public async iterateVulnerabilities(
    iteratee: ResourceIteratee<NessusVulnerability>,
    host: NessusHostDetails,
  ): Promise<void> {
    for (const vuln of host.vulnerabilities) {
      const vulnInfo = await this.client.fetchVulnerabilityDetails(
        host.info.scan_id,
        vuln.host_id,
        vuln.plugin_id,
      );
      await iteratee(vulnInfo);
    }
  }

  /**
   * Iterates each group resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  // public async iterateGroups(
  //   iteratee: ResourceIteratee<AcmeGroup>,
  // ): Promise<void> {
  //   // TODO paginate an endpoint, invoke the iteratee with each record in the
  //   // page
  //   //
  //   // The provider API will hopefully support pagination. Functions like this
  //   // should maintain pagination state, and for each page, for each record in
  //   // the page, invoke the `ResourceIteratee`. This will encourage a pattern
  //   // where each resource is processed and dropped from memory.

  //   const groups: AcmeGroup[] = [
  //     {
  //       id: 'acme-group-1',
  //       name: 'Group One',
  //       users: [
  //         {
  //           id: 'acme-user-1',
  //         },
  //       ],
  //     },
  //   ];

  //   for (const group of groups) {
  //     await iteratee(group);
  //   }
  // }
}

export function createAPIClient(config: IntegrationConfig): APIClient {
  return new APIClient(config);
}
