import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class AdobeExperienceManagerOpsApi implements ICredentialType {
	name = 'adobeExperienceManagerOpsApi';
	displayName = 'Adobe Experience Manager Ops API';
	documentationUrl = 'https://docs.adobe.com/content/help/en/experience-manager-cloud-service/implementing/deploying/overview.html';
	properties: INodeProperties[] = [
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://author-p{programId}-e{environmentId}.adobeaemcloud.com',
			placeholder: 'https://author-p12345-e67890.adobeaemcloud.com',
			description: 'Base URL of your AEM as a Cloud Service instance',
			required: true,
		},
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			default: '',
			description: 'Client ID from Adobe Developer Console',
			required: true,
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Client Secret from Adobe Developer Console',
			required: true,
		},
		{
			displayName: 'Technical Account ID',
			name: 'technicalAccountId',
			type: 'string',
			default: '',
			description: 'Technical Account ID from Adobe Developer Console',
			required: true,
		},
		{
			displayName: 'Organization ID',
			name: 'organizationId',
			type: 'string',
			default: '',
			description: 'Organization ID from Adobe Developer Console',
			required: true,
		},
		{
			displayName: 'Private Key',
			name: 'privateKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Private key for JWT signing (PEM format)',
			required: true,
		},
	];
}