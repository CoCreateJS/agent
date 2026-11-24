# Context

Global context is configuration-managed. Model context is reusable named knowledge associated with a trusted model profile. Conversation context is tied to an active context and valid conversation scope. Combined reads include only available authorized scopes; MCP can read global/model without a conversation.

```js
await server.agent.context.upsert({...identity,model_id,scope:'model',name:'conventions',context:['Reuse existing capabilities.']});
```
Read returns inference-ready knowledge; management interfaces should also preserve names for refinement and deletion. Conversation retrieval includes the active root and its named items. Compaction is a planned operation: consolidate knowledge, create a new active context, retain historical contexts/messages, and atomically switch the active pointer. Coordinate concurrent writers and in-flight executions. Global context cannot be changed through agent upsert/delete.
