# Normalized payload

Trusted envelope: organization_id, host, user_id, optional internal credentials, model_id, optional conversation_id/context_id. Credentials never enter inference or returned tool data. Lifecycle primitives mutate the original payload except pending snapshots.

```js
{agent:{message:{role:'user',content:'Discover capabilities.'}}}
{agent:{context:[],tools:[],messages:[]}}
{agent:{calls:[{id:'call-1',path:'crud.send',arguments:{method:'object.read'}}],state:{}}}
{agent:{results:[{callId:'call-1',data:[],error:[]}],state:{}}}
{agentStatus:'completed',agent:{message:{role:'assistant',content:'Complete.'}}}
```
These are JavaScript shape examples, not one combined program. State is opaque provider continuation data. Pending snapshot contains trusted scope and agentStatus:'pending'. Terminal errors use envelope error; tool failures use per-call errors. Model-generated arguments cannot override trusted identity or profile scope.
