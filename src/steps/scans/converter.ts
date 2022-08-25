import {
  createIntegrationEntity,
  createDirectRelationship,
  Entity,
  RelationshipClass,
  Relationship,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { NessusScanDetails } from '../../nessus/types';
import { generateEntityKey } from '../../utils/generateKey';

export function createScanEntity(scan: NessusScanDetails): Entity {
  console.log(scan.info);
  return createIntegrationEntity({
    entityData: {
      source: scan,
      assign: {
        _type: Entities.SCAN._type,
        _class: Entities.SCAN._class,
        _key: generateEntityKey(Entities.SCAN._type, scan.info.object_id),
        name: scan.info.name,
        id: scan.info.object_id,
      },
    },
  });
}

// export function createGroupEntity(group: AcmeGroup): Entity {
//   return createIntegrationEntity({
//     entityData: {
//       source: group,
//       assign: {
//         _type: Entities.GROUP._type,
//         _class: Entities.GROUP._class,
//         _key: group.id,
//         email: 'testgroup@test.com',
//         // This is a custom property that is not a part of the data model class
//         // hierarchy. See: https://github.com/JupiterOne/data-model/blob/master/src/schemas/UserGroup.json
//         logoLink: 'https://test.com/logo.png',
//       },
//     },
//   });
// }

export function createAccountUserRelationship(
  account: Entity,
  user: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: account,
    to: user,
  });
}
export function createAccountGroupRelationship(
  account: Entity,
  group: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: account,
    to: group,
  });
}

export function createGroupUserRelationship(
  group: Entity,
  user: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: group,
    to: user,
  });
}
