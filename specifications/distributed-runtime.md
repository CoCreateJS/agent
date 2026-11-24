# Distributed runtime

CoCreate Agent leverages the distributed capabilities of CoCreate Server, Cluster, CRUD and configured storage. It does not implement its own mesh, replication, scheduler or consensus protocol. Execution may invoke local or remote runtime capabilities; intelligence can be shared across instances with compatible storage.

Distributed correctness requirements: tenant isolation, scoped atomic upserts, consistent active-context selection, defined read visibility, conflict handling for concurrent tool/context edits, and bounded concurrency/backpressure. Native conversations need coordination when concurrent requests target the same context. Network partitions and node loss may leave uncertain effects; use operation-specific idempotency and reconciliation where supported. Pending responses are not durable job handles. No exactly-once, strong consistency or automatic failover guarantee is implied.

Validate cross-node discovery, shared model evolution, isolated profiles, concurrent writes, authorization, partial failures and restart behavior before production deployment.
