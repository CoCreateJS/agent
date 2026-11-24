# CoCreate Agent

**Discover. Build. Evolve.**

A self-evolving agentic distributed runtime.

*Discover what's possible. Build what matters. Evolve agentically.*

## Overview

CoCreate Agent is an AI-agnostic, self-evolving agentic distributed runtime designed to discover, execute, compose, and extend capabilities across a CoCreate application environment.

Rather than relying exclusively on predefined tools and static instructions, CoCreate Agent enables AI to discover existing capabilities, acquire knowledge through execution, create reusable tools, and continuously refine how it operates.

CoCreate Agent separates conversation handling, inference, execution, and persistent intelligence into composable primitives. It manages its agentic lifecycle across CoCreate's distributed runtime and exposes the same processing cycle to communication adapters such as MCP.

Integrated into CoCreate Server, Agent can discover and coordinate capabilities across the distributed application runtime to build, deploy, scale, and manage applications and infrastructure.

The runtime remains fully operational independently of AI. Intelligence is a native capability, not a dependency.

## The Three Pillars

### Discover

Explore possibilities, understand objectives, and discover the resources to bring ideas to life.

- Discover application and server capabilities dynamically.
- Explore existing components, templates, data, APIs, and workflows.
- Retrieve relevant knowledge and reusable tools.
- Introspect the runtime to discover previously unknown capabilities.
- Consult documentation to understand available interfaces.

### Build

Turn ideas into reality. Create applications, automate workflows, and build solutions.

- Execute authorized tools, APIs, and workflows.
- Compose existing primitives into reusable solutions.
- Create and modify applications and experiences.
- Manage data, infrastructure, and deployments.
- Execute independent operations concurrently.
- Extend application capabilities through declarative configurations and custom code.

### Evolve

A self-evolving agent that learns from experience, expands its own capabilities, and continuously improves how it works.

- Create reusable tools from discovered capabilities.
- Preserve knowledge acquired through execution.
- Refine existing tools and procedures.
- Correct outdated or inaccurate knowledge.
- Maintain conversation-specific and model-specific intelligence.
- Compact conversation context to support long-running interactions.
- Reuse acquired intelligence across authorized conversations and AI integrations.

## Core Concepts

- **Agentic execution:** Go beyond conversation to execute authorized tools, APIs, and workflows that accomplish real tasks.

- **Self-evolution:** Create and refine tools, reusable procedures, workflows, and knowledge based on experience and feedback.

- **Composable primitives:** Prefer existing CoCreate capabilities over repeatedly generating custom integration code.

- **Declarative experiences:** Build and modify interfaces through HTML, components, attributes, and data binding; use custom JavaScript when needed.

- **AST-driven workflows:** Compose and orchestrate actions using structured, reusable workflow definitions.

- **Application-native AI:** Discover and reuse the application's existing components, templates, data, and actions rather than inventing a separate UI for each task.

- **User control:** Keep applications, data structures, workflows, deployment choices, and extensibility in the user's hands.

- **AI agnosticism:** Communicate with AI providers through configurable workflows rather than provider-specific runtime implementations.

- **Persistent intelligence:** Preserve acquired knowledge and reusable capabilities independently of individual inference requests and conversations.

- **Dynamic discovery:** Discover runtime capabilities through introspection instead of requiring every operation to be predefined.

- **Independent execution:** Execute authorized operations independently of AI inference, conversation management, or communication protocols.

- **Shared intelligence:** Enable native Agent and communication adapters to access and improve the same authorized knowledge and capabilities.

## Architecture

CoCreate Agent separates the conversation lifecycle, agentic lifecycle, and execution lifecycle into independently accessible primitives.

```text
CoCreate Agent
│
├── Conversation lifecycle
│   ├── Conversation initialization
│   ├── Context resolution
│   └── Message persistence
│
├── Agentic lifecycle
│   ├── Context retrieval
│   ├── Tool discovery
│   ├── AI inference
│   ├── Execution
│   └── Continuation
│
├── Execution lifecycle
│   ├── Request authorization
│   ├── Concurrent execution
│   ├── Response authorization
│   └── Result aggregation
│
└── Persistent intelligence
    ├── Global context and tools
    ├── Model context and tools
    └── Conversation context and tools
```

