# Configuration

Resolve defaults, local `config.get('agent')`, then database-backed `config.query({type:'agent', organization_id:server.organization_id, server:server.host, cluster:server.cluster_id}, server.crud)`. Merge using CoCreate Utils dot-notation semantics. Preserve foundational tools and instructions. Expose the resolved object as `server.agent.config`. Default inactivity is 300000 ms; context is an array of strings; tools is an array of definitions. Global mutation is configuration-managed.

Database configuration example:
```js
{ type: 'agent', enabled: true, config: { inactivity: 300000, context: [], tools: [] } }
```
MCP model association belongs to trusted adapter configuration, not AI arguments. Global tool and context defaults are seeded as CoCreate Config records of type `agent`; `app/src/apps/configs/config/ai/tools.js` and `contexts.js` provide the shared platform seeds. Agent loads those records through `config.query()` and merges them with its built-in fallback definitions. Provider and cycle adaptation belongs to the single `workflow.agent` middleware seeded in `app/src/apps/workflows/config/agent.js`.
