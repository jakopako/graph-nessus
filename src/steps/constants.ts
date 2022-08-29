import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const Steps = {
  SCANS: 'fetch-scans',
  HOSTS: 'fetch-hosts',
  VULNERABILITIES: 'fetch-vulnerabilities',
};

export const Entities: Record<
  'SCAN' | 'HOST' | 'VULNERABILITY',
  StepEntityMetadata
> = {
  SCAN: {
    resourceName: 'Scan',
    _type: 'nessus_scan',
    _class: ['Record'], // is there a better class?
    schema: {
      properties: {
        name: { type: 'string' },
        id: { type: 'number' },
        scanType: { type: 'string' },
        scanStart: { type: 'number' },
        scanEnd: { type: 'number' },
        status: { type: 'string' },
        scannerName: { type: 'string' },
      },
      required: [
        'name',
        'id',
        'scanType',
        'scanStart',
        'scanEnd',
        'status',
        'scannerName',
      ],
    },
  },
  HOST: {
    resourceName: 'Host',
    _type: 'nessus_scan_host',
    _class: ['Host'],
    schema: {
      properties: {
        scanId: { type: 'number' },
      },
    },
  },
  VULNERABILITY: {
    resourceName: 'Vulnerability',
    _type: 'nessus_vulnerability_finding',
    _class: ['Finding'],
  },
};

export const Relationships: Record<
  'SCAN_CONTAINS_HOST' | 'HOST_HAS_VULNERABILITY',
  StepRelationshipMetadata
> = {
  SCAN_CONTAINS_HOST: {
    _type: 'nessus_scan_contains_host',
    sourceType: Entities.SCAN._type,
    _class: RelationshipClass.CONTAINS,
    targetType: Entities.HOST._type,
  },
  HOST_HAS_VULNERABILITY: {
    _type: 'nessus_scan_host_has_vulnerability_finding',
    sourceType: Entities.HOST._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.VULNERABILITY._type,
  },
};
