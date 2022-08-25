import {
  IntegrationExecutionContext,
  IntegrationValidationError,
  IntegrationInstanceConfigFieldMap,
  IntegrationInstanceConfig,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from './client';

/**
 * A type describing the configuration fields required to execute the
 * integration for a specific account in the data provider.
 *
 * When executing the integration in a development environment, these values may
 * be provided in a `.env` file with environment variables. For example:
 *
 * - `CLIENT_ID=123` becomes `instance.config.clientId = '123'`
 * - `CLIENT_SECRET=abc` becomes `instance.config.clientSecret = 'abc'`
 *
 * Environment variables are NOT used when the integration is executing in a
 * managed environment. For example, in JupiterOne, users configure
 * `instance.config` in a UI.
 */
export const instanceConfigFields: IntegrationInstanceConfigFieldMap = {
  accessKey: {
    type: 'string',
  },
  secretKey: {
    type: 'string',
    mask: true,
  },
  nessusHost: {
    type: 'string',
  },
  disableTlsVerification: {
    type: 'boolean',
  },
};

/**
 * Properties provided by the `IntegrationInstance.config`. This reflects the
 * same properties defined by `instanceConfigFields`.
 */
export interface IntegrationConfig extends IntegrationInstanceConfig {
  /**
   * A user's access key for the nessus instance.
   */
  accessKey: string;

  /**
   * A user's secret key for the nessus instance.
   */
  secretKey: string;

  /**
   * The hostname of the nessus instance.
   */
  nessusHost: string;

  /**
   * Whether to disable TLS verification.
   */
  disableTlsVerification: string;
}

export async function validateInvocation(
  context: IntegrationExecutionContext<IntegrationConfig>,
) {
  const { config } = context.instance;

  if (!config.accessKey || !config.secretKey || !config.nessusHost) {
    throw new IntegrationValidationError(
      'Config requires all of {accessKey, secretKey, nessusHost}',
    );
  }
  if (config.disableTlsVerification) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }

  const apiClient = createAPIClient(config);
  await apiClient.verifyAuthentication();
}