Each lifecycle builds upon the underlying primitives without requiring those primitives to depend on the higher-level lifecycle.

### Runtime Integration

CoCreate Agent receives a server object containing the capabilities available to the agent.

Within CoCreate Server, CoCreate Cluster provides the foundational server object. CoCreate Server extends that object with application, infrastructure, communication, and data management capabilities.

CoCreate Agent is initialized after the runtime's dependencies have been established.

```text
CoCreate Cluster
        │
        ▼
CoCreate Server
        │
        ├── Config
        ├── CRUD
        ├── Authorize
        ├── AST
        ├── Workflows
        ├── API
        ├── Socket
        ├── Telemetry
        ├── Autoscaler
        └── Additional capabilities
        │
        ▼
CoCreate Agent
```

Agent discovers and operates through the existing runtime rather than duplicating its functionality.

New capabilities introduced into the runtime can become discoverable without requiring changes to the Agent implementation, subject to authorization.

## Installation

```bash
npm install @cocreate/agent
```

## Initialization

```js
import Agent from '@cocreate/agent';

server.agent = await Agent.init(server);
```

Initialization resolves global configuration and establishes the Agent interface on the server object.

The supplied server must expose the compatible configuration, persistence, authorization, workflow, and AST execution capabilities required by the Agent.

## Configuration

CoCreate Agent uses CoCreate Config to resolve its global configuration.

Configuration can be defined locally through `CoCreate.config.js` or dynamically through database-backed server configurations.

```js
export default {
    agent: {
        inactivity: 300000,
        context: [
            'Prefer existing application capabilities.',
            'Create reusable solutions whenever possible.'
        ],
        tools: []
    }
};
```

The resolved configuration is accessible through:

```js
server.agent.config
```

| Property | Type | Description |
|---|---|---|
| `inactivity` | Number | Maximum inactivity period before returning a pending response, expressed in milliseconds. |
| `context` | Array | Global knowledge and instructions available to agents. |
| `tools` | Array | Globally available tool definitions. |

Global configuration provides foundational intelligence while allowing model and conversation intelligence to evolve independently.

## Intelligence Scopes

CoCreate Agent organizes knowledge and capabilities into three scopes.

| Scope | Context | Tools |
|---|---|---|
| Global | Foundational instructions and knowledge | Foundational and application-defined capabilities |
| Model | Persistent, reusable knowledge | Persistent, reusable tools |
| Conversation | Conversation-specific knowledge | Conversation-specific tools |

### Global

Global intelligence is defined through runtime configuration.

It establishes the foundational capabilities and knowledge available to agents operating within the runtime.

Global intelligence is managed through configuration rather than modified directly by an agent.

### Model

Model intelligence contains reusable knowledge and capabilities associated with a CoCreate model configuration.

An agent can acquire knowledge, create tools, and refine existing capabilities within this scope.

Model intelligence can be reused across authorized conversations without requiring the agent to rediscover the same capabilities repeatedly.

Model intelligence does not modify the underlying trained AI model. It extends the persistent knowledge and capabilities available to that model.

### Conversation

Conversation intelligence contains knowledge and capabilities relevant to an individual conversation.

This allows an agent to preserve objectives, decisions, discoveries, and specialized tools without introducing conversation-specific information into reusable model intelligence.

Conversation context can evolve independently of the original message history.

## Tools

Tools describe capabilities that an agent can execute through the runtime.

A tool definition contains descriptive information, an execution path, an authorization method, and a parameter schema.

```js
{
    name: 'readObjects',
    description: 'Retrieve objects from an array.',
    path: 'crud.send',
    method: 'object.read',
    parameters: {
        type: 'object',
        properties: {
            storage: {
                type: 'string'
            },
            database: {
                type: 'string'
            },
            array: {
                type: 'string'
            },
            filter: {
                type: 'object'
            }
        },
        required: [
            'storage',
            'database',
            'array'
        ]
    }
}
```

