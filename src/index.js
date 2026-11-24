
import config from '@cocreate/config';
import {
    dotNotationToObject,
    uuid
} from '@cocreate/utils';

const defaults = {
    inactivity: 300000,

    context: [
        "You are an AI agent operating within CoCreate's distributed runtime.",
        'Reuse existing tools and introspect the server object to discover capabilities across the distributed runtime.',
        'Distributed server capabilities are documented in their corresponding repositories at https://github.com/CoCreateJS.',
        'Create and improve reusable tools through execution.',
        'Preserve conversation-specific knowledge in conversation context and reusable knowledge in model context.',
        'Refine outdated knowledge and compact conversation context when necessary.'
    ],

    tools: [
        {
            name: 'introspect',
            path: 'agent.introspect',
            method: 'agent.introspect',
            description: 'Discover server capabilities using dot notation.',
            parameters: {
                type: 'object',
                properties: {
                    path: { type: 'string' }
                }
            }
        },
        {
            name: 'readTools',
            path: 'agent.tools.read',
            method: 'agent.tools.read',
            description: 'Retrieve global, model and conversation tools. Optionally select a scope.',
            parameters: {
                type: 'object',
                properties: {
                    scope: {
                        type: 'string',
                        enum: ['global', 'model', 'conversation']
                    }
                }
            }
        },
        {
            name: 'upsertTool',
            path: 'agent.tools.upsert',
            method: 'agent.tools.upsert',
            description: 'Create or improve a reusable tool. Use model scope for reusable capabilities and conversation scope for conversation-specific capabilities.',
            parameters: {
                type: 'object',
                properties: {
                    scope: {
                        type: 'string',
                        enum: ['model', 'conversation']
                    },
                    name: { type: 'string' },
                    tool: {
                        type: 'object',
                        properties: {
                            description: { type: 'string' },
                            path: { type: 'string' },
                            method: { type: 'string' },
                            parameters: { type: 'object' }
                        },
                        required: [
                            'description',
                            'path',
                            'method',
                            'parameters'
                        ]
                    }
                },
                required: ['scope', 'name', 'tool']
            }
        },
        {
            name: 'deleteTool',
            path: 'agent.tools.delete',
            method: 'agent.tools.delete',
            description: 'Delete a tool from model or conversation scope.',
            parameters: {
                type: 'object',
                properties: {
                    scope: {
                        type: 'string',
                        enum: ['model', 'conversation']
                    },
                    name: { type: 'string' }
                },
                required: ['scope', 'name']
            }
        },
        {
            name: 'readContext',
            path: 'agent.context.read',
            method: 'agent.context.read',
            description: 'Retrieve global, model and conversation context. Optionally select a scope.',
            parameters: {
                type: 'object',
                properties: {
                    scope: {
                        type: 'string',
                        enum: ['global', 'model', 'conversation']
                    }
                }
            }
        },
        {
            name: 'upsertContext',
            path: 'agent.context.upsert',
            method: 'agent.context.upsert',
            description: 'Preserve or refine knowledge. Use model scope for reusable knowledge and conversation scope for conversation-specific knowledge.',
            parameters: {
                type: 'object',
                properties: {
                    scope: {
                        type: 'string',
                        enum: ['model', 'conversation']
                    },
                    name: { type: 'string' },
                    context: {
                        type: 'array',
                        items: { type: 'string' }
                    }
                },
                required: ['scope', 'name', 'context']
            }
        },
        {
            name: 'deleteContext',
            path: 'agent.context.delete',
            method: 'agent.context.delete',
            description: 'Remove outdated or unnecessary model or conversation context.',
            parameters: {
                type: 'object',
                properties: {
                    scope: {
                        type: 'string',
                        enum: ['model', 'conversation']
                    },
                    name: { type: 'string' }
                },
                required: ['scope', 'name']
            }
        }
    ]
};

