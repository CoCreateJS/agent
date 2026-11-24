# MCP integration

MCP is a protocol adapter, not a second agentic engine. It may use Streamable HTTP or another supported transport; Agent does not require a dedicated MCP port. Agent owns configured inference, parallelism, continuation, tool processing, and authorization across the distributed runtime. MCP authenticates the connection, invokes the `mcp` workflow to normalize a provider tool-call envelope, and delegates the resulting `agent.calls` payload to Agent; it does not create chat conversations or persist chat messages for tool calls. Internal workflow execution returns its result to MCP without sending a socket response.

| MCP operation | Integration |
|---|---|
| initialize | Capabilities and optional instructions |
| tools/list | Authorized agent.tools.read |
| tools/call | Normalize the MCP call envelope, then invoke agent.execute |
| resources/list, resources/read | Optional authorized context exposure |
| prompts/list, prompts/get | Optional configured prompts |

Resolve model_id from trusted MCP configuration and authenticated identity. No conversation_id/context_id is needed for model-only operation. If conversation scope is explicitly supported, establish it independently; do not assume MCP session IDs are Agent conversation IDs. MCP normalizes provider or protocol inputs into `agent.calls`; Agent execution runs the requested tools and returns results without starting an inference continuation or creating chat messages. Model tools/context can evolve through authorized core tools. Global context is read-only through Agent. Agent decides how available context is used by its configured inference workflow. Notify supporting clients of changed tool lists where appropriate. Translate per-call errors to protocol results without leaking secrets. MCP-specific discovery/dispatch must not bypass Agent execution authorization.
