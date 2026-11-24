# Agentic lifecycle

`send` resolves or creates the conversation and active context, persists the incoming message, and invokes `workflow`. `workflow` refreshes applicable intelligence and messages, invokes inference, executes calls and repeats until no calls remain or a terminal error occurs. Final response persistence must happen exactly once in the completion path, including after a pending response.

The inactivity timer belongs to workflow, starts before initial inference and resets on meaningful progress including individual tool completions. At threshold return a separate pending snapshot; do not cancel the original work implicitly. Clear timers on completion. Background delivery and durable restart recovery are separate integration requirements. External hosts own their own inference and message lifecycle. Intermediate assistant calls and tool results must be retained in provider continuation state or persisted history for correct multi-turn inference.
