/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { AdobeExperienceManagerOps } from '../nodes/Adobe Experience Manager Ops/Adobe Experience Manager Ops.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('AdobeExperienceManagerOps Node', () => {
  let node: AdobeExperienceManagerOps;

  beforeAll(() => {
    node = new AdobeExperienceManagerOps();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Adobe Experience Manager Ops');
      expect(node.description.name).toBe('adobeexperiencemanagerops');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 6 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(6);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(6);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('HealthCheck Resource', () => {
  let mockExecuteFunctions: any;
  
  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        bearerToken: 'test-token',
        baseUrl: 'https://author-p12345-e67890.adobeaemcloud.com'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });

  it('should get system health successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getSystemHealth';
      if (param === 'tags') return 'health,status';
      if (param === 'combineTagsOr') return false;
      return undefined;
    });

    const mockResponse = { status: 'OK', checks: [] };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeHealthCheckOperations.call(mockExecuteFunctions, items);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://author-p12345-e67890.adobeaemcloud.com/system/health?tags=health%2Cstatus',
      headers: {
        'Authorization': 'Bearer test-token',
        'Accept': 'application/json'
      },
      json: true
    });
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should get health JSON successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getHealthJson';
      if (param === 'tags') return '';
      if (param === 'combineTagsOr') return true;
      return undefined;
    });

    const mockResponse = { results: [], status: 'OK' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeHealthCheckOperations.call(mockExecuteFunctions, items);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://author-p12345-e67890.adobeaemcloud.com/system/health.json',
      headers: {
        'Authorization': 'Bearer test-token',
        'Accept': 'application/json'
      },
      json: true
    });
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should get readiness check successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getReadinessCheck');

    const mockResponse = { ready: true };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeHealthCheckOperations.call(mockExecuteFunctions, items);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://author-p12345-e67890.adobeaemcloud.com/system/readiness',
      headers: {
        'Authorization': 'Bearer test-token',
        'Accept': 'application/json'
      },
      json: true
    });
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should get liveness check successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getLivenessCheck');

    const mockResponse = { alive: true };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeHealthCheckOperations.call(mockExecuteFunctions, items);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://author-p12345-e67890.adobeaemcloud.com/system/liveness',
      headers: {
        'Authorization': 'Bearer test-token',
        'Accept': 'application/json'
      },
      json: true
    });
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should handle API errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getSystemHealth');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const items = [{ json: {} }];
    const result = await executeHealthCheckOperations.call(mockExecuteFunctions, items);

    expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
  });

  it('should throw error for unknown operation', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('unknownOperation');

    const items = [{ json: {} }];

    await expect(executeHealthCheckOperations.call(mockExecuteFunctions, items))
      .rejects.toThrow('Unknown operation: unknownOperation');
  });
});

describe('ReplicationAgent Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        accessToken: 'test-token',
        baseUrl: 'https://author-p12345-e67890.adobeaemcloud.com'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn()
      }
    };
  });

  it('should get all replication agents successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getAllAgents');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ agents: [] });

    const result = await executeReplicationAgentOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://author-p12345-e67890.adobeaemcloud.com/etc/replication/agents.author.json',
      headers: {
        'Authorization': 'Bearer test-token',
        'Accept': 'application/json'
      },
      json: true
    });
    expect(result).toHaveLength(1);
  });

  it('should get specific agent successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAgent')
      .mockReturnValueOnce('publish-agent');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ agent: 'data' });

    const result = await executeReplicationAgentOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://author-p12345-e67890.adobeaemcloud.com/etc/replication/agents.author/publish-agent.json',
      headers: {
        'Authorization': 'Bearer test-token',
        'Accept': 'application/json'
      },
      json: true
    });
    expect(result).toHaveLength(1);
  });

  it('should create agent successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createAgent')
      .mockReturnValueOnce('new-agent')
      .mockReturnValueOnce('New Agent')
      .mockReturnValueOnce('Agent description')
      .mockReturnValueOnce('http://publish.example.com:4503/bin/receive')
      .mockReturnValueOnce('admin')
      .mockReturnValueOnce('password');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ success: true });

    const result = await executeReplicationAgentOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://author-p12345-e67890.adobeaemcloud.com/etc/replication/agents.author/new-agent',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: {
        'jcr:primaryType': 'cq:ReplicationAgent',
        title: 'New Agent',
        description: 'Agent description',
        transportUri: 'http://publish.example.com:4503/bin/receive',
        transportUser: 'admin',
        transportPassword: 'password',
        enabled: true
      },
      json: true
    });
    expect(result).toHaveLength(1);
  });

  it('should handle errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getAllAgents');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeReplicationAgentOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });
});

