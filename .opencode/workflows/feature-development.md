---
name: feature-development
description: End-to-end feature development pipeline from requirements gathering to documentation sync
agents:
  - technical-business-analyst
  - technical-lead
  - software-developer
  - quality-analyst
---

# Feature Development Workflow

Full lifecycle: **Concept → Ticket → Plan → Code → Verify → Document**

---

## Step 1: Create Ticket

**Agent:** `technical-lead` (triage) → delegates to `technical-business-analyst` (story/bug) or handles directly (task)
**Command:** `/create-ticket`

Run `/create-ticket` with the feature description to gather requirements, investigate the codebase, ask clarifying questions, and create a professional issue in the SCRUM Jira project.

**Output:** Jira issue key (e.g., `SCRUM-42`).

---

## Step 2: Create Development Plan

**Agent:** `technical-lead`
**Command:** `/create-development-plan`
**Input:** Jira issue key from Step 1

Run `/create-development-plan SCRUM-NNN` with the issue key. The command reads the ticket, breaks it into step-by-step implementation phases with test strategy, component design, and sequencing, and posts the plan as a comment on the Jira issue.

**Output:** Jira issue key with plan comment posted.

---

## Step 3: Implement

**Agent:** `software-developer`
**Command:** `/implement-ticket`
**Input:** Plan from Step 2

Run `/implement-ticket SCRUM-NNN` with the issue key. The command reads the development plan from Jira comments and executes it precisely using TDD (Red → Green → Refactor) for each phase.

**Output:** Confirmation of implemented changes and any issues encountered.

---

## Step 4: Verify

**Agent:** `quality-analyst`
**Command:** `/verify-changes`
**Input:** Jira issue key (with plan comment from Step 2), code from Step 3

Run `/verify-changes SCRUM-NNN` with the issue key. The command reviews the implementation against the original ticket, checking coverage, quality, and completeness, and provides a structured report with final verdict.

**Feedback loop:**
- If follow-up story/bug tickets are needed → go back to **Step 2** (create a new plan)
- If the plan needs revision → go back to **Step 3** (re-implement)
- If approved → proceed to **Step 5**

---

## Step 5: Sync Documentation

**Agent:** `technical-lead`
**Command:** `/sync-project`

Run `/sync-project` to update all project documents (README.md, component docs) to reflect the new changes.

---

## Continue Mode

Resume an existing ticket from wherever it left off:

```
opencode run "Run the feature-development workflow: continue SCRUM-42"
```

The workflow inspects the ticket state (Jira board column and existing comments) to determine which step to resume:

- **No plan comment** → Step 2 (Create Development Plan)
- **Plan exists, not in review column** → Step 3 (Implement)
- **In review column, no verification comment** → Step 4 (Verify)
- **Verification passed** → Step 5 (Sync Documentation)
- **In Done column** → Workflow finishes with no action

---

## Fresh Start Usage

Run this workflow by invoking each step sequentially:

```
opencode run "Run the feature-development workflow: <feature description>"
```

The agents will follow the pipeline above, handling handoffs and feedback loops automatically.
