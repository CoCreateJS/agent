# Authorization

Authentication occurs at trusted entry points. Bind identity and tenant/model/conversation scopes independently of model arguments. Every call must authorize the actual AST target and operation/resource scope before execution. Reauthorize and filter results before returning them. A second request authorization alone does not necessarily sanitize returned rows. Prevent prototype traversal, arbitrary function invocation and disclosure of sensitive metadata.

Tool definitions and learned context are untrusted data, not permission grants. Restrict writes to authorized model/conversation scopes; global config is managed separately. Apply least privilege to discovery, context retrieval and mutations. Protect against prompt injection and cross-tenant intelligence poisoning. Validate schemas, sanitize errors, and avoid credentials in inference. Audit operations separately from conversation messages. These are release requirements, not claims of completed enforcement.
