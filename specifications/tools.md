# Tools

A tool is a named declarative capability: `name`, `description`, `path`, `method`, `parameters` (JSON Schema). Core tools: introspect, readTools, upsertTool, deleteTool, readContext, upsertContext, deleteContext. Configured tools extend the foundation.

```js
{ name:'readObjects', description:'Read objects', path:'crud.send', method:'object.read', parameters:{type:'object',properties:{array:{type:'string'}},required:['array']} }
```
`tools.read` combines available scopes; explicit scope requests require valid scope. Global/core definitions take precedence over conflicting learned definitions; conversation definitions may override model definitions. Upsert and delete use trusted scope and name; global mutation is not available to agents. CRUD generates object IDs. Atomic uniqueness per scope/name is required. Adapters normalize method metadata into calls and validate arguments. Introspection returns permitted names/types, not arbitrary values or getters. Tool creation does not require a registry lookup or prove the capability exists; execution must enforce authorization.
