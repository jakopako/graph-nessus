import {
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import * as crypto from 'crypto';
// import util from 'util';

import { Entities } from '../constants';
import {
  NessusHostDetails,
  NessusScanDetails,
  NessusVulnerability,
} from '../../nessus/types';
import { generateEntityKey } from '../../utils/generateKey';

export function generateHostEntityKey(
  host: NessusHostDetails,
  scanId: number,
): string {
  return `${Entities.HOST._type}_${host.info['host-fqdn']}_${crypto
    .createHash('md5')
    .update(host.info['host-ip'] + host.info['mac-address'] + scanId)
    .digest('hex')}`;
}

export function generateVulnEntityKey(
  vuln: NessusVulnerability,
  scanId: number,
  hostId: number,
): string {
  // console.log(vuln);
  // console.log(util.inspect(vuln, false, null, true /* enable colors */));
  // console.log(scanId);
  // console.log(hostId);
  return `${Entities.HOST._type}_${crypto
    .createHash('md5')
    .update(
      vuln.outputs[0].plugin_output +
        vuln.info.plugindescription.pluginid +
        scanId +
        hostId,
    )
    .digest('hex')}`;
}

export function getSeverityString(numericSeverity: number): string {
  if (numericSeverity == 0) {
    return 'info';
  } else if (numericSeverity == 1) {
    return 'low';
  } else if (numericSeverity == 2) {
    return 'medium';
  } else if (numericSeverity == 3) {
    return 'high';
  } else if (numericSeverity == 4) {
    return 'critical';
  } else {
    return 'unknown';
  }
}

export function createScanEntity(scan: NessusScanDetails): Entity {
  return createIntegrationEntity({
    entityData: {
      source: scan,
      assign: {
        _type: Entities.SCAN._type,
        _class: Entities.SCAN._class,
        _key: generateEntityKey(Entities.SCAN._type, scan.info.object_id),
        name: scan.info.name,
        id: scan.info.object_id.toString(),
        scanType: scan.info.scan_type,
        scanStart: parseTimePropertyValue(scan.info.scan_start),
        scanEnd: parseTimePropertyValue(scan.info.scan_end),
        status: scan.info.status,
        scannerName: scan.info.scanner_name,
      },
    },
  });
}

export function createHostEntity(
  host: NessusHostDetails,
  scanId: number,
): Entity {
  return createIntegrationEntity({
    entityData: {
      source: host,
      assign: {
        _type: Entities.HOST._type,
        _class: Entities.HOST._class,
        _key: generateHostEntityKey(host, scanId),
        name: host.info['host-fqdn'],
        hostname: host.info['host-fqdn'],
        ipAddress: host.info['host-ip'],
        macAddress: host.info['mac-address'],
        operatingSystem: host.info['operating-system'],
        scanId: scanId,
      },
    },
  });
}

export function createVulnEntity(
  vuln: NessusVulnerability,
  scanId: number,
  hostId: number,
): Entity {
  return createIntegrationEntity({
    entityData: {
      source: vuln,
      assign: {
        _type: Entities.VULNERABILITY._type,
        _class: Entities.VULNERABILITY._class,
        _key: generateVulnEntityKey(vuln, scanId, hostId),
        name: vuln.info.plugindescription.pluginname,
        category: 'host',
        severity: getSeverityString(vuln.info.plugindescription.severity),
        numericSeverity: vuln.info.plugindescription.severity,
        vector:
          vuln.info.plugindescription.pluginattributes.risk_information
            .cvss3_vector,
        score:
          parseFloat(
            vuln.info.plugindescription.pluginattributes.risk_information
              .cvss3_base_score,
          ) || undefined,
        open: true,
        status: vuln.outputs[0].plugin_output || '',
      },
    },
  });
}