| Property | Description |
|---|---|
| `name` | Unique tool name within its scope. |
| `description` | Explains the capability and its intended usage. |
| `path` | Dot-notation path to a runtime capability. |
| `method` | Operation identifier used for authorization. |
| `parameters` | JSON Schema describing accepted arguments. |

Tool definitions are declarative and independent of individual AI providers.

Provider-specific representations are handled through configurable workflows or communication adapters.

A tool definition does not grant permission to execute its associated capability. Authorization is evaluated independently during execution.

### Core Tools

CoCreate Agent provides foundational tools that enable discovery and self-evolution.

| Tool | Runtime path | Description |
|---|---|---|
| `introspect` | `agent.introspect` | Discover runtime capabilities. |
| `readTools` | `agent.tools.read` | Retrieve available tools. |
| `upsertTool` | `agent.tools.upsert` | Create or refine a reusable tool. |
| `deleteTool` | `agent.tools.delete` | Remove an outdated or unnecessary tool. |
| `readContext` | `agent.context.read` | Retrieve persistent knowledge. |
| `upsertContext` | `agent.context.upsert` | Preserve or refine knowledge. |
| `deleteContext` | `agent.context.delete` | Remove outdated or unnecessary knowledge. |

These tools establish the foundational mechanisms through which an agent can discover and extend its own capabilities.

Additional application-specific tools can be defined through configuration.

### Dynamic Discovery

An agent does not need to begin with a complete definition of every available runtime capability.

Through introspection, an agent can discover the interfaces exposed by the server object.

```js
await server.agent.introspect({
    path: 'crud'
});
```

Introspection returns interface metadata describing available properties and capabilities rather than exposing arbitrary runtime values.

The agent can consult corresponding documentation, understand an interface, execute an authorized operation, and preserve a reusable tool for future execution.

CoCreate's runtime capabilities are documented in their corresponding repositories within the [CoCreateJS organization](https://github.com/CoCreateJS).

### Self-Evolving Tools

An agent can create or improve reusable tool definitions through the same interfaces available to application developers.

```js
await server.agent.tools.upsert({
    ...identity,
    model_id,
    scope: 'model',
    name: 'readObjects',
    tool: {
        description: 'Retrieve objects from an array.',
        path: 'crud.send',
        method: 'object.read',
        parameters: {
            type: 'object',
            properties: {
                storage: {
                    type: 'string'
                },
                database: {
                    type: 'string'
                },
                array: {
                    type: 'string'
                },
                filter: {
                    type: 'object'
                }
            },
            required: [
                'storage',
                'database',
                'array'
            ]
        }
    }
});
```

The tool becomes part of the model's persistent capabilities and can be retrieved by future authorized agentic interactions.

This creates a continuous discovery and refinement lifecycle.

```text
Discover capability
        │
        ▼
Understand interface
        │
        ▼
Execute operation
        │
        ▼
Evaluate result
        │
        ▼
Preserve or refine tool
        │
        ▼
Reuse capability
```

## Context

Context represents the knowledge available to an agent.

Unlike conversation messages, context is intended to preserve useful knowledge in a reusable and refined form.

Context can include:

- Application architecture and conventions.
- User preferences and requirements.
- Runtime capabilities and usage patterns.
- Previously discovered solutions.
- Decisions and objectives.
- Reusable procedures.
- Conversation summaries.

Knowledge can be stored as individually named context items.

```js
await server.agent.context.upsert({
    ...identity,
    model_id,
    scope: 'model',
    name: 'crud-conventions',
    context: [
        'Use array, object, key, and index terminology.',
        'Use dot notation to reference nested keys.',
        'Prefer existing CRUD capabilities over custom persistence logic.'
    ]
});
```

An agent can subsequently retrieve, refine, or remove this knowledge.

### Context Evolution

Conversation history and persistent context serve different purposes.

Messages preserve the chronological interaction. Context preserves the knowledge necessary to continue operating effectively.

The context lifecycle is designed to support compaction, allowing an agent to consolidate relevant conversation knowledge into a new active context while retaining historical messages and previous contexts.

This provides a foundation for long-running conversations without requiring the entire conversation history to be included in every inference request.