describe('Package Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        accessToken: 'test-token',
        baseUrl: 'https://author-p123-e456.adobeaemcloud.com',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
      },
    };
  });

  it('should get all packages successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAllPackages');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      results: [{ name: 'test-package', group: 'test-group' }],
    });

    const result = await executePackageOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://author-p123-e456.adobeaemcloud.com/crx/packmgr/service.jsp',
      qs: { cmd: 'ls' },
      headers: {
        'Authorization': 'Bearer test-token',
        'Accept': 'application/json',
      },
      json: true,
    });
  });

  it('should create package successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createPackage')
      .mockReturnValueOnce('test-package')
      .mockReturnValueOnce('test-group')
      .mockReturnValueOnce('1.0.0')
      .mockReturnValueOnce('Test package');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      success: true,
      msg: 'Package created',
    });

    const result = await executePackageOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://author-p123-e456.adobeaemcloud.com/crx/packmgr/service.jsp',
      form: {
        cmd: 'create',
        packageName: 'test-package',
        groupName: 'test-group',
        version: '1.0.0',
        description: 'Test package',
      },
      headers: {
        'Authorization': 'Bearer test-token',
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      json: true,
    });
  });

  it('should build package successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('buildPackage')
      .mockReturnValueOnce('test-package');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      success: true,
      msg: 'Package built',
    });

    const result = await executePackageOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://author-p123-e456.adobeaemcloud.com/crx/packmgr/service.jsp',
      form: {
        cmd: 'build',
        name: 'test-package',
      },
      headers: {
        'Authorization': 'Bearer test-token',
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      json: true,
    });
  });

  it('should install package successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('installPackage')
      .mockReturnValueOnce('test-package');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      success: true,
      msg: 'Package installed',
    });

    const result = await executePackageOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://author-p123-e456.adobeaemcloud.com/crx/packmgr/service.jsp',
      form: {
        cmd: 'inst',
        name: 'test-package',
      },
      headers: {
        'Authorization': 'Bearer test-token',
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      json: true,
    });
  });

  it('should handle errors gracefully when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getAllPackages');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const result = await executePackageOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ error: 'API Error' });
  });

  it('should throw error when continueOnFail is false', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getAllPackages');
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    await expect(
      executePackageOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('API Error');
  });
});

