/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-adobeexperiencemanagerops/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class AdobeExperienceManagerOps implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Adobe Experience Manager Ops',
    name: 'adobeexperiencemanagerops',
    icon: 'file:adobeexperiencemanagerops.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Adobe Experience Manager Ops API',
    defaults: {
      name: 'Adobe Experience Manager Ops',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'adobeexperiencemanageropsApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'HealthCheck',
            value: 'healthCheck',
          },
          {
            name: 'ReplicationAgent',
            value: 'replicationAgent',
          },
          {
            name: 'Package',
            value: 'package',
          },
          {
            name: 'Cache',
            value: 'cache',
          },
          {
            name: 'Workflow',
            value: 'workflow',
          },
          {
            name: 'MaintenanceTask',
            value: 'maintenanceTask',
          }
        ],
        default: 'healthCheck',
      },
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['healthCheck'] } },
  options: [
    { 
      name: 'Get System Health', 
      value: 'getSystemHealth', 
      description: 'Get overall system health status', 
      action: 'Get system health status' 
    },
    { 
      name: 'Get Health JSON', 
      value: 'getHealthJson', 
      description: 'Get detailed health check results in JSON format', 
      action: 'Get detailed health check results' 
    },
    { 
      name: 'Get Readiness Check', 
      value: 'getReadinessCheck', 
      description: 'Check if system is ready to serve requests', 
      action: 'Check system readiness' 
    },
    { 
      name: 'Get Liveness Check', 
      value: 'getLivenessCheck', 
      description: 'Check if system is alive and responding', 
      action: 'Check system liveness' 
    }
  ],
  default: 'getSystemHealth',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['replicationAgent'] } },
  options: [
    { name: 'Get All Agents', value: 'getAllAgents', description: 'List all replication agents', action: 'Get all agents' },
    { name: 'Get Agent', value: 'getAgent', description: 'Get specific replication agent details', action: 'Get agent' },
    { name: 'Create Agent', value: 'createAgent', description: 'Create new replication agent', action: 'Create agent' },
    { name: 'Update Agent', value: 'updateAgent', description: 'Update existing replication agent', action: 'Update agent' },
    { name: 'Delete Agent', value: 'deleteAgent', description: 'Delete replication agent', action: 'Delete agent' },
    { name: 'Test Agent', value: 'testAgent', description: 'Test replication agent connection', action: 'Test agent' }
  ],
  default: 'getAllAgents',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['package'] } },
  options: [
    { name: 'Get All Packages', value: 'getAllPackages', description: 'List all packages', action: 'Get all packages' },
    { name: 'Create Package', value: 'createPackage', description: 'Create new content package', action: 'Create package' },
    { name: 'Build Package', value: 'buildPackage', description: 'Build package from filter definition', action: 'Build package' },
    { name: 'Install Package', value: 'installPackage', description: 'Install package to repository', action: 'Install package' },
    { name: 'Uninstall Package', value: 'uninstallPackage', description: 'Uninstall package from repository', action: 'Uninstall package' },
    { name: 'Delete Package', value: 'deletePackage', description: 'Delete package from system', action: 'Delete package' },
    { name: 'Get Package Info', value: 'getPackageInfo', description: 'Get package details and status', action: 'Get package info' },
    { name: 'Upload Package', value: 'uploadPackage', description: 'Upload package file', action: 'Upload package' },
  ],
  default: 'getAllPackages',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['cache'],
		},
	},
	options: [
		{
			name: 'Invalidate Cache',
			value: 'invalidateCache',
			description: 'Invalidate dispatcher cache for specific paths',
			action: 'Invalidate dispatcher cache',
		},
		{
			name: 'Flush Replication Queue',
			value: 'flushReplicationQueue',
			description: 'Flush replication queue to clear cached content',
			action: 'Flush replication queue',
		},
		{
			name: 'Clear User Sessions',
			value: 'clearUserSessions',
			description: 'Clear user sessions and associated caches',
			action: 'Clear user sessions',
		},
		{
			name: 'Get Cache Status',
			value: 'getCacheStatus',
			description: 'Get current cache configuration and status',
			action: 'Get cache status',
		},
		{
			name: 'Trigger Cache Maintenance',
			value: 'triggerCacheMaintenance',
			description: 'Trigger scheduled cache maintenance tasks',
			action: 'Trigger cache maintenance',
		},
	],
	default: 'invalidateCache',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['workflow'],
		},
	},
	options: [
		{
			name: 'Get All Workflows',
			value: 'getAllWorkflows',
			description: 'List all workflow instances',
			action: 'Get all workflows',
		},
		{
			name: 'Get Workflow',
			value: 'getWorkflow',
			description: 'Get specific workflow instance details',
			action: 'Get a workflow',
		},
		{
			name: 'Create Workflow',
			value: 'createWorkflow',
			description: 'Start new workflow instance',
			action: 'Create a workflow',
		},
		{
			name: 'Update Workflow',
			value: 'updateWorkflow',
			description: 'Update workflow instance',
			action: 'Update a workflow',
		},
		{
			name: 'Delete Workflow',
			value: 'deleteWorkflow',
			description: 'Delete workflow instance',
			action: 'Delete a workflow',
		},
		{
			name: 'Complete Work Item',
			value: 'completeWorkItem',
			description: 'Complete workflow work item',
			action: 'Complete a work item',
		},
	],
	default: 'getAllWorkflows',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['maintenanceTask'] } },
  options: [
    { name: 'Get All Tasks', value: 'getAllTasks', description: 'List all maintenance tasks and their status', action: 'Get all maintenance tasks' },
    { name: 'Execute Task', value: 'executeTask', description: 'Execute specific maintenance task', action: 'Execute maintenance task' },
    { name: 'Get Task Status', value: 'getTaskStatus', description: 'Get maintenance task execution status', action: 'Get task status' },
    { name: 'Run Repository Maintenance', value: 'runRepositoryMaintenance', description: 'Execute repository maintenance operations', action: 'Run repository maintenance' },
    { name: 'Get Index Status', value: 'getIndexStatus', description: 'Get search index status and statistics', action: 'Get index status' },
    { name: 'Reindex Content', value: 'reindexContent', description: 'Trigger content reindexing', action: 'Reindex content' },
  ],
  default: 'getAllTasks',
},
{
  displayName: 'Tags',
  name: 'tags',
  type: 'string',
  default: '',
  description: 'Comma-separated list of health check tags to filter by',
  displayOptions: {
    show: {
      resource: ['healthCheck'],
      operation: ['getSystemHealth', 'getHealthJson']
    }
  }
},
{
  displayName: 'Combine Tags OR',
  name: 'combineTagsOr',
  type: 'boolean',
  default: false,
  description: 'Whether to combine tags with OR logic instead of AND',
  displayOptions: {
    show: {
      resource: ['healthCheck'],
      operation: ['getSystemHealth', 'getHealthJson']
    }
  }
},
{
  displayName: 'Agent Name',
  name: 'agentName',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['replicationAgent'],
      operation: ['getAgent', 'createAgent', 'updateAgent', 'deleteAgent', 'testAgent']
    }
  },
  default: '',
  description: 'Name of the replication agent'
},
{
  displayName: 'Title',
  name: 'title',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['replicationAgent'],
      operation: ['createAgent', 'updateAgent']
    }
  },
  default: '',
  description: 'Title of the replication agent'
},
{
  displayName: 'Description',
  name: 'description',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['replicationAgent'],
      operation: ['createAgent', 'updateAgent']
    }
  },
  default: '',
  description: 'Description of the replication agent'
},
{
  displayName: 'Transport URI',
  name: 'transportUri',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['replicationAgent'],
      operation: ['createAgent', 'updateAgent']
    }
  },
  default: '',
  description: 'Transport URI for the replication agent'
},
{
  displayName: 'Transport User',
  name: 'transportUser',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['replicationAgent'],
      operation: ['createAgent']
    }
  },
  default: '',
  description: 'Transport user for authentication'
},
{
  displayName: 'Transport Password',
  name: 'transportPassword',
  type: 'string',
  typeOptions: { password: true },
  displayOptions: {
    show: {
      resource: ['replicationAgent'],
      operation: ['createAgent']
    }
  },
  default: '',
  description: 'Transport password for authentication'
},
{
  displayName: 'Enabled',
  name: 'enabled',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['replicationAgent'],
      operation: ['updateAgent']
    }
  },
  default: true,
  description: 'Whether the replication agent is enabled'
},
{
  displayName: 'Package Name',
  name: 'packageName',
  type: 'string',
  required: true,
  default: '',
  displayOptions: {
    show: {
      resource: ['package'],
      operation: ['createPackage'],
    },
  },
  description: 'Name of the package to create',
},
{
  displayName: 'Group Name',
  name: 'groupName',
  type: 'string',
  required: true,
  default: '',
  displayOptions: {
    show: {
      resource: ['package'],
      operation: ['createPackage'],
    },
  },
  description: 'Group name for the package',
},
{
  displayName: 'Version',
  name: 'version',
  type: 'string',
  required: false,
  default: '1.0.0',
  displayOptions: {
    show: {
      resource: ['package'],
      operation: ['createPackage'],
    },
  },
  description: 'Version of the package',
},
{
  displayName: 'Description',
  name: 'description',
  type: 'string',
  required: false,
  default: '',
  displayOptions: {
    show: {
      resource: ['package'],
      operation: ['createPackage'],
    },
  },
  description: 'Description of the package',
},
{
  displayName: 'Package Name',
  name: 'name',
  type: 'string',
  required: true,
  default: '',
  displayOptions: {
    show: {
      resource: ['package'],
      operation: ['buildPackage', 'installPackage', 'uninstallPackage', 'deletePackage', 'getPackageInfo'],
    },
  },
  description: 'Name of the package to operate on',
},
{
  displayName: 'Package Path',
  name: 'packagePath',
  type: 'string',
  required: true,
  default: '',
  displayOptions: {
    show: {
      resource: ['package'],
      operation: ['uploadPackage'],
    },
  },
  description: 'Path where the package should be uploaded',
},
{
  displayName: 'Package File Data',
  name: 'packageData',
  type: 'string',
  required: true,
  default: '',
  displayOptions: {
    show: {
      resource: ['package'],
      operation: ['uploadPackage'],
    },
  },
  description: 'Base64 encoded package file data or file path',
},
{
  displayName: 'Force',
  name: 'force',
  type: 'boolean',
  required: false,
  default: false,
  displayOptions: {
    show: {
      resource: ['package'],
      operation: ['uploadPackage'],
    },
  },
  description: 'Force upload even if package already exists',
},
{
  displayName: 'Install After Upload',
  name: 'install',
  type: 'boolean',
  required: false,
  default: false,
  displayOptions: {
    show: {
      resource: ['package'],
      operation: ['uploadPackage'],
    },
  },
  description: 'Install package after successful upload',
},
{
	displayName: 'CQ Action',
	name: 'cqAction',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['cache'],
			operation: ['invalidateCache'],
		},
	},
	default: 'activate',
	description: 'The CQ action to perform (e.g., activate, deactivate)',
},
{
	displayName: 'CQ Handle',
	name: 'cqHandle',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['cache'],
			operation: ['invalidateCache'],
		},
	},
	default: '',
	description: 'The handle for the content to invalidate',
},
{
	displayName: 'CQ Path',
	name: 'cqPath',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['cache'],
			operation: ['invalidateCache'],
		},
	},
	default: '/content',
	description: 'The path to invalidate in the cache',
},
{
	displayName: 'Agent ID',
	name: 'agentId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['cache'],
			operation: ['flushReplicationQueue'],
		},
	},
	default: 'publish',
	description: 'The ID of the replication agent',
},
{
	displayName: 'Operation',
	name: 'replicationOperation',
	type: 'options',
	required: true,
	displayOptions: {
		show: {
			resource: ['cache'],
			operation: ['flushReplicationQueue'],
		},
	},
	options: [
		{
			name: 'Clear Queue',
			value: 'clearQueue',
		},
		{
			name: 'Force Flush',
			value: 'forceFlush',
		},
	],
	default: 'clearQueue',
	description: 'The operation to perform on the replication queue',
},
{
	displayName: 'Username',
	name: 'username',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['cache'],
			operation: ['clearUserSessions'],
		},
	},
	default: '',
	description: 'Username for authentication',
},
{
	displayName: 'Password',
	name: 'password',
	type: 'string',
	typeOptions: {
		password: true,
	},
	required: true,
	displayOptions: {
		show: {
			resource: ['cache'],
			operation: ['clearUserSessions'],
		},
	},
	default: '',
	description: 'Password for authentication',
},
{
	displayName: 'Validate Session',
	name: 'validateSession',
	type: 'boolean',
	displayOptions: {
		show: {
			resource: ['cache'],
			operation: ['clearUserSessions'],
		},
	},
	default: true,
	description: 'Whether to validate the session before clearing',
},
{
	displayName: 'Maintenance Operation',
	name: 'maintenanceOperation',
	type: 'options',
	required: true,
	displayOptions: {
		show: {
			resource: ['cache'],
			operation: ['triggerCacheMaintenance'],
		},
	},
	options: [
		{
			name: 'Start',
			value: 'start',
		},
		{
			name: 'Stop',
			value: 'stop',
		},
		{
			name: 'Trigger Now',
			value: 'triggerNow',
		},
	],
	default: 'triggerNow',
	description: 'The maintenance operation to perform',
},
{
	displayName: 'Status',
	name: 'status',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['workflow'],
			operation: ['getAllWorkflows'],
		},
	},
	options: [
		{
			name: 'Running',
			value: 'RUNNING',
		},
		{
			name: 'Completed',
			value: 'COMPLETED',
		},
		{
			name: 'Suspended',
			value: 'SUSPENDED',
		},
		{
			name: 'Aborted',
			value: 'ABORTED',
		},
	],
	default: '',
	description: 'Filter workflows by status',
},
{
	displayName: 'Model',
	name: 'model',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['workflow'],
			operation: ['getAllWorkflows'],
		},
	},
	default: '',
	description: 'Filter workflows by model path',
},
{
	displayName: 'Initiator',
	name: 'initiator',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['workflow'],
			operation: ['getAllWorkflows'],
		},
	},
	default: '',
	description: 'Filter workflows by initiator user ID',
},
{
	displayName: 'Instance ID',
	name: 'instanceId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['workflow'],
			operation: ['getWorkflow', 'updateWorkflow', 'deleteWorkflow', 'completeWorkItem'],
		},
	},
	default: '',
	description: 'The workflow instance ID',
},
{
	displayName: 'Model',
	name: 'model',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['workflow'],
			operation: ['createWorkflow'],
		},
	},
	default: '',
	description: 'Path to the workflow model',
},
{
	displayName: 'Payload Path',
	name: 'payloadPath',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['workflow'],
			operation: ['createWorkflow'],
		},
	},
	default: '',
	description: 'Path to the payload content',
},
{
	displayName: 'Title',
	name: 'title',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['workflow'],
			operation: ['createWorkflow'],
		},
	},
	default: '',
	description: 'Title for the workflow instance',
},
{
	displayName: 'Comment',
	name: 'comment',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['workflow'],
			operation: ['createWorkflow', 'updateWorkflow', 'completeWorkItem'],
		},
	},
	default: '',
	description: 'Comment for the workflow operation',
},
{
	displayName: 'Operation',
	name: 'workflowOperation',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['workflow'],
			operation: ['updateWorkflow'],
		},
	},
	options: [
		{
			name: 'Suspend',
			value: 'suspend',
		},
		{
			name: 'Resume',
			value: 'resume',
		},
		{
			name: 'Abort',
			value: 'abort',
		},
	],
	default: 'suspend',
	description: 'The operation to perform on the workflow',
},
{
	displayName: 'Work Item',
	name: 'item',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['workflow'],
			operation: ['completeWorkItem'],
		},
	},
	default: '',
	description: 'The work item ID to complete',
},
{
	displayName: 'Route',
	name: 'route',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['workflow'],
			operation: ['completeWorkItem'],
		},
	},
	default: '',
	description: 'The route to take for completing the work item',
},
{
  displayName: 'Task Name',
  name: 'taskName',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['maintenanceTask'], operation: ['executeTask', 'getTaskStatus'] } },
  default: '',
  description: 'The name of the maintenance task',
},
{
  displayName: 'Task Operation',
  name: 'taskOperation',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['maintenanceTask'], operation: ['executeTask'] } },
  default: 'start',
  description: 'The operation to perform on the task',
},
{
  displayName: 'Repository Operation',
  name: 'repositoryOperation',
  type: 'options',
  required: true,
  displayOptions: { show: { resource: ['maintenanceTask'], operation: ['runRepositoryMaintenance'] } },
  options: [
    { name: 'Garbage Collection', value: 'gc' },
    { name: 'Data Store Garbage Collection', value: 'datastoreGC' },
    { name: 'Revision Cleanup', value: 'revisionCleanup' },
    { name: 'Consistency Check', value: 'consistencyCheck' },
  ],
  default: 'gc',
  description: 'The repository maintenance operation to perform',
},
{
  displayName: 'Index Path',
  name: 'indexPath',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['maintenanceTask'], operation: ['getIndexStatus', 'reindexContent'] } },
  default: '',
  description: 'The path to the search index',
},
{
  displayName: 'Async',
  name: 'async',
  type: 'boolean',
  displayOptions: { show: { resource: ['maintenanceTask'], operation: ['runRepositoryMaintenance', 'reindexContent'] } },
  default: true,
  description: 'Whether to run the operation asynchronously',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'healthCheck':
        return [await executeHealthCheckOperations.call(this, items)];
      case 'replicationAgent':
        return [await executeReplicationAgentOperations.call(this, items)];
      case 'package':
        return [await executePackageOperations.call(this, items)];
      case 'cache':
        return [await executeCacheOperations.call(this, items)];
      case 'workflow':
        return [await executeWorkflowOperations.call(this, items)];
      case 'maintenanceTask':
        return [await executeMaintenanceTaskOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeHealthCheckOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('adobeexperiencemanageropsApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'getSystemHealth': {
          const tags = this.getNodeParameter('tags', i) as string;
          const combineTagsOr = this.getNodeParameter('combineTagsOr', i) as boolean;
          
          let url = `${credentials.baseUrl}/system/health`;
          const params = [];
          
          if (tags) {
            params.push(`tags=${encodeURIComponent(tags)}`);
          }
          if (combineTagsOr) {
            params.push('combineTagsOr=true');
          }
          if (params.length > 0) {
            url += `?${params.join('&')}`;
          }
          
          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Bearer ${credentials.bearerToken}`,
              'Accept': 'application/json'
            },
            json: true
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getHealthJson': {
          const tags = this.getNodeParameter('tags', i) as string;
          const combineTagsOr = this.getNodeParameter('combineTagsOr', i) as boolean;
          
          let url = `${credentials.baseUrl}/system/health.json`;
          const params = [];
          
          if (tags) {
            params.push(`tags=${encodeURIComponent(tags)}`);
          }
          if (combineTagsOr) {
            params.push('combineTagsOr=true');
          }
          if (params.length > 0) {
            url += `?${params.join('&')}`;
          }
          
          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Bearer ${credentials.bearerToken}`,
              'Accept': 'application/json'
            },
            json: true
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getReadinessCheck': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/system/readiness`,
            headers: {
              'Authorization': `Bearer ${credentials.bearerToken}`,
              'Accept': 'application/json'
            },
            json: true
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getLivenessCheck': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/system/liveness`,
            headers: {
              'Authorization': `Bearer ${credentials.bearerToken}`,
              'Accept': 'application/json'
            },
            json: true
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }
      
      returnData.push({
        json: result,
        pairedItem: { item: i }
      });
      
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i }
        });
      } else {
        throw error;
      }
    }
  }
  
  return returnData;
}

