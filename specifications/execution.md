# Independent execution

`execute(payload)` accepts normalized `agent.calls`, executes one batch, and returns the same payload with `agent.results`. It must not invoke inference, create conversations or persist messages. Independent calls may run concurrently via Promise.all; dependent operations belong in later batches or workflows. Each result retains its call ID. Errors are per-call unless the batch itself is invalid.

For each call: resolve trusted identity and applicable scope; bind the actual AST target to the authorized operation; authorize request; execute via server.ast; authorize and filter response; return safe data or error. Do not rely on a tool registry lookup as a substitute for target authorization. Clear consumed calls before continuation. No automatic retry of uncertain side effects. Progress reporting to the native workflow must not require inference in execute.