async function init(server) {
    const agentConfig = structuredClone(defaults);

    const sysConfig = config.get('agent');

    const dbConfig = await config.query({
        type: 'agent',
        organization_id: server.organization_id,
        server: server.host,
        cluster: server.cluster_id
    }, server.crud);

    if (sysConfig)
        dotNotationToObject(sysConfig, agentConfig);

    if (dbConfig)
        dotNotationToObject(dbConfig, agentConfig);

    agentConfig.context = [
        ...new Set([
            ...defaults.context,
            ...agentConfig.context
        ])
    ];

    agentConfig.tools = mergeTools(
        agentConfig.tools,
        defaults.tools
    );

    function identity(payload) {
        return {
            organization_id: payload.organization_id,
            host: payload.host,
            user_id: payload.user_id,
            apikey: payload.apikey
        };
    }

    function scope(payload) {
        return {
            model_id: payload.model_id,
            conversation_id: payload.conversation_id,
            context_id: payload.context_id
        };
    }

    function mergeTools(...arrays) {
        const tools = new Map();

        for (const array of arrays)
            for (const tool of array || [])
                tools.set(tool.name, tool);

        return [...tools.values()];
    }

    async function crud(
        payload,
        database,
        array,
        method,
        data
    ) {
        let operation = {
            ...data,
            ...identity(payload),
            storage: 'agent',
            database,
            array,
            method: `object.${method}`
        };

        operation = await server.authorize.request(
            operation,
            payload.user_id
        );

        const response = await server.crud.send(operation);

        if (response?.error?.length)
            throw new Error(response.error.join(', '));

        return response;
    }

    async function read(
        payload,
        database,
        array,
        query,
        options = {}
    ) {
        const response = await crud(
            payload,
            database,
            array,
            'read',
            {
                filter: {
                    ...options,
                    query
                }
            }
        );

        const objects = response?.data ?? response?.object;

        if (!Array.isArray(objects))
            throw new Error('Invalid CRUD read response.');

        return objects;
    }

    function namespace(payload, type, scope) {
        if (!['tools', 'context'].includes(type))
            throw new Error('Invalid type.');

        if (!payload.model_id)
            throw new Error('Model is required.');

        const query = {
            model_id: payload.model_id
        };

        if (scope === 'model')
            return {
                database: 'models',
                array: type,
                query
            };

        if (
            scope === 'conversation' &&
            payload.conversation_id
        ) {
            query.conversation_id = payload.conversation_id;
            query.user_id = payload.user_id;

            if (type === 'context') {
                if (!payload.context_id)
                    throw new Error('Context is required.');

                query.context_id = payload.context_id;
            }

            return {
                database: 'conversations',
                array: type,
                query
            };
        }

        throw new Error('Invalid scope.');
    }

    function collection(type) {
        const key = type === 'tools' ? 'tool' : 'context';

        async function retrieve(payload, scope) {
            const { database, array, query } =
                namespace(payload, type, scope);

            if (
                type === 'context' &&
                scope === 'conversation'
            ) {
                // Include the active context object and its
                // individually persisted knowledge items.

                const { context_id, ...conversationQuery } =
                    query;

                const objects = await read(
                    payload,
                    database,
                    array,
                    {
                        ...conversationQuery,
                        $or: [
                            {
                                _id: context_id,
                                active: true
                            },
                            {
                                context_id
                            }
                        ]
                    }
                );

                return objects.flatMap(
                    object => object.context || []
                );
            }

            const objects = await read(
                payload,
                database,
                array,
                query
            );

            if (type === 'tools')
                return objects.map(object => ({
                    ...object.tool,
                    name: object.name
                }));

            return objects.flatMap(
                object => object.context || []
            );
        }

        return {
            async read(payload) {
                let data;

                if (payload.scope === 'global') {
                    data = structuredClone(agentConfig[type]);

                } else if (payload.scope) {
                    data = await retrieve(
                        payload,
                        payload.scope
                    );

                } else {
                    const [model, conversation] = await Promise.all([
                        payload.model_id
                            ? retrieve(payload, 'model')
                            : [],
                        payload.model_id && payload.conversation_id
                            ? retrieve(payload, 'conversation')
                            : []
                    ]);

                    if (type === 'tools') {
                        data = mergeTools(
                            model,
                            conversation,
                            agentConfig.tools
                        );

                    } else {
                        data = [
                            ...agentConfig.context,
                            ...model,
                            ...conversation
                        ];
                    }
                }

                payload.agent ??= {};
                payload.agent[type] = data;
                payload.data = data;

                return payload;
            },

            async upsert(payload) {
                const { database, array, query } =
                    namespace(payload, type, payload.scope);

                if (
                    typeof payload.name !== 'string' ||
                    !payload.name.trim()
                )
                    throw new Error('Name is required.');

                let value = payload[key];

                if (type === 'tools') {
                    if (
                        !value?.description ||
                        !value.path ||
                        !value.method ||
                        !value.parameters
                    )
                        throw new Error('Invalid tool definition.');

                    value = {
                        description: value.description,
                        path: value.path,
                        method: value.method,
                        parameters: value.parameters
                    };

                } else if (
                    !Array.isArray(value) ||
                    value.some(item => typeof item !== 'string')
                ) {
                    throw new Error('Invalid context.');
                }

                const filter = {
                    ...query,
                    name: payload.name
                };

                const response = await crud(
                    payload,
                    database,
                    array,
                    'update',
                    {
                        filter: {
                            query: filter,
                            upsert: true
                        },
                        object: {
                            ...filter,
                            [key]: value
                        }
                    }
                );

                payload.data =
                    response.data ?? response.object;

                return payload;
            },

            async delete(payload) {
                const { database, array, query } =
                    namespace(payload, type, payload.scope);

                if (
                    typeof payload.name !== 'string' ||
                    !payload.name.trim()
                )
                    throw new Error('Name is required.');

                const response = await crud(
                    payload,
                    database,
                    array,
                    'delete',
                    {
                        filter: {
                            query: {
                                ...query,
                                name: payload.name
                            }
                        }
                    }
                );

                payload.data =
                    response.data ?? response.object;

                return payload;
            }
        };
    }

    const tools = collection('tools');
    const context = collection('context');

    async function conversation(payload) {
        payload.agent ??= {};

        if (!payload.model_id)
            throw new Error('Model is required.');

        if (payload.conversation_id) {
            const contexts = await read(
                payload,
                'conversations',
                'context',
                {
                    model_id: payload.model_id,
                    conversation_id: payload.conversation_id,
                    user_id: payload.user_id,
                    active: true
                }
            );

            if (contexts.length !== 1)
                throw new Error('Conversation not found or invalid.');

            payload.context_id = contexts[0]._id;

        } else {
            // The conversation identifier is needed before
            // persisting its initial context.

            payload.conversation_id = uuid();

            const response = await crud(
                payload,
                'conversations',
                'context',
                'create',
                {
                    object: {
                        model_id: payload.model_id,
                        conversation_id: payload.conversation_id,
                        user_id: payload.user_id,
                        active: true,
                        context: []
                    }
                }
            );

            // CRUD generates the context object's identifier.

            const data = response.data ?? response.object;

            const object = Array.isArray(data)
                ? data[0]
                : data;

            if (!object?._id)
                throw new Error('Context creation did not return an identifier.');

            payload.context_id = object._id;
        }

        return payload;
    }

    const messages = {
        async read(payload) {
            payload.agent ??= {};

            payload.agent.messages = await read(
                payload,
                'conversations',
                'messages',
                {
                    ...scope(payload),
                    user_id: payload.user_id
                },
                {
                    sort: [
                        {
                            key: '_id',
                            direction: 'asc'
                        }
                    ]
                }
            );

            return payload;
        },

        async create(payload) {
            if (!payload.agent?.message)
                return payload;

            // CRUD generates the message identifier.

            const object = {
                ...payload.agent.message,
                ...scope(payload),
                user_id: payload.user_id
            };

            delete object._id;

            const response = await crud(
                payload,
                'conversations',
                'messages',
                'create',
                { object }
            );

            const data = response.data ?? response.object;

            const message = Array.isArray(data)
                ? data[0]
                : data;

            if (!message?._id)
                throw new Error('Message creation did not return an identifier.');

            payload.agent.message = message;

            return payload;
        }
    };

    async function workflow(payload) {
        const request = {
            ...payload,
            scope: undefined,
            agent: {}
        };

        if (!payload.conversation_id)
            request.agent.messages = [];

        await Promise.all([
            context.read({ ...request, agent: request.agent }),
            tools.read({ ...request, agent: request.agent }),
            payload.conversation_id
                ? messages.read({ ...request, agent: request.agent })
                : Promise.resolve({ agent: { messages: [] } })
        ]);

        payload.agent ??= {};

        Object.assign(payload.agent, request.agent);

        delete payload.agent.message;

        const response = await server.workflow.run({
            method: 'workflow.agent',
            organization_id: payload.organization_id,
            host: payload.host,
            agent: [payload]
        });

        if (response?.error?.length)
            throw new Error(response.error.join(', '));

        if (response?.data?.agent)
            Object.assign(payload.agent, response.data.agent);

        if (response?.data?.provider)
            payload.provider = response.data.provider;

        return payload;
    }

    async function send(payload) {
        try {
            await conversation(payload);
            await messages.create(payload);

            return await runCycle(payload, messages.create);

        } catch (error) {
            payload.error ??= [];
            payload.error.push(error.message);
            payload.agentStatus = 'error';

            return payload;
        }
    }

    async function introspect(payload) {
        let target = server;

        // Authorization must govern discoverable paths
        // and returned interface metadata.

        for (const key of (payload.path || '').split('.')) {
            if (!key)
                continue;

            if (
                key.startsWith('_') ||
                key === 'constructor' ||
                key === 'prototype'
            )
                throw new Error('Invalid introspection path.');

            if (
                target === null ||
                !['object', 'function'].includes(typeof target)
            )
                throw new Error('Invalid introspection target.');

            const descriptor =
                Object.getOwnPropertyDescriptor(target, key);

            if (!descriptor || !('value' in descriptor))
                throw new Error('Invalid introspection path.');

            target = descriptor.value;
        }

        if (
            target === null ||
            !['object', 'function'].includes(typeof target)
        )
            throw new Error('Target has no inspectable interface.');

        payload.data = [];

        for (const [key, descriptor] of Object.entries(
            Object.getOwnPropertyDescriptors(target)
        )) {
            if (
                key.startsWith('_') ||
                key === 'constructor' ||
                key === 'prototype'
            )
                continue;

            payload.data.push({
                key,
                type: 'value' in descriptor
                    ? typeof descriptor.value
                    : 'accessor'
            });
        }

        return payload;
    }

    async function runCycle(payload, onComplete, { executeOnly = false } = {}) {
        let timer;
        let expired = false;
        let release;

        const trustedIdentity = identity(payload);
        const trustedScope = scope(payload);
        const executionResults = [];

        const timeout = new Promise(resolve => {
            release = resolve;
        });

        function progress() {
            if (expired)
                return;

            clearTimeout(timer);

            timer = setTimeout(() => {
                expired = true;

                release({
                    ...trustedScope,
                    agent: { executionResults: [...executionResults] },
                    agentStatus: 'pending'
                });

            }, agentConfig.inactivity);

            timer.unref?.();
        }

        async function run() {
            try {
                progress();

                if (!executeOnly && !payload.agent?.calls?.length)
                    await workflow(payload);

                progress();

                while (
                    payload.agent?.calls?.length &&
                    !payload.error?.length
                ) {
                    const available = await tools.read(payload);
                    const definitions = available.data || [];
                    const results = await Promise.all(
                        payload.agent.calls.map(async call => {
                            try {
                                const definition = definitions.find(tool =>
                                    (call.name && tool.name === call.name) ||
                                    (!call.name && tool.path === call.path &&
                                        (!call.arguments?.method || tool.method === call.arguments.method))
                                );

                                if (!definition)
                                    throw new Error(`Unknown agent tool: ${call.name || call.path || 'unnamed'}.`);

                                let operation = {
                                    ...call.arguments,
                                    method: definition.method,
                                    ...trustedScope,
                                    ...trustedIdentity
                                };

                                // Authorization must bind the
                                // actual AST target to the
                                // authorized operation.

                                operation =
                                    await server.authorize.request(
                                        operation,
                                        trustedIdentity.user_id
                                    );

                                const operationScope = {
                                    method: operation.method,
                                    storage: operation.storage,
                                    database: operation.database,
                                    array: operation.array,
                                    index: operation.index,
                                    api: operation.api,
                                    endpoint: operation.endpoint
                                };

                                operation = await server.evaluate({
                                    executeAST: {
                                        [`$server.${definition.path}`]:
                                            operation
                                    },
                                    sandbox: { server }
                                });

                                if (
                                    !operation ||
                                    typeof operation !== 'object'
                                )
                                    throw new Error(
                                        'Invalid operation response.'
                                    );

                                operation =
                                    await server.authorize.request({
                                        ...operation,
                                        ...operationScope,
                                        ...trustedScope,
                                        ...trustedIdentity
                                    }, trustedIdentity.user_id);

                                delete operation.apikey;

                                return {
                                    callId: call.id,
                                    data: operation.data,
                                    error: operation.error
                                };

                            } catch (error) {
                                return {
                                    callId: call.id,
                                    error: [error.message]
                                };

                            } finally {
                                progress();
                            }
                        })
                    );
                    executionResults.push(...results);
                    payload.agent.executionResults = executionResults;

                    payload.agent = {
                        ...payload.agent,
                        calls: [],
                        results
                    };

                    Object.assign(
                        payload,
                        trustedIdentity,
                        trustedScope
                    );

                    if (executeOnly) {
                        payload.agent.calls = [];
                        break;
                    }

                    await workflow(payload);

                    progress();
                }

                if (payload.error?.length) {
                    payload.agentStatus = 'error';

                } else {
                    Object.assign(
                        payload,
                        trustedIdentity,
                        trustedScope
                    );

                    payload.agent.executionResults = executionResults;
                    payload.agentStatus = 'completed';
                    if (onComplete)
                        await onComplete(payload);
                }

            } catch (error) {
                payload.error ??= [];
                payload.error.push(error.message);
                payload.agentStatus = 'error';

            } finally {
                clearTimeout(timer);
            }

            return payload;
        }

        return Promise.race([run(), timeout]);
    }

    async function execute(payload = {}) {
        if (!Array.isArray(payload.agent?.calls) || !payload.agent.calls.length) {
            payload.error ??= [];
            payload.error.push('Agent execution requires at least one normalized call.');
            payload.agentStatus = 'error';
            return payload;
        }

        return runCycle(payload, undefined, { executeOnly: true });
    }

    return {
        config: agentConfig,
        send,
        workflow,
        execute,
        introspect,
        tools,
        context,
        messages
    };
}

const Agent = { init };

export default Agent;
