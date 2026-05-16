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

**Agent:** `technical-business-analyst`
**Skill:** `create-story-ticket` / `create-bug-ticket`

Gather requirements from the user for a new feature or bug fix. Investigate the codebase, ask clarifying questions, and create a professional issue in the SCRUM Jira project.

**Output:** Jira issue key (e.g., `SCRUM-42`).

---

## Step 2: Create Development Plan

**Agent:** `technical-lead`
**Skill:** `create-development-plan`
**Input:** Jira issue key from Step 1

Read the ticket from Jira. Break it into step-by-step implementation phases with test strategy, component design, and sequencing. Post the plan as a comment on the Jira issue.

**Output:** Jira issue key with plan comment posted.

---

## Step 3: Implement

**Agent:** `software-developer`
**Skill:** `implement-ticket`
**Input:** Plan from Step 2

Execute the development plan precisely. Follow TDD (Red → Green → Refactor) for each phase. Do not deviate from the plan.

**Output:** Confirmation of implemented changes and any issues encountered.

---

## Step 4: Verify

**Agent:** `quality-analyst`
**Skill:** `verify-changes`
**Input:** Jira issue key (with plan comment from Step 2), code from Step 3

Review the implementation against the original ticket. Check coverage, quality, and completeness. Provide a structured report with final verdict.

**Feedback loop:**
- If follow-up story/bug tickets are needed → go back to **Step 2** (create a new plan)
- If the plan needs revision → go back to **Step 3** (re-implement)
- If approved → proceed to **Step 5**

---

## Step 5: Sync Documentation

**Agent:** `technical-lead`
**Skill:** `sync-project`

Update all project documents (README.md, component docs) to reflect the new changes.

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
