import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const scansSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: TODO
     * PATTERN: Fetch Entities
     */
    id: 'fetch-scans',
    name: 'Fetch Scans',
    entities: [
      {
        resourceName: 'Scan',
        _type: 'nessus_scan',
        _class: ['Record'],
      },
    ],
    relationships: [],
    dependsOn: [],
    implemented: true,
  },
  {
    /**
     * ENDPOINT: TODO
     * PATTERN: Fetch Entities
     */
    id: 'fetch-hosts',
    name: 'Fetch Hosts',
    entities: [
      {
        resourceName: 'Host',
        _type: 'nessus_scan_host',
        _class: ['Host'],
      },
    ],
    relationships: [
      {
        _type: 'nessus_scan_contains_host',
        sourceType: 'nessus_scan',
        _class: RelationshipClass.CONTAINS,
        targetType: 'nessus_scan_host',
      },
    ],
    dependsOn: ['fetch-scans'],
    implemented: true,
  },
  {
    /**
     * ENDPOINT: TODO
     * PATTERN: Fetch Entities
     */
    id: 'fetch-vulnerabilities',
    name: 'Fetch Vulnerabilities',
    entities: [
      {
        resourceName: 'Vulnerability',
        _type: 'nessus_vulnerability_finding',
        _class: ['Finding'],
      },
    ],
    relationships: [
      {
        _type: 'nessus_scan_host_has_vulnerability_finding',
        sourceType: 'nessus_scan_host',
        _class: RelationshipClass.HAS,
        targetType: 'nessus_vulnerability_finding',
      },
    ],
    dependsOn: ['fetch-hosts'],
    implemented: true,
  },
];