## Agentic Lifecycle

CoCreate Agent can manage the complete lifecycle of an AI interaction.

```text
Receive message
        │
        ▼
Resolve conversation and context
        │
        ▼
Persist incoming message
        │
        ▼
Retrieve context, tools and messages
        │
        ▼
AI inference ◄──────────────────┐
        │                       │
        ▼                       │
    Tool calls?                 │
        │                       │
    Yes ├──► Execute tools ─────┘
        │
     No ▼
Persist final response
        │
        ▼
Return response
```

The agentic lifecycle is divided into three primary functions.

### `send()`

Manages the chat conversation and message lifecycle around the Agent execution cycle.

- Resolves or initializes the conversation.
- Resolves the active context.
- Persists the incoming message.
- Invokes the Agent execution cycle.
- Persists the final response when execution completes.

```js
await server.agent.send({
    ...identity,
    model_id,
    conversation_id,
    agent: {
        message: {
            role: 'user',
            content: 'Discover the available applications.'
        }
    }
});
```

If no conversation identifier is supplied, Agent initializes a new conversation and its initial context.

### `workflow()`

Performs an inference step for the Agent execution cycle.

- Retrieves applicable context.
- Retrieves available tools.
- Retrieves conversation messages.
- Invokes the configured AI workflow.
- Returns the normalized inference result on the shared payload.
- Does not create or persist a conversation message.

```js
await server.agent.workflow(payload);
```

The workflow can load conversation history when a conversation is present. Without a conversation, it uses the available global and model intelligence.

### `execute()`

Runs the Agent cycle independently of chat message and conversation persistence.

- Starts with supplied tool calls, or requests an inference step when no calls were supplied.
- Continues inference and tool execution until no additional calls are returned.
- Authorizes each operation.
- Executes operations through AST.
- Authorizes and filters returned results.
- Aggregates execution results.
- Returns individual operation errors and accumulated execution results.
- Manages inactivity and can return a pending snapshot while processing continues.

```js
await server.agent.execute({
    ...identity,
    model_id,
    conversation_id,
    context_id,
    agent: {
        calls: [
            {
                id: 'call-1',
                path: 'crud.send',
                arguments: {
                    method: 'object.read',
                    storage: 'application',
                    database: 'website',
                    array: 'components'
                }
            }
        ]
    }
});
```

Execution does not create or persist a conversation or message. A caller can supply a conversation when it wants the Agent to include its history.

Native chat calls `send()` to add conversation and message persistence. MCP calls `execute()` to use the same Agent cycle without creating chat messages.

## AI-Agnostic Workflows

CoCreate Agent does not directly implement provider-specific AI communication.

Instead, it delegates inference to CoCreate Workflow.

```js
await server.workflow.run({
    method: 'workflow.agent',
    organization_id: payload.organization_id,
    host: payload.host,
    agent: [payload]
});
```

The workflow is responsible for:

- Resolving the configured AI provider and model.
- Mapping normalized context, tools, and messages.
- Constructing provider-specific requests.
- Communicating through configured APIs and endpoints.
- Normalizing provider responses.
- Preserving provider-specific continuation state when necessary.

```text
CoCreate Agent
        │
        ▼
CoCreate Workflow
        │
        ▼
AST transformations
        │
        ▼
CoCreate API / Endpoints
        │
        ▼
AI provider
        │
        ▼
Normalized response
```

AI providers, models, request structures, and response mappings can evolve independently of the Agent runtime.

The same Agent implementation can operate with hosted AI providers, locally hosted models, and other compatible inference services.

## Normalized Agent Payload

CoCreate Agent operates on a unified payload shared across its lifecycle primitives.

The payload carries conversation identifiers, execution state, context, tools, messages, and results.

### Incoming Message

```js
{
    organization_id,
    host,
    user_id,
    model_id,
    conversation_id,
    agent: {
        message: {
            role: 'user',
            content: 'Build a reusable navigation component.'
        }
    }
}
```

### Inference Request

```js
{
    agent: {
        context: [],
        tools: [],
        messages: []
    }
}
```

### Inference Response