describe('Cache Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				accessToken: 'test-token',
				baseUrl: 'https://author-p123-e456.adobeaemcloud.com',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	it('should invalidate cache successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('invalidateCache')
			.mockReturnValueOnce('activate')
			.mockReturnValueOnce('/content/test')
			.mockReturnValueOnce('/content/test');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			success: true,
			message: 'Cache invalidated',
		});

		const result = await executeCacheOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				method: 'POST',
				url: 'https://author-p123-e456.adobeaemcloud.com/dispatcher/invalidate.cache',
			}),
		);
		expect(result).toHaveLength(1);
		expect(result[0].json.success).toBe(true);
	});

	it('should flush replication queue successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('flushReplicationQueue')
			.mockReturnValueOnce('publish')
			.mockReturnValueOnce('clearQueue');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			success: true,
			queueStatus: 'cleared',
		});

		const result = await executeCacheOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				method: 'POST',
				url: expect.stringContaining('/system/console/jmx/com.adobe.granite.replication'),
			}),
		);
		expect(result).toHaveLength(1);
		expect(result[0].json.success).toBe(true);
	});

	it('should clear user sessions successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('clearUserSessions')
			.mockReturnValueOnce('testuser')
			.mockReturnValueOnce('testpass')
			.mockReturnValueOnce(true);

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			success: true,
			sessionsCleared: 5,
		});

		const result = await executeCacheOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				method: 'POST',
				url: expect.stringContaining('/libs/granite/core/content/login.html/j_security_check'),
			}),
		);
		expect(result).toHaveLength(1);
		expect(result[0].json.success).toBe(true);
	});

	it('should get cache status successfully', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getCacheStatus');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			cacheEnabled: true,
			cacheSize: '500MB',
			hitRatio: 0.85,
		});

		const result = await executeCacheOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				method: 'GET',
				url: 'https://author-p123-e456.adobeaemcloud.com/system/console/status-slingsettings',
			}),
		);
		expect(result).toHaveLength(1);
		expect(result[0].json.cacheEnabled).toBe(true);
	});

	it('should trigger cache maintenance successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('triggerCacheMaintenance')
			.mockReturnValueOnce('triggerNow');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			success: true,
			maintenanceStarted: true,
		});

		const result = await executeCacheOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				method: 'POST',
				url: expect.stringContaining('/system/console/jmx/org.apache.sling.commons.scheduler'),
			}),
		);
		expect(result).toHaveLength(1);
		expect(result[0].json.success).toBe(true);
	});

	it('should handle errors when continue on fail is true', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('invalidateCache');
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		const result = await executeCacheOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json.error).toBe('API Error');
	});

	it('should throw error when continue on fail is false', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('invalidateCache');
		mockExecuteFunctions.continueOnFail.mockReturnValue(false);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		await expect(executeCacheOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
	});
});

describe('Workflow Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				bearerToken: 'test-token',
				baseUrl: 'https://author-p12345-e67890.adobeaemcloud.com'
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	it('should get all workflows', async () => {
		mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
			switch (param) {
				case 'operation': return 'getAllWorkflows';
				case 'status': return 'RUNNING';
				case 'model': return '/var/workflow/models/dam/update_asset';
				case 'initiator': return 'admin';
				default: return '';
			}
		});

		const mockResponse = { workflows: [{ id: 'wf1', status: 'RUNNING' }] };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeWorkflowOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://author-p12345-e67890.adobeaemcloud.com/etc/workflow/instances.json?status=RUNNING&model=%2Fvar%2Fworkflow%2Fmodels%2Fdam%2Fupdate_asset&initiator=admin',
			headers: {
				'Authorization': 'Bearer test-token',
				'Accept': 'application/json',
			},
			json: true,
		});
		expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
	});

	it('should get specific workflow', async () => {
		mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
			switch (param) {
				case 'operation': return 'getWorkflow';
				case 'instanceId': return 'workflow-123';
				default: return '';
			}
		});

		const mockResponse = { id: 'workflow-123', status: 'RUNNING' };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeWorkflowOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://author-p12345-e67890.adobeaemcloud.com/etc/workflow/instances/workflow-123.json',
			headers: {
				'Authorization': 'Bearer test-token',
				'Accept': 'application/json',
			},
			json: true,
		});
		expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
	});

	it('should create workflow', async () => {
		mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
			switch (param) {
				case 'operation': return 'createWorkflow';
				case 'model': return '/var/workflow/models/dam/update_asset';
				case 'payloadPath': return '/content/dam/test.jpg';
				case 'title': return 'Test Workflow';
				case 'comment': return 'Test comment';
				default: return '';
			}
		});

		const mockResponse = { id: 'new-workflow-123' };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeWorkflowOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'POST',
			url: 'https://author-p12345-e67890.adobeaemcloud.com/etc/workflow/instances',
			headers: {
				'Authorization': 'Bearer test-token',
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
			body: {
				model: '/var/workflow/models/dam/update_asset',
				payloadPath: '/content/dam/test.jpg',
				title: 'Test Workflow',
				comment: 'Test comment',
			},
			json: true,
		});
		expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
	});

	it('should update workflow', async () => {
		mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
			switch (param) {
				case 'operation': return 'updateWorkflow';
				case 'instanceId': return 'workflow-123';
				case 'workflowOperation': return 'suspend';
				case 'comment': return 'Suspending workflow';
				default: return '';
			}
		});

		const mockResponse = { success: true };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeWorkflowOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'POST',
			url: 'https://author-p12345-e67890.adobeaemcloud.com/etc/workflow/instances/workflow-123',
			headers: {
				'Authorization': 'Bearer test-token',
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
			body: {
				operation: 'suspend',
				comment: 'Suspending workflow',
			},
			json: true,
		});
		expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
	});

	it('should delete workflow', async () => {
		mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
			switch (param) {
				case 'operation': return 'deleteWorkflow';
				case 'instanceId': return 'workflow-123';
				default: return '';
			}
		});

		const mockResponse = { success: true };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeWorkflowOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'DELETE',
			url: 'https://author-p12345-e67890.adobeaemcloud.com/etc/workflow/instances/workflow-123',
			headers: {
				'Authorization': 'Bearer test-token',
				'Accept': 'application/json',
			},
			json: true,
		});
		expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
	});

	it('should complete work item', async () => {
		mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
			switch (param) {
				case 'operation': return 'completeWorkItem';
				case 'instanceId': return 'workflow-123';
				case 'item': return 'workitem-456';
				case 'route': return 'approve';
				case 'comment': return 'Approved';
				default: return '';
			}
		});

		const mockResponse = { success: true };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeWorkflowOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'POST',
			url: 'https://author-p12345-e67890.adobeaemcloud.com/etc/workflow/instances/workflow-123',
			headers: {
				'Authorization': 'Bearer test-token',
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
			body: {
				item: 'workitem-456',
				route: 'approve',
				comment: 'Approved',
			},
			json: true,
		});
		expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
	});

	it('should handle errors gracefully', async () => {
		mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
			if (param === 'operation') return 'getWorkflow';
			if (param === 'instanceId') return 'invalid-id';
			return '';
		});
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Workflow not found'));

		const result = await executeWorkflowOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{ json: { error: 'Workflow not found' }, pairedItem: { item: 0 } }]);
	});
});

