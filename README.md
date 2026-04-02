# n8n-nodes-adobe-experience-manager-ops

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node provides comprehensive Adobe Experience Manager operations management capabilities with 6 core resources. It enables system health monitoring, content replication management, package deployment, cache operations, workflow automation, and maintenance task execution for AEM instances.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![AEM](https://img.shields.io/badge/AEM-Experience%20Manager-red)
![Adobe](https://img.shields.io/badge/Adobe-Experience%20Cloud-orange)
![CMS](https://img.shields.io/badge/CMS-Content%20Management-green)

## Features

- **Health Monitoring** - Monitor AEM instance health, bundles, and system status in real-time
- **Replication Management** - Configure and control content replication agents across publish instances
- **Package Operations** - Deploy, install, uninstall, and manage AEM packages programmatically
- **Cache Control** - Clear dispatcher cache, flush content cache, and manage caching strategies
- **Workflow Automation** - Start, stop, monitor, and manage AEM workflow instances and models
- **Maintenance Tasks** - Execute system maintenance operations like garbage collection and log rotation
- **Multi-Environment Support** - Connect to multiple AEM environments (author, publish, preview)
- **Enterprise Ready** - Built for production AEM deployments with comprehensive error handling

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-adobe-experience-manager-ops`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-adobe-experience-manager-ops
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-adobe-experience-manager-ops.git
cd n8n-nodes-adobe-experience-manager-ops
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-adobe-experience-manager-ops
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| AEM Host | Your AEM instance URL (e.g., https://author.example.com) | Yes |
| Username | AEM user with administrative privileges | Yes |
| Password | Password or API token for the AEM user | Yes |
| Port | AEM instance port (default: 4502 for author, 4503 for publish) | No |
| SSL Verify | Enable SSL certificate verification | No |

## Resources & Operations

### 1. HealthCheck

| Operation | Description |
|-----------|-------------|
| Get System Status | Retrieve overall AEM system health and status information |
| Check Bundle Status | Monitor OSGi bundle states and identify issues |
| Get Memory Usage | Fetch JVM memory consumption and garbage collection metrics |
| Check Disk Space | Monitor available disk space on AEM instance |
| Validate Services | Verify critical AEM services are running properly |

### 2. ReplicationAgent

| Operation | Description |
|-----------|-------------|
| List Agents | Get all configured replication agents for the instance |
| Get Agent Details | Retrieve specific replication agent configuration and status |
| Create Agent | Configure a new replication agent with specified settings |
| Update Agent | Modify existing replication agent configuration |
| Enable Agent | Activate a replication agent for content distribution |
| Disable Agent | Deactivate a replication agent temporarily |
| Test Connection | Verify replication agent connectivity to target |
| Clear Queue | Remove pending items from replication queue |

### 3. Package

| Operation | Description |
|-----------|-------------|
| List Packages | Retrieve all packages available in package manager |
| Get Package Info | Get detailed information about a specific package |
| Upload Package | Upload a new package file to AEM instance |
| Install Package | Install an uploaded package to the AEM repository |
| Uninstall Package | Remove a previously installed package |
| Build Package | Create package from package definition |
| Download Package | Export and download package from AEM |
| Delete Package | Remove package from package manager |

### 4. Cache

| Operation | Description |
|-----------|-------------|
| Flush Dispatcher | Clear dispatcher cache for specified paths |
| Invalidate Content | Invalidate cached content for specific resources |
| Clear Client Libraries | Remove cached CSS/JS client library files |
| Flush All Cache | Clear all caching layers (dispatcher, content, clientlibs) |
| Get Cache Stats | Retrieve cache hit/miss statistics and performance metrics |
| Configure Cache | Update cache configuration and rules |

### 5. Workflow

| Operation | Description |
|-----------|-------------|
| List Workflows | Get all available workflow models in the system |
| Start Workflow | Initiate a workflow instance with specified payload |
| Get Workflow Status | Check status and progress of running workflow |
| Stop Workflow | Terminate a running workflow instance |
| List Instances | Retrieve all workflow instances with filtering options |
| Get Workflow History | Fetch execution history and audit trail |
| Update Workflow | Modify workflow model configuration |

### 6. MaintenanceTask

| Operation | Description |
|-----------|-------------|
| List Tasks | Get all available maintenance tasks and their schedules |
| Run Garbage Collection | Execute JVM garbage collection and cleanup |
| Rotate Logs | Archive current log files and start new ones |
| Cleanup Versions | Remove old content versions based on retention policy |
| Purge Audit Log | Clean up audit log entries older than specified date |
| Compact Repository | Optimize repository storage and remove fragmentation |
| Update Search Index | Rebuild or update Oak search indexes |
| Schedule Task | Configure automatic execution of maintenance tasks |

## Usage Examples

```javascript
// Monitor AEM system health
const healthStatus = await this.helpers.httpRequest({
  method: 'GET',
  url: 'https://author.example.com:4502/system/console/bundles.json',
  auth: {
    username: 'admin',
    password: 'admin'
  }
});

// Activate content replication
await this.helpers.httpRequest({
  method: 'POST',
  url: 'https://author.example.com:4502/bin/replicate.json',
  form: {
    cmd: 'activate',
    path: '/content/mysite/en/homepage'
  }
});
```

```javascript
// Install AEM package
await this.helpers.httpRequest({
  method: 'POST',
  url: 'https://author.example.com:4502/crx/packmgr/service/.json/etc/packages/mycompany/mypackage.zip',
  form: {
    cmd: 'install'
  }
});

// Clear dispatcher cache
await this.helpers.httpRequest({
  method: 'POST',
  url: 'https://publish.example.com:4503/dispatcher/invalidate.cache',
  form: {
    path: '/content/mysite/*',
    type: 'Activate'
  }
});
```

```javascript
// Start AEM workflow
await this.helpers.httpRequest({
  method: 'POST',
  url: 'https://author.example.com:4502/etc/workflow/instances',
  form: {
    model: '/etc/workflow/models/request_for_activation',
    payloadType: 'JCR_PATH',
    payload: '/content/mysite/en/products'
  }
});

// Execute maintenance task
await this.helpers.httpRequest({
  method: 'POST',
  url: 'https://author.example.com:4502/system/console/jmx/java.lang%3Atype%3DMemory/op/gc',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
});
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| 401 Unauthorized | Invalid credentials or insufficient permissions | Verify username/password and ensure user has admin rights |
| 403 Forbidden | Operation not permitted for current user | Grant necessary permissions or use service account |
| 404 Not Found | AEM resource or endpoint does not exist | Check AEM version compatibility and resource paths |
| 500 Internal Server Error | AEM server error or service unavailable | Check AEM logs and system health status |
| Connection Timeout | Network connectivity issues to AEM instance | Verify AEM host URL, port, and network connectivity |
| Package Install Failed | Package installation error or conflicts | Check package dependencies and AEM version compatibility |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-adobe-experience-manager-ops/issues)
- **Adobe AEM Documentation**: [Adobe Experience Manager Docs](https://experienceleague.adobe.com/docs/experience-manager.html)
- **AEM Community**: [Adobe Experience League Community](https://experienceleaguecommunities.adobe.com/t5/adobe-experience-manager/ct-p/adobe-experience-manager-community)