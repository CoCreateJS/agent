# Architecture

Agent is an independent ESM module (`@cocreate/agent`) initialized by CoCreate Server, not Cluster. Its default export is the `Agent` object from `src/index.js`; consumers import it as `Agent` and call `Agent.init(server)`. Cluster provides the server object; Server composes distributed capabilities; Agent is initialized after its dependencies. The returned interface exposes config, send, workflow, execute, introspect, tools, context and messages. Dynamic introspection can discover later additions subject to authorization. No provider-specific SDK is required in Agent.

Dependency direction: send → workflow → execute → authorized AST capabilities. MCP and direct API adapters enter at discovery or execute; neither requires send. No protocol-specific flag is needed.
