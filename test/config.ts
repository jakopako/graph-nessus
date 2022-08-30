import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';
import { StepTestConfig } from '@jupiterone/integration-sdk-testing';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { invocationConfig } from '../src';
import { IntegrationConfig } from '../src/config';

if (process.env.LOAD_ENV) {
  dotenv.config({
    path: path.join(__dirname, '../.env'),
  });
}
const DEFAULT_ACCESS_KEY = 'dummy-access-key';
const DEFAULT_SECRET_KEY = 'dummy-secret-key';
const DEFAULT_NESSUS_HOST = 'localhost:8834';

export const integrationConfig: IntegrationConfig = {
  accessKey: process.env.ACCESS_KEY || DEFAULT_ACCESS_KEY,
  secretKey: process.env.SECRET_KEY || DEFAULT_SECRET_KEY,
  nessusHost: process.env.NESSUS_HOST || DEFAULT_NESSUS_HOST,
  disableTlsVerification: process.env.DISABLE_TLS_VERIFICATION == 'true',
};

export function buildStepTestConfigForStep(stepId: string): StepTestConfig {
  return {
    stepId,
    instanceConfig: integrationConfig,
    invocationConfig: invocationConfig as IntegrationInvocationConfig,
  };
}
