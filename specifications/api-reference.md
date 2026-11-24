# API reference

All functions below except init accept a payload and return the mutated payload asynchronously; pending workflow/send may return a separate snapshot.

| Function | Required operation-specific input | Output |
|---|---|---|
| init(server) | Compatible server | Agent interface |
| send | model_id, agent.message; optional conversation_id | Final or pending response |
| workflow | Initialized native conversation and context | Final or pending response |
| execute | agent.calls; applicable trusted scope | agent.results |
| introspect | Optional path | data: interface metadata |
| tools.read | Optional scope | agent.tools, data |
| tools.upsert | scope, name, tool | data |
| tools.delete | scope, name | data |
| context.read | Optional scope | agent.context, data |
| context.upsert | scope, name, context array | data |
| context.delete | scope, name | data |
| messages.read | Valid active conversation scope | agent.messages |
| messages.create | Valid active scope, agent.message | Persisted message |

All operations require appropriate trusted identity and authorization. Model/conversation writes require their respective scopes. Combined reads omit unavailable scopes; explicit unavailable scope requests fail. `config` exposes resolved configuration.