```js
{
    agent: {
        message: {
            role: 'assistant',
            content: 'I will retrieve the existing components.'
        },
        calls: [
            {
                id: 'call-1',
                path: 'crud.send',
                arguments: {
                    method: 'object.read',
                    storage: 'application',
                    database: 'website',
                    array: 'components'
                }
            }
        ],
        state: {}
    }
}
```

### Execution Results

```js
{
    agent: {
        results: [
            {
                callId: 'call-1',
                data: [],
                error: []
            }
        ],
        state: {}
    }
}
```

### Final Response

```js
{
    model_id,
    conversation_id,
    context_id,
    agentStatus: 'completed',
    agent: {
        message: {
            role: 'assistant',
            content: 'The navigation component has been created.'
        }
    }
}
```

These examples illustrate the normalized Agent structures. Individual workflows and adapters are responsible for translating between these structures and their external protocols.

## Concurrent Execution

An AI response can contain multiple independent tool calls.

CoCreate Agent executes these calls concurrently and aggregates their results before returning control to the agentic workflow or external caller.

```text
Execution batch
      │
      ├── Tool A ──► Result A
      ├── Tool B ──► Result B
      └── Tool C ──► Result C
      │
      ▼
Aggregated results
```

Each operation is authorized independently.

An individual operation failure does not necessarily terminate the entire execution batch. Its error is returned alongside the other results, allowing the reasoning agent to evaluate the failure and determine an appropriate continuation.

Operations that depend on previous results should be executed in subsequent batches or composed through an appropriate workflow.

## Inactivity Management

CoCreate Agent distinguishes inactivity from total execution duration.

The default inactivity period is five minutes.

```js
{
    agent: {
        inactivity: 300000
    }
}
```

The inactivity timer is refreshed as meaningful agentic progress occurs, such as receiving an inference response or completing a tool execution.

An agentic workflow can therefore continue beyond five minutes while it remains active.

If the inactivity threshold is reached, the initiating request can receive a pending response.

```js
{
    model_id,
    conversation_id,
    context_id,
    agentStatus: 'pending'
}
```

A pending response does not imply that execution has been cancelled.

The execution lifecycle can continue independently of the initiating request. Subsequent response delivery requires an appropriate communication or continuation mechanism.

## MCP Integration

CoCreate MCP is a protocol adapter to CoCreate Agent. MCP authenticates the connection, translates MCP requests, and delegates tool discovery and execution to Agent. Agent owns configured inference, tool processing, authorization, execution, and continuation.

```text
Chat transport                 MCP transport
     │                              │
     ▼                              ▼
agent.send()                  agent.execute()
     │                              │
     └─────────────┬────────────────┘
                   ▼
       Shared Agent processing cycle
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
   Inference               Tool execution
        │                     │
        └──────────┬──────────┘
                   ▼
            CoCreate Server
```

The chat path adds conversation and message persistence. The MCP path does not create a chat conversation or message; both paths use Agent's configured tools, context, inference, authorization, execution, and continuation.

### MCP Operations

| MCP operation | CoCreate Agent integration |
|---|---|
| `initialize` | Runtime instructions and connection capabilities |
| `tools/list` | Agent tool definitions from configuration and persistence |
| `tools/call` | `agent.execute()` |
| `resources/list` | Discover accessible knowledge resources |
| `resources/read` | Retrieve applicable context |
| `prompts/list` | Discover reusable prompts |
| `prompts/get` | Retrieve configured prompts |

CoCreate MCP translates protocol requests and passes the authenticated identity to Agent. MCP does not maintain a parallel tool registry or operation authorization path.

### Shared Evolution

MCP clients can invoke the foundational Agent tools to create reusable capabilities and preserve acquired knowledge. The resulting intelligence remains in the CoCreate environment and is available to other authorized entry points.

This allows intelligence acquired through one authorized integration to become available to another.

The persistent intelligence belongs to the CoCreate environment rather than being exclusively associated with an individual AI provider or conversation interface.

## Authorization

CoCreate Agent operates through CoCreate Authorize.

Every executable operation must be authorized according to the authenticated identity, organization, host, operation, and applicable resource permissions.

