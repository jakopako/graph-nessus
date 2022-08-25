import {
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  IntegrationMissingKeyError,
  getRawData,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { Entities, Steps } from '../constants';
import { createScanEntity } from './converter';

export async function fetchScans({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await apiClient.iterateScans(async (scan) => {
    await jobState.addEntity(createScanEntity(scan));
  });
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
  // {
  //   id: Steps.HOSTS,
  //   name: 'Fetch Hosts',
  //   entities: [Entities.HOST],
  //   relationships: [],
  //   dependsOn: [Steps.SCANS],
  //   executionHandler: fetchHosts,
  // },
  // {
  //   id: Steps.SCAN_HOST_RELATIONSHIPS,
  //   name: 'Build Scan -> Host Relationships',
  //   entities: [],
  //   relationships: [Relationships.SCAN_CONTAINS_HOST],
  //   dependsOn: [Steps.SCANS, Steps.HOSTS],
  //   executionHandler: buildScanHostRelationships,
  // },
];
