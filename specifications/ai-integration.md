# AI and API integration

Native inference delegates to the single `agent` middleware workflow through `server.workflow.run({method:'workflow.agent',organization_id:payload.organization_id,host:payload.host,agent:[payload]})`. The seed at `app/src/apps/workflows/config/agent.js` normalizes context, tools, messages, calls, results, and continuation state, and provides the point where provider/model adaptation is configured. Provider continuation state must preserve call/result correlation. Do not expose internal credentials or intermediate envelopes to clients through workflow side effects.

Third-party API integrations can either submit messages to send (native inference) or supply normalized calls to execute (external inference). The API adapter authenticates, resolves trusted scopes and translates requests/responses. No specific public HTTP route is mandated by Agent.