```text
Tool invocation
        │
        ▼
Authorize request
        │
        ▼
Execute through AST
        │
        ▼
Authorize and filter response
        │
        ▼
Return result
```

Authorization must govern the actual runtime capability being executed, not merely an operation identifier supplied by an AI.

Identity and intelligence scopes must be established by trusted runtime or communication layers.

Agents cannot grant themselves additional permissions by creating tools, modifying context, or discovering runtime capabilities.

Introspection, tool discovery, persistent intelligence, and returned execution results are also subject to applicable access controls.

The ability to discover or describe a capability does not imply permission to execute it.

## Persistence

CoCreate Agent uses CoCreate CRUD to persist intelligence and conversation history.

The Agent does not implement its own database engine or maintain a separate intelligence cache.

Persistence is organized into a dedicated storage namespace.

```text
Storage: agent
│
├── Database: models
│   ├── context
│   └── tools
│
└── Database: conversations
    ├── context
    ├── tools
    └── messages
```

### Models

Contains reusable intelligence associated with model configurations.

- `context` — Named knowledge items.
- `tools` — Reusable tool definitions.

### Conversations

Contains intelligence and messages associated with individual conversations.

- `context` — Active and historical contexts, including conversation-specific knowledge items.
- `tools` — Conversation-specific tool definitions.
- `messages` — Persisted conversation messages.

A conversation is initialized through its initial context object rather than requiring a separate conversation array.

### Identifiers

| Identifier | Description |
|---|---|
| `model_id` | Associated model configuration. |
| `conversation_id` | Unique conversation identifier. |
| `context_id` | Active conversation context identifier. |
| `_id` | Identifier of an individual persisted object. |

Conversation identifiers are generated when needed before persistence.

Persisted object identifiers are generated through CRUD using the runtime's identifier conventions.

Messages are retrieved chronologically using ordered identifiers where supported by the configured persistence implementation.

### Storage Independence

By operating through CoCreate CRUD, Agent remains independent of the underlying database implementation.

The configured storage infrastructure determines where and how intelligence is persisted.

This allows Agent to leverage the same persistence, distribution, and replication capabilities available to the application runtime.

## API Reference

### Public Interface

```text
server.agent
│
├── config
│   ├── inactivity
│   ├── context
│   └── tools
│
├── send()
├── workflow()
├── execute()
├── introspect()
│
├── tools
│   ├── read()
│   ├── upsert()
│   └── delete()
│
├── context
│   ├── read()
│   ├── upsert()
│   └── delete()
│
└── messages
    ├── read()
    └── create()
```

### Initialization

| Function | Description |
|---|---|
| `init(server)` | Initialize Agent and resolve its configuration. |

### Lifecycle

| Function | Description |
|---|---|
| `send(payload)` | Manage the conversation and message lifecycle. |
| `workflow(payload)` | Perform one configured inference step using available context, tools, and messages. |
| `execute(payload)` | Run the inference and authorized tool execution cycle without creating or persisting chat messages. |
| `introspect(payload)` | Discover runtime interface metadata. |

### Tools

| Function | Description |
|---|---|
| `tools.read(payload)` | Retrieve tools from applicable intelligence scopes. |
| `tools.upsert(payload)` | Create or refine a named tool. |
| `tools.delete(payload)` | Remove a named tool. |

### Context

| Function | Description |
|---|---|
| `context.read(payload)` | Retrieve knowledge from applicable intelligence scopes. |
| `context.upsert(payload)` | Create or refine a named knowledge item. |
| `context.delete(payload)` | Remove a named knowledge item. |

### Messages

| Function | Description |
|---|---|
| `messages.read(payload)` | Retrieve messages associated with the active context. |
| `messages.create(payload)` | Persist a normalized conversation message. |

### Common Parameters

| Parameter | Description |
|---|---|
| `organization_id` | Trusted organization identifier. |
| `host` | Trusted application or host identifier. |
| `user_id` | Authenticated user identifier. |
| `model_id` | Associated model configuration. |
| `conversation_id` | Associated conversation. |
| `context_id` | Active conversation context. |
| `scope` | Global, model, or conversation intelligence scope. |
| `name` | Named tool or knowledge item. |
| `agent` | Normalized agentic payload. |

