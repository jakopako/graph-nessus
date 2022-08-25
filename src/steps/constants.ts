import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const Steps = {
  SCANS: 'fetch-scans',
  HOSTS: 'fetch-hosts',
  SCAN_HOST_RELATIONSHIPS: 'build-scan-host-relationships',
};

export const Entities: Record<'SCAN', StepEntityMetadata> = {
  SCAN: {
    resourceName: 'Scan',
    _type: 'nessus_scan',
    _class: ['Record'], // is there a better class?
    schema: {
      properties: {
        name: { type: 'string' },
        id: { type: 'number' },
        scan_type: { type: 'string' },
        scan_start: { type: 'number' },
        scan_end: { type: 'number' },
        status: { type: 'string' },
        scanner_name: { type: 'string' },
      },
      required: [
        'name',
        'id',
        'scan_type',
        'scan_start',
        'scan_end',
        'status',
        'scanner_name',
      ],
    },
  },
  // HOST: {
  //   resourceName: 'UserGroup',
  //   _type: 'acme_group',
  //   _class: ['UserGroup'],
  //   schema: {
  //     properties: {
  //       email: { type: 'string' },
  //       logoLink: { type: 'string' },
  //     },
  //     required: ['email', 'logoLink'],
  //   },
  // },
  // VULNERABILITY: {
  //   resourceName: 'User',
  //   _type: 'acme_user',
  //   _class: ['User'],
  //   schema: {
  //     properties: {
  //       username: { type: 'string' },
  //       email: { type: 'string' },
  //       active: { type: 'boolean' },
  //       firstName: { type: 'string' },
  //     },
  //     required: ['username', 'email', 'active', 'firstName'],
  //   },
  // },
  // PLUGIN: {
  //   resourceName: 'User',
  //   _type: 'acme_user',
  //   _class: ['User'],
  //   schema: {
  //     properties: {
  //       username: { type: 'string' },
  //       email: { type: 'string' },
  //       active: { type: 'boolean' },
  //       firstName: { type: 'string' },
  //     },
  //     required: ['username', 'email', 'active', 'firstName'],
  //   },
  // },
};

// export const Relationships: Record<
//   'ACCOUNT_HAS_USER' | 'ACCOUNT_HAS_GROUP' | 'GROUP_HAS_USER',
//   StepRelationshipMetadata
// > = {
//   ACCOUNT_HAS_USER: {
//     _type: 'acme_account_has_user',
//     sourceType: Entities.ACCOUNT._type,
//     _class: RelationshipClass.HAS,
//     targetType: Entities.USER._type,
//   },
//   ACCOUNT_HAS_GROUP: {
//     _type: 'acme_account_has_group',
//     sourceType: Entities.ACCOUNT._type,
//     _class: RelationshipClass.HAS,
//     targetType: Entities.GROUP._type,
//   },
//   GROUP_HAS_USER: {
//     _type: 'acme_group_has_user',
//     sourceType: Entities.GROUP._type,
//     _class: RelationshipClass.HAS,
//     targetType: Entities.USER._type,
//   },
// };