async function executeReplicationAgentOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('adobeexperiencemanageropsApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getAllAgents': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/etc/replication/agents.author.json`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Accept': 'application/json'
            },
            json: true
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAgent': {
          const agentName = this.getNodeParameter('agentName', i) as string;
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/etc/replication/agents.author/${agentName}.json`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Accept': 'application/json'
            },
            json: true
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createAgent': {
          const agentName = this.getNodeParameter('agentName', i) as string;
          const title = this.getNodeParameter('title', i) as string;
          const description = this.getNodeParameter('description', i) as string;
          const transportUri = this.getNodeParameter('transportUri', i) as string;
          const transportUser = this.getNodeParameter('transportUser', i) as string;
          const transportPassword = this.getNodeParameter('transportPassword', i) as string;

          const body: any = {
            'jcr:primaryType': 'cq:ReplicationAgent',
            title,
            description,
            'transportUri': transportUri,
            'transportUser': transportUser,
            'transportPassword': transportPassword,
            enabled: true
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/etc/replication/agents.author/${agentName}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body,
            json: true
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateAgent': {
          const agentName = this.getNodeParameter('agentName', i) as string;
          const title = this.getNodeParameter('title', i) as string;
          const description = this.getNodeParameter('description', i) as string;
          const transportUri = this.getNodeParameter('transportUri', i) as string;
          const enabled = this.getNodeParameter('enabled', i) as boolean;

          const body: any = {
            title,
            description,
            'transportUri': transportUri,
            enabled
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/etc/replication/agents.author/${agentName}.json`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body,
            json: true
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteAgent': {
          const agentName = this.getNodeParameter('agentName', i) as string;
          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/etc/replication/agents.author/${agentName}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Accept': 'application/json'
            },
            json: true
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'testAgent': {
          const agentName = this.getNodeParameter('agentName', i) as string;
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/etc/replication/agents.author/${agentName}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: {
              cmd: 'test'
            },
            json: true
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i }
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i }
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executePackageOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('adobeexperiencemanageropsApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getAllPackages': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/crx/packmgr/service.jsp`,
            qs: {
              cmd: 'ls',
            },
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Accept': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createPackage': {
          const packageName = this.getNodeParameter('packageName', i) as string;
          const groupName = this.getNodeParameter('groupName', i) as string;
          const version = this.getNodeParameter('version', i) as string;
          const description = this.getNodeParameter('description', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/crx/packmgr/service.jsp`,
            form: {
              cmd: 'create',
              packageName,
              groupName,
              version,
              description,
            },
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'buildPackage': {
          const name = this.getNodeParameter('name', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/crx/packmgr/service.jsp`,
            form: {
              cmd: 'build',
              name,
            },
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'installPackage': {
          const name = this.getNodeParameter('name', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/crx/packmgr/service.jsp`,
            form: {
              cmd: 'inst',
              name,
            },
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'uninstallPackage': {
          const name = this.getNodeParameter('name', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/crx/packmgr/service.jsp`,
            form: {
              cmd: 'uninst',
              name,
            },
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deletePackage': {
          const name = this.getNodeParameter('name', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/crx/packmgr/service.jsp`,
            form: {
              cmd: 'rm',
              name,
            },
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getPackageInfo': {
          const name = this.getNodeParameter('name', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/crx/packmgr/service.jsp`,
            qs: {
              cmd: 'get',
              name,
            },
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Accept': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'uploadPackage': {
          const packagePath = this.getNodeParameter('packagePath', i) as string;
          const packageData = this.getNodeParameter('packageData', i) as string;
          const force = this.getNodeParameter('force', i) as boolean;
          const install = this.getNodeParameter('install', i) as boolean;

          const formData: any = {
            force: force.toString(),
            install: install.toString(),
          };

          if (packageData.startsWith('data:')) {
            const base64Data = packageData.split(',')[1];
            formData.file = {
              value: Buffer.from(base64Data, 'base64'),
              options: {
                filename: 'package.zip',
                contentType: 'application/zip',
              },
            };
          } else {
            formData.file = packageData;
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/crx/packmgr/service/.json/${packagePath}`,
            formData,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Accept': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeCacheOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('adobeexperiencemanageropsApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			const baseOptions: any = {
				headers: {
					'Authorization': `Bearer ${credentials.accessToken}`,
					'Content-Type': 'application/json',
				},
				json: true,
			};

			switch (operation) {
				case 'invalidateCache': {
					const cqAction = this.getNodeParameter('cqAction', i) as string;
					const cqHandle = this.getNodeParameter('cqHandle', i) as string;
					const cqPath = this.getNodeParameter('cqPath', i) as string;

					const options: any = {
						...baseOptions,
						method: 'POST',
						url: `${credentials.baseUrl}/dispatcher/invalidate.cache`,
						body: {
							'CQ-Action': cqAction,
							'CQ-Handle': cqHandle,
							'CQ-Path': cqPath,
						},
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'flushReplicationQueue': {
					const agentId = this.getNodeParameter('agentId', i) as string;
					const replicationOperation = this.getNodeParameter('replicationOperation', i) as string;

					const options: any = {
						...baseOptions,
						method: 'POST',
						url: `${credentials.baseUrl}/system/console/jmx/com.adobe.granite.replication%3Atype%3Dagent%2Cid%3D${agentId}`,
						body: {
							agentId,
							operation: replicationOperation,
						},
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'clearUserSessions': {
					const username = this.getNodeParameter('username', i) as string;
					const password = this.getNodeParameter('password', i) as string;
					const validateSession = this.getNodeParameter('validateSession', i) as boolean;

					const options: any = {
						...baseOptions,
						method: 'POST',
						url: `${credentials.baseUrl}/libs/granite/core/content/login.html/j_security_check`,
						body: {
							j_username: username,
							j_password: password,
							j_validate: validateSession,
						},
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getCacheStatus': {
					const options: any = {
						...baseOptions,
						method: 'GET',
						url: `${credentials.baseUrl}/system/console/status-slingsettings`,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'triggerCacheMaintenance': {
					const maintenanceOperation = this.getNodeParameter('maintenanceOperation', i) as string;

					const options: any = {
						...baseOptions,
						method: 'POST',
						url: `${credentials.baseUrl}/system/console/jmx/org.apache.sling.commons.scheduler%3Atype%3DQuartzScheduler`,
						body: {
							operation: maintenanceOperation,
						},
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeWorkflowOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('adobeexperiencemanageropsApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getAllWorkflows': {
					const status = this.getNodeParameter('status', i) as string;
					const model = this.getNodeParameter('model', i) as string;
					const initiator = this.getNodeParameter('initiator', i) as string;

					const queryParams: string[] = [];
					if (status) queryParams.push(`status=${encodeURIComponent(status)}`);
					if (model) queryParams.push(`model=${encodeURIComponent(model)}`);
					if (initiator) queryParams.push(`initiator=${encodeURIComponent(initiator)}`);

					const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/etc/workflow/instances.json${queryString}`,
						headers: {
							'Authorization': `Bearer ${credentials.bearerToken}`,
							'Accept': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getWorkflow': {
					const instanceId = this.getNodeParameter('instanceId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/etc/workflow/instances/${instanceId}.json`,
						headers: {
							'Authorization': `Bearer ${credentials.bearerToken}`,
							'Accept': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'createWorkflow': {
					const model = this.getNodeParameter('model', i) as string;
					const payloadPath = this.getNodeParameter('payloadPath', i) as string;
					const title = this.getNodeParameter('title', i) as string;
					const comment = this.getNodeParameter('comment', i) as string;

					const body: any = {
						model,
						payloadPath,
					};

					if (title) body.title = title;
					if (comment) body.comment = comment;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/etc/workflow/instances`,
						headers: {
							'Authorization': `Bearer ${credentials.bearerToken}`,
							'Content-Type': 'application/json',
							'Accept': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updateWorkflow': {
					const instanceId = this.getNodeParameter('instanceId', i) as string;
					const workflowOperation = this.getNodeParameter('workflowOperation', i) as string;
					const comment = this.getNodeParameter('comment', i) as string;

					const body: any = {
						operation: workflowOperation,
					};

					if (comment) body.comment = comment;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/etc/workflow/instances/${instanceId}`,
						headers: {
							'Authorization': `Bearer ${credentials.bearerToken}`,
							'Content-Type': 'application/json',
							'Accept': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'deleteWorkflow': {
					const instanceId = this.getNodeParameter('instanceId', i) as string;

					const options: any = {
						method: 'DELETE',
						url: `${credentials.baseUrl}/etc/workflow/instances/${instanceId}`,
						headers: {
							'Authorization': `Bearer ${credentials.bearerToken}`,
							'Accept': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'completeWorkItem': {
					const instanceId = this.getNodeParameter('instanceId', i) as string;
					const item = this.getNodeParameter('item', i) as string;
					const route = this.getNodeParameter('route', i) as string;
					const comment = this.getNodeParameter('comment', i) as string;

					const body: any = {
						item,
					};

					if (route) body.route = route;
					if (comment) body.comment = comment;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/etc/workflow/instances/${instanceId}`,
						headers: {
							'Authorization': `Bearer ${credentials.bearerToken}`,
							'Content-Type': 'application/json',
							'Accept': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(
						this.getNode(),
						`Unknown operation: ${operation}`,
					);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeMaintenanceTaskOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('adobeexperiencemanageropsApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const baseHeaders: any = {
        'Authorization': `Bearer ${credentials.token}`,
        'Content-Type': 'application/json',
      };

      switch (operation) {
        case 'getAllTasks': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/system/console/status-maintenance`,
            headers: baseHeaders,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'executeTask': {
          const taskName = this.getNodeParameter('taskName', i) as string;
          const taskOperation = this.getNodeParameter('taskOperation', i) as string;
          const encodedTaskName = encodeURIComponent(`com.adobe.granite.maintenance:type=Task,name=${taskName}`);
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/system/console/jmx/${encodedTaskName}`,
            headers: baseHeaders,
            body: {
              operation: taskOperation,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTaskStatus': {
          const taskName = this.getNodeParameter('taskName', i) as string;
          const encodedTaskName = encodeURIComponent(`com.adobe.granite.maintenance:type=Task,name=${taskName}`);
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/system/console/jmx/${encodedTaskName}`,
            headers: baseHeaders,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'runRepositoryMaintenance': {
          const repositoryOperation = this.getNodeParameter('repositoryOperation', i) as string;
          const async = this.getNodeParameter('async', i) as boolean;
          const encodedMBean = encodeURIComponent('org.apache.jackrabbit.oak:type=RepositoryManagement');
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/system/console/jmx/${encodedMBean}`,
            headers: baseHeaders,
            body: {
              operation: repositoryOperation,
              async: async,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getIndexStatus': {
          const indexPath = this.getNodeParameter('indexPath', i) as string;
          const encodedMBean = encodeURIComponent(`org.apache.lucene:type=LuceneIndex,path=${indexPath}`);
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/system/console/jmx/${encodedMBean}`,
            headers: baseHeaders,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'reindexContent': {
          const indexPath = this.getNodeParameter('indexPath', i) as string;
          const async = this.getNodeParameter('async', i) as boolean;
          const encodedMBean = encodeURIComponent(`org.apache.lucene:type=LuceneIndex,path=${indexPath}`);
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/system/console/jmx/${encodedMBean}`,
            headers: baseHeaders,
            body: {
              operation: 'reindex',
              async: async,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }
  return returnData;
}
