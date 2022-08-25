// import {
//   Entity,
//   IntegrationStep,
//   IntegrationStepExecutionContext,
//   IntegrationMissingKeyError,
//   getRawData,
// } from '@jupiterone/integration-sdk-core';

// import { createAPIClient } from '../../client';
// import { IntegrationConfig } from '../../config';
// import { AcmeGroup } from '../../types';
// import { ACCOUNT_ENTITY_KEY } from '../account';
// import { Entities, Steps, Relationships } from '../constants';
// import {
//   createAccountGroupRelationship,
//   createAccountUserRelationship,
//   createGroupEntity,
//   createGroupUserRelationship,
//   createUserEntity,
// } from './converter';

// export async function fetchUsers({
//   instance,
//   jobState,
// }: IntegrationStepExecutionContext<IntegrationConfig>) {
//   const apiClient = createAPIClient(instance.config);

//   const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

//   await apiClient.iterateUsers(async (user) => {
//     const userEntity = await jobState.addEntity(createUserEntity(user));
//     await jobState.addRelationship(
//       createAccountUserRelationship(accountEntity, userEntity),
//     );
//   });
// }

// export async function fetchGroups({
//   instance,
//   jobState,
// }: IntegrationStepExecutionContext<IntegrationConfig>) {
//   const apiClient = createAPIClient(instance.config);

//   const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

//   await apiClient.iterateGroups(async (group) => {
//     const groupEntity = await jobState.addEntity(createGroupEntity(group));
//     await jobState.addRelationship(
//       createAccountGroupRelationship(accountEntity, groupEntity),
//     );
//   });
// }

// export async function buildGroupUserRelationships({
//   jobState,
//   logger,
// }: IntegrationStepExecutionContext<IntegrationConfig>) {
//   await jobState.iterateEntities(
//     { _type: Entities.GROUP._type },
//     async (groupEntity) => {
//       const group = getRawData<AcmeGroup>(groupEntity);

//       if (!group) {
//         logger.warn(
//           { _key: groupEntity._key },
//           'Could not get raw data for group entity',
//         );
//         return;
//       }

//       for (const user of group.users || []) {
//         const userEntity = await jobState.findEntity(user.id);

//         if (!userEntity) {
//           throw new IntegrationMissingKeyError(
//             `Expected user with key to exist (key=${user.id})`,
//           );
//         }

//         await jobState.addRelationship(
//           createGroupUserRelationship(groupEntity, userEntity),
//         );
//       }
//     },
//   );
// }

// export const vulnerabilitiesSteps: IntegrationStep<IntegrationConfig>[] = [
//   {
//     id: Steps.VULNERABILITIES,
//     name: 'Fetch Vulnerabilities',
//     entities: [Entities.VULNERABILITY],
//     relationships: [Relationships.HOST_HAS_VULNERABILITY],
//     dependsOn: [Steps.HOSTS],
//     executionHandler: fetchVulnerabilities,
//   },
//   {
//     id: Steps.PLUGINS,
//     name: 'Fetch Plugins',
//     entities: [Entities.PLUGIN],
//     relationships: [],
//     dependsOn: [Steps.VULNERABILITIES],
//     executionHandler: fetchPlugins,
//   },
//   {
//     id: Steps.PLUGIN_VULNERABILITY_RELATIONSHIPS,
//     name: 'Build Plugin -> Vulnerability Relationships',
//     entities: [],
//     relationships: [Relationships.PLUGIN_DETECTS_VULNERABILITY],
//     dependsOn: [Steps.VULNERABILITIES, Steps.PLUGINS],
//     executionHandler: buildPluginVulnerabilityRelationships,
//   },
// ];
