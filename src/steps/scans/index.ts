import {
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  IntegrationMissingKeyError,
  getRawData,
  createDirectRelationship,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { NessusHostDetails, NessusScanDetails } from '../../nessus/types';
import { Entities, Relationships, Steps } from '../constants';
import {
  createHostEntity,
  createScanEntity,
  createVulnEntity,
} from './converter';

export async function fetchScans({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await apiClient.iterateScans(async (scan) => {
    await jobState.addEntity(createScanEntity(scan));
  });
}

export async function fetchHosts({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await jobState.iterateEntities(
    { _type: Entities.SCAN._type },
    async (scanEntity) => {
      const scanRawData = getRawData<NessusScanDetails>(scanEntity);
      await apiClient.iterateHosts(async (host) => {
        host.info.scan_id = scanRawData.info.object_id;
        const hostEntity = createHostEntity(host, scanRawData.info.object_id);
        await jobState.addEntity(hostEntity);
        await jobState.addRelationship(
          createDirectRelationship({
            from: scanEntity,
            _class: RelationshipClass.CONTAINS,
            to: hostEntity,
          }),
        );
      }, scanRawData.info.object_id);
    },
  );
}

export async function fetchVulnerabilities({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await jobState.iterateEntities(
    { _type: Entities.HOST._type },
    async (hostEntity) => {
      const hostRawData = getRawData<NessusHostDetails>(hostEntity);
      await apiClient.iterateVulnerabilities(async (vuln) => {
        const vulnEntity = createVulnEntity(
          vuln,
          hostRawData.info.scan_id,
          hostRawData.vulnerabilities[0].host_id,
        );
        await jobState.addEntity(vulnEntity);
        await jobState.addRelationship(
          createDirectRelationship({
            from: hostEntity,
            _class: RelationshipClass.HAS,
            to: vulnEntity,
          }),
        );
      }, hostRawData);
    },
  );
}

export const scansSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.SCANS,
    name: 'Fetch Scans',
    entities: [Entities.SCAN],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchScans,
  },
  {
    id: Steps.HOSTS,
    name: 'Fetch Hosts',
    entities: [Entities.HOST],
    relationships: [Relationships.SCAN_CONTAINS_HOST],
    dependsOn: [Steps.SCANS],
    executionHandler: fetchHosts,
  },
  {
    id: Steps.VULNERABILITIES,
    name: 'Fetch Vulnerabilities',
    entities: [Entities.VULNERABILITY],
    relationships: [Relationships.HOST_HAS_VULNERABILITY],
    dependsOn: [Steps.HOSTS],
    executionHandler: fetchVulnerabilities,
  },
];