Identity and scope parameters must be established or validated by trusted runtime layers before use.

### Payload Mutation

Agent lifecycle functions operate on a shared payload.

Rather than repeatedly constructing unrelated request and response structures, each primitive enriches or updates the payload as it progresses through the lifecycle.

```js
await server.agent.execute(payload);

console.log(payload.agent.results);
```

This allows Agent to compose naturally with CoCreate Workflow, AST, CRUD, API, and other runtime capabilities.

An inactivity response may return a separate pending snapshot while the original execution continues.

## Design Principles

### Discover rather than duplicate

Existing application capabilities should be discovered and reused before introducing new implementations.

### Compose rather than rebuild

Complex operations should be composed from reusable primitives, tools, and workflows.

### Preserve rather than rediscover

Useful knowledge and capabilities should be persisted so they can be reused across authorized interactions.

### Refine rather than accumulate

Intelligence should be continuously evaluated, corrected, consolidated, and improved rather than growing indefinitely without structure.

### Authorize rather than assume

Every operation must respect the permissions of the authenticated identity.

### Separate rather than couple

AI inference, execution, persistence, and communication should remain independently accessible.

### Configure rather than hardcode

Provider integrations, global intelligence, tools, and workflows should evolve through configuration without unnecessary changes to the runtime.

## Use Cases

CoCreate Agent is designed to support a broad range of agentic applications, including:

- Application development and modification.
- Declarative interface generation.
- Workflow creation and automation.
- Database management.
- Infrastructure provisioning.
- Application deployment.
- Distributed runtime management.
- Operational diagnostics.
- Reusable knowledge management.
- External AI integration through MCP.
- Autonomous and assisted task execution.

The available capabilities are determined by the runtime, its configuration, and the permissions of the authenticated identity.

## CoCreate Ecosystem

CoCreate Agent is designed to compose with the broader CoCreate ecosystem.

| Project | Responsibility |
|---|---|
| [CoCreate Server](https://github.com/CoCreateJS/server) | Distributed application runtime |
| [CoCreate Client](https://github.com/CoCreateJS/client) | Declarative application experiences |
| [CoCreate Cluster](https://github.com/CoCreateJS/cluster) | Process and server lifecycle |
| [CoCreateDB](https://github.com/CoCreateJS/db) | Storage-agnostic database engine |
| [CoCreate CRUD](https://github.com/CoCreateJS/crud) | Unified data operations |
| [CoCreate Evaluate](https://github.com/CoCreateJS/evaluate) | Structured operation execution |
| [CoCreate Workflow](https://github.com/CoCreateJS/workflow) | Declarative orchestration |
| [CoCreate API](https://github.com/CoCreateJS/api) | Configurable API communication |
| [CoCreate Authorize](https://github.com/CoCreateJS/authorize) | Operation authorization |
| [CoCreate Config](https://github.com/CoCreateJS/config) | Runtime configuration |
| [CoCreate MCP](https://github.com/CoCreateJS/mcp) | External AI interoperability |
| [CoCreate Telemetry](https://github.com/CoCreateJS/telemetry) | Runtime observability |
| [CoCreate Autoscaler](https://github.com/CoCreateJS/autoscaler) | Infrastructure scaling |

Each project provides independently reusable capabilities that Agent can discover, compose, and execute.

## Implementation Status

CoCreate Agent is evolving toward the architecture described in this document.

The conversation, inference, execution, and persistent intelligence interfaces define the intended public architecture.

Context compaction, intermediate execution history, background response delivery, and comprehensive execution authorization are areas of continued implementation and integration.

## Positioning

CoCreate Agent helps people **discover what is possible, build the experiences and systems they envision, and evolve the tools used to create them**. It is intended to work with CoCreate's reusable client, server, database, and workflow primitives while remaining extensible through tools and APIs.

**Guiding idea:** Focus on the experience and outcome—not on rebuilding the infrastructure and glue code underneath them.

---

**Discover. Build. Evolve.**

*Discover what's possible. Build what matters. Evolve agentically.*