describe('MaintenanceTask Resource', () => {
  let mockExecuteFunctions: any;
  
  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        token: 'test-token', 
        baseUrl: 'https://author-p12345-e67890.adobeaemcloud.com' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  it('should get all maintenance tasks successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getAllTasks');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ tasks: [] });

    const result = await executeMaintenanceTaskOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://author-p12345-e67890.adobeaemcloud.com/system/console/status-maintenance',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json',
      },
      json: true,
    });
    expect(result).toHaveLength(1);
  });

  it('should execute maintenance task successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('executeTask')
      .mockReturnValueOnce('cleanup-task')
      .mockReturnValueOnce('start');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ status: 'started' });

    const result = await executeMaintenanceTaskOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ status: 'started' });
  });

  it('should get task status successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getTaskStatus')
      .mockReturnValueOnce('cleanup-task');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ status: 'running' });

    const result = await executeMaintenanceTaskOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ status: 'running' });
  });

  it('should run repository maintenance successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('runRepositoryMaintenance')
      .mockReturnValueOnce('gc')
      .mockReturnValueOnce(true);
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ jobId: '123' });

    const result = await executeMaintenanceTaskOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ jobId: '123' });
  });

  it('should get index status successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getIndexStatus')
      .mockReturnValueOnce('/oak:index/lucene');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ indexSize: '1024MB' });

    const result = await executeMaintenanceTaskOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ indexSize: '1024MB' });
  });

  it('should reindex content successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('reindexContent')
      .mockReturnValueOnce('/oak:index/lucene')
      .mockReturnValueOnce(true);
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ reindexJobId: '456' });

    const result = await executeMaintenanceTaskOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ reindexJobId: '456' });
  });

  it('should handle API errors with continueOnFail', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getAllTasks');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const result = await executeMaintenanceTaskOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });

  it('should throw error when continueOnFail is false', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getAllTasks');
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    await expect(executeMaintenanceTaskOperations.call(mockExecuteFunctions, [{ json: {} }]))
      .rejects.toThrow('API Error');
  });
});
});
