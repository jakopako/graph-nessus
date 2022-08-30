import {
  createMockExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { integrationConfig } from '../test/config';
import { IntegrationConfig, validateInvocation } from './config';

describe('#validateInvocation', () => {
  let recording: Recording;

  afterEach(async () => {
    if (recording) {
      await recording.stop();
    }
  });

  test('requires valid config', async () => {
    const executionContext = createMockExecutionContext<IntegrationConfig>({
      instanceConfig: {} as IntegrationConfig,
    });

    await expect(validateInvocation(executionContext)).rejects.toThrow(
      'Config requires all of {accessKey, secretKey, nessusHost}',
    );
  });

  /**
   * Testing a successful authorization can be done with recordings
   */
  test('successfully validates invocation', async () => {
    // Pass integrationConfig to authenticate with real credentials
    const executionContext = createMockExecutionContext({
      instanceConfig: integrationConfig,
    });

    // successful validateInvocation doesn't throw errors and will be undefined
    await expect(validateInvocation(executionContext)).resolves.toBeUndefined();
  });

  /* Adding `describe` blocks segments the tests into logical sections
   * and makes the output of `yarn test --verbose` provide meaningful
   * to project information to future maintainers.
   */
  describe('fails validating invocation', () => {
    /**
     * Testing failing authorizations can be done with recordings as well.
     * For each possible failure case, a test can be made to ensure that
     * error messaging is expected and clear to end-users
     */
    describe('invalid credentials', () => {
      test('should throw if accessKey is invalid', async () => {
        const executionContext = createMockExecutionContext({
          instanceConfig: {
            accessKey: 'INVALID',
            secretKey: integrationConfig.secretKey,
            nessusHost: integrationConfig.nessusHost,
            disableTlsVerification: true,
          },
        });

        // tests validate that invalid configurations throw an error
        // with an appropriate and expected message.
        await expect(validateInvocation(executionContext)).rejects.toThrow(
          `Provider authentication failed at https://${executionContext.instance.config.nessusHost}/session: 401 Failed to authenticate with the nessus API: Invalid Credentials`,
        );
      });

      test('should throw if secretKey is invalid', async () => {
        const executionContext = createMockExecutionContext({
          instanceConfig: {
            accessKey: integrationConfig.accessKey,
            secretKey: 'INVALID',
            nessusHost: integrationConfig.nessusHost,
            disableTlsVerification: true,
          },
        });

        await expect(validateInvocation(executionContext)).rejects.toThrow(
          `Provider authentication failed at https://${executionContext.instance.config.nessusHost}/session: 401 Failed to authenticate with the nessus API: Invalid Credentials`,
        );
      });
    });
  });
});
