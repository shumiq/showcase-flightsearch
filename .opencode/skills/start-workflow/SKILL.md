---
name: start-workflow
description: Starts a workflow from .opencode/workflows. If no workflow is specified, prompts the user to choose one.
---

# Start Workflow Skill

## Description

Reads available workflow files from `.opencode/workflows/` and either starts the specified workflow or prompts the user to choose one. Each workflow defines a multi-agent pipeline with specific steps, agents, and skills.

Use this skill when the user says things like: "start workflow", "run the workflow", "start the feature development workflow", "kick off the pipeline", "begin the process".

## Delegation

Delegate execution to the specialist subagent before playing the skill:

1. Use `Task` tool with `subagent_type: "technical-business-analyst"` to execute the **full workflow** (Steps 1–5).
2. Pass the user's input and the path to `.opencode/workflows/` in the `prompt`.
3. After subagent completes, present the workflow summary to the user.

## Workflow

### Step 1: Identify the Workflow

If the user has already specified a workflow name (e.g., "feature-development"), match it against the available workflows and proceed to Step 3. If no workflow is specified, proceed to Step 2.

### Step 2: List Available Workflows

Read all `*.md` files from `.opencode/workflows/`. Present the available workflows to the user with their descriptions and ask which one to start.

Example output:

```
Available workflows:
1. feature-development — End-to-end feature development pipeline from requirements gathering to documentation sync
```

Ask the user: "Which workflow would you like to start?"

### Step 3: Read the Workflow File

Read the chosen workflow file from `.opencode/workflows/{workflow-name}.md` to understand:
- The `name` and `description` from frontmatter
- The `agents` list
- Each step's agent and skill
- The overall pipeline flow

### Step 4: Execute the Workflow

Execute the workflow step by step:

1. **Follow the workflow's defined steps sequentially.**
2. For each step, invoke the specified agent with the specified skill.
3. Pass outputs from previous steps as inputs to subsequent steps (as defined in the workflow).
4. Handle any feedback loops or decision points documented in the workflow.
5. Report progress to the user after each step.

### Step 5: Report Completion

When the workflow finishes, report to the user:

```
Workflow "{workflow-name}" completed.

Steps executed:
1. {Step 1 name} — ✅
2. {Step 2 name} — ✅
...
N. {Step N name} — ✅

Outputs:
- {Key output from each step}
```

## Best Practices & Rules

- **Always check `.opencode/workflows/`** — do not assume which workflows exist.
- **Ask before starting** — if the user didn't specify a workflow, always present the options and let them choose.
- **Follow the workflow exactly** — do not skip steps, deviate from the defined pipeline, or reorder phases.
- **Report progress** — after each step completes, briefly inform the user of what was accomplished.
- **Handle feedback loops** — if a workflow defines conditional branches or feedback loops (e.g., "if follow-up needed, go back to Step 2"), follow them precisely.
- **Prompt logging** — remember to log prompts per AGENTS.md instructions.
