---
name: manage-github-project
description: Creates, updates, moves, archives, deletes, and bi-directionally syncs items in the GitHub Projects board (https://github.com/users/santiphap-tw/projects/1) with local ./bugs/ and ./stories/ tickets using the gh CLI. Supports draft issues, existing issues/PRs, status changes, archiving, deletion, and two-way sync.
---

# Manage Github Project Skill

## Description

This skill manages items in the GitHub Projects board at `https://github.com/users/santiphap-tw/projects/1` using the `gh` CLI and GraphQL API. It can create draft issues, add existing issues/PRs, update item fields (like Status), archive/unarchive items, and delete items.

Use this skill when the user says things like: "Add this to the project", "Create a task in the project", "Move this to In Progress", "Archive this item", "Update the status", "Remove this from the board", "Sync tickets with project", "Bi-directional sync", "Sync local tickets", etc.

## Project Configuration

| Property | Value |
|----------|-------|
| **Project Number** | `1` |
| **Owner** | `santiphap-tw` |
| **Owner Flag** | `--owner "@me"` (equivalent to `santiphap-tw`) |
| **Project Node ID** | `PVT_kwHOA5K1Vc4BXH-b` |
| **Status Field ID** | `PVTSSF_lAHOA5K1Vc4BXH-bzhSXD2s` |
| **Status Options** | `f75ad846` = Todo, `47fc9ee4` = In Progress, `98236657` = Done |

All commands use `--owner "@me"` since the project belongs to the authenticated user `santiphap-tw`.

## Workflow

### Step 1: Identify the Operation

When the user makes a request, determine which operation they need:

| Trigger Phrases | Operation |
|---|---|
| "create", "add task", "new item", "draft issue" | **Create Draft Issue** |
| "add this issue", "add PR", "add to project", "track this" | **Add Existing Issue/PR** |
| "move", "update status", "change to", "set status" | **Update Item Field (Status)** |
| "archive", "hide" | **Archive Item** |
| "unarchive", "restore" | **Unarchive Item** |
| "delete", "remove" | **Delete Item** |
| "list", "show", "what's on", "view items" | **List Items** |
| "sync", "bi-directional", "two-way sync", "sync tickets" | **Sync Local Tickets with Project Board** |

### Step 2: Collect Required Information

Ask the user clarifying questions to get the data you need. Do not ask every question up front — ask only what is needed for the specific operation.

#### For Create Draft Issue
- **Title** (required): What should the item be called?
- **Body** (optional): Any description or details?
- **Status** (optional): Should it start in a specific column? Options: Todo, In Progress, Done.

#### For Add Existing Issue/PR
- **URL** (required): The URL of the GitHub issue or pull request.

#### For Update Item Field
- **Item ID**: The ID of the item to update. If the user doesn't know it, use `gh project item-list` to find it.
- **Field to update**: Typically "Status". For Status, you need the option ID (`f75ad846` for Todo, `47fc9ee4` for In Progress, `98236657` for Done).
- **New value**: What to set it to.

#### For Archive/Unarchive
- **Item ID**: Which item to archive/unarchive.
- Search strategy: Use `gh project item-list 1 --owner "@me" --format json` to find the item by title if the user doesn't have the ID.

#### For Delete Item
- **Item ID**: Which item to delete.
- **Confirmation**: Always ask for confirmation before deleting.

### Step 3: Execute the Operation

Run the appropriate command. Always use `--owner "@me"` for this project.

#### Create Draft Issue

```bash
gh project item-create 1 --owner "@me" --title "Item Title" --body "Item description"
```

If you need to set the Status immediately after creation, capture the item ID from the JSON output and run an edit:

```bash
# First create, capture item ID
gh project item-create 1 --owner "@me" --title "Item Title" --body "Item body" --format json

# Then set Status (using the item ID from the response)
gh project item-edit --project-id "PVT_kwHOA5K1Vc4BXH-b" --id <item-id> --field-id "PVTSSF_lAHOA5K1Vc4BXH-bzhSXD2s" --single-select-option-id "f75ad846"
```

#### Add Existing Issue/PR

```bash
gh project item-add 1 --owner "@me" --url https://github.com/owner/repo/issues/123
```

#### Update Item Status (Move)

```bash
# Move to Todo
gh project item-edit --project-id "PVT_kwHOA5K1Vc4BXH-b" --id <item-id> --field-id "PVTSSF_lAHOA5K1Vc4BXH-bzhSXD2s" --single-select-option-id "f75ad846"

# Move to In Progress
gh project item-edit --project-id "PVT_kwHOA5K1Vc4BXH-b" --id <item-id> --field-id "PVTSSF_lAHOA5K1Vc4BXH-bzhSXD2s" --single-select-option-id "47fc9ee4"

# Move to Done
gh project item-edit --project-id "PVT_kwHOA5K1Vc4BXH-b" --id <item-id> --field-id "PVTSSF_lAHOA5K1Vc4BXH-bzhSXD2s" --single-select-option-id "98236657"
```

#### Update Other Fields

```bash
# Update text field
gh project item-edit --project-id "PVT_kwHOA5K1Vc4BXH-b" --id <item-id> --field-id <field-id> --text "new value"

# Update draft issue title
gh project item-edit --id <item-id> --title "New Title"

# Update draft issue body
gh project item-edit --id <item-id> --body "New body content"

# Clear a field value
gh project item-edit --project-id "PVT_kwHOA5K1Vc4BXH-b" --id <item-id> --field-id <field-id> --clear
```

#### Archive Item

```bash
gh project item-archive 1 --owner "@me" --id <item-id>
```

#### Unarchive Item

```bash
gh project item-archive 1 --owner "@me" --id <item-id> --undo
```

#### Delete Item

Always confirm with the user before deleting.

```bash
gh project item-delete 1 --owner "@me" --id <item-id>
```

#### List Items

```bash
gh project item-list 1 --owner "@me"
```

For JSON output (useful to find item IDs by title):

```bash
gh project item-list 1 --owner "@me" --format json
```

### Step 4: Look Up Item IDs by Title

When the user doesn't know the item ID, search by listing items and matching the title:

```bash
gh project item-list 1 --owner "@me" --format json -q '.items[] | select(.title | test("search_term"; "i")) | {id, title, status}'
```

This returns the IDs matching a fuzzy title search.

### Step 5: Sync Local Tickets with Project Board (Bi-directional)

This operation reads local ticket files from `./bugs/` and `./stories/`, reads items from the GitHub project, and performs a bi-directional sync:

| Direction | Source of Truth | What Gets Updated |
|---|---|---|
| Local → GitHub | Local file | Title, body content, and remote file URL |
| GitHub → Local | GitHub item | Status field |

#### Matching Logic

Local tickets are matched to GitHub items by **title**. The process:

1. Extract the title from each local file (H1 heading, e.g. `# My Bug Title`)
2. Extract the body from each local file (the full markdown content after the H1)
3. Extract the status from each local file (`**Status:** Todo` or `**Status:** Open`)
4. Fetch all GitHub project items and their titles, statuses, and item IDs
5. Match local files to GitHub items by comparing titles (case-insensitive)

#### Status Mapping

| Local File | GitHub Project |
|---|---|
| `**Status:** Open` or `**Status:** Todo` | `Todo` (option `f75ad846`) |
| `**Status:** In Progress` | `In Progress` (option `47fc9ee4`) |
| `**Status:** Done` | `Done` (option `98236657`) |

#### File Link Reference

Every GitHub item created or updated by sync includes a link back to its source file in the GitHub repository. The link is appended as a footer in the body:

```
---
*File: https://github.com/santiphap-tw/flightsearch-ai/blob/main/bugs/my-bug-title.md*
```

This ensures traceability from GitHub back to the source file. On re-sync, any existing `*File:*` footer is stripped and rewritten with the current URL — no duplicates.

#### Sync Procedure

For each local ticket file in `./bugs/*.md` and `./stories/*.md`:

**1. Read the file and parse metadata:**

```bash
# Extract title (first H1)
title=$(head -1 "path/to/file.md" | sed 's/^# //')

# Extract relative path and build remote URL
relative_path=$(echo "path/to/file.md" | sed 's|^\./||')
remote_url="https://github.com/santiphap-tw/flightsearch-ai/blob/main/$relative_path"

# Extract body (everything after H1 line, trimmed) and strip any stale file link
# NOTE: Use tail + awk (not GNU sed) for macOS compatibility
body=$(tail -n +2 "path/to/file.md" | awk 'NF{found=1} found{print}' | grep -v '^\*File:')

# Append the file link footer
body="$body"$'\n\n---\n*File: '"$remote_url"'*'

# Extract status (full value, possibly multi-word like "In Progress")
status=$(sed -n 's/^\*\*Status:\*\* //p' "path/to/file.md" | head -1 | xargs)
```

**2. Check if a matching GitHub item exists by title:**

```bash
# Fetch all items with titles and statuses
gh project item-list 1 --owner "@me" --format json
```

Use jq to find a matching item:
```bash
gh project item-list 1 --owner "@me" --format json -q \
  --arg title "$title" \
  '.items[] | select(.title | ascii_downcase == ($title | ascii_downcase))'
```

**3. If no match exists — create a new item in GitHub:**

```bash
# Create the draft issue (body already includes the file link)
result=$(gh project item-create 1 --owner "@me" --title "$title" --body "$body" --format json)

# Extract ID using grep (NOT jq) — gh CLI outputs malformed JSON with
# literal newlines in the body string, which breaks jq on macOS.
item_id=$(echo "$result" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

# Map local status to GitHub option ID and set it
case "$status" in
  "In Progress") option_id="47fc9ee4" ;;
  "Done")        option_id="98236657" ;;
  *)             option_id="f75ad846" ;;  # default to Todo/Open
esac

gh project item-edit \
  --project-id "PVT_kwHOA5K1Vc4BXH-b" \
  --id "$item_id" \
  --field-id "PVTSSF_lAHOA5K1Vc4BXH-bzhSXD2s" \
  --single-select-option-id "$option_id"
```

**4. If a match exists — bi-directional update:**

```bash
# Get the GitHub item's current state
github_item=$(gh project item-list 1 --owner "@me" --format json -q \
  --arg title "$title" \
  '.items[] | select(.title | ascii_downcase == ($title | ascii_downcase))')
item_id=$(echo "$github_item" | jq -r '.id')
github_status=$(echo "$github_item" | jq -r '.status')

# Update GitHub title and body from local (local is source of truth for content)
gh project item-edit --id "$item_id" --title "$title"
gh project item-edit --id "$item_id" --body "$body"

# Update local status from GitHub (GitHub is source of truth for status)
case "$github_status" in
  "In Progress") new_local_status="In Progress" ;;
  "Done")        new_local_status="Done" ;;
  *)             new_local_status="Open" ;;  # Treat Todo as Open in local files
esac

# Update the local file's status line
sed -i '' "s/\*\*Status:\*\* .*/**Status:** $new_local_status/" "path/to/file.md"
```

> **Important:** When constructing `$body` in step 1, the `*File:*` line is **always stripped first** from the raw file content to prevent duplicate footers on re-sync. The fresh link is appended at the end of the body text (before the final horizontal rule, if any).

#### Edge Cases

| Scenario | Handling |
|---|---|
| Local file exists, no GitHub match | Create new GitHub draft issue |
| GitHub item exists, no local file | List as warning — no automatic deletion |
| Title changed locally | Creates a new GitHub item (old remains orphaned) |
| Multiple local files match same GitHub title | Update all matching local files |
| GitHub item is archived | Skip during sync (treat as not found for creation; update local if matched) |
| Local status line missing | Default to `Open` / `Todo` |
| `./bugs/` or `./stories/` directory missing | Create directories if needed |
| GitHub body already has a file link | Stripped and rewritten during sync (no duplicates) |
| Local file renamed on disk | New remote URL is computed automatically on next sync |

#### Dry Run Mode

Before making changes, offer to do a **dry run** to show what would happen:

```bash
echo "=== Local Tickets ==="
for f in ./bugs/*.md ./stories/*.md; do
  echo "  $(head -1 "$f" | sed 's/^# //') ($(dirname "$f" | xargs basename)/$(basename "$f"))"
done

echo "=== GitHub Items ==="
gh project item-list 1 --owner "@me" --format json -q '.items[] | "  \(.title) [\(.status)]"'
```

Then compute and display the diff without applying it.

#### Performance Notes

- For projects with many items, the `gh project item-list` call fetches all items — cache the result rather than calling it repeatedly in a loop.
- Batch edit calls: Each field update requires a separate `gh project item-edit` call. Run them sequentially for the same item.

### Step 6: Confirm & Summarize

After executing any operation, confirm what was done. Provide the relevant details:
- **Created**: Item title and ID
- **Moved**: Item title and new status
- **Synced**: Per-ticket breakdown of what was pushed/pulled
- **Archived/Deleted**: Item title
- **Warnings**: Orphaned GitHub items with no local file
- If an error occurs, show the error output and suggest next steps.

## Best Practices & Rules

- **Always use `--owner "@me"`** — the project belongs to the authenticated user `santiphap-tw`.
- **Use JSON output** when you need to parse item IDs from command output (`--format json` with `-q` for jq filtering).
- **Confirm before deleting** — never delete an item without asking the user first.
- **Create then update** — do not try to set field values in the same mutation as creation. You must create the item first, then run a separate edit to set fields like Status.
- **Draft issues vs existing content**: Use `item-create` for new draft issues (standalone items in the project), and `item-add` to track existing GitHub issues or PRs.
- **jq for filtering**: Use `-q` flag with jq expressions to search for items by title when the user doesn't know the item ID.
- **Handle errors gracefully**: If a command fails, show the error output to the user and offer to debug.
- **Known field IDs for this project**:
  - Status: `PVTSSF_lAHOA5K1Vc4BXH-bzhSXD2s`
  - Status options: `f75ad846` (Todo), `47fc9ee4` (In Progress), `98236657` (Done)
  - Project ID: `PVT_kwHOA5K1Vc4BXH-b`
- **File link integrity**: Every GitHub item must contain a `*File:*` footer pointing to its source file on GitHub at `https://github.com/santiphap-tw/flightsearch-ai/blob/main/...`. This is automatically managed during sync — always strip stale links before appending fresh ones to avoid duplicates.
- **Escaping**: When passing special characters in query strings, use single quotes and proper escaping.

## Troubleshooting

### Common Errors

| Error | Likely Cause | Fix |
|---|---|---|
| `required scopes [project]` | Token lacks `project` scope | Run `gh auth refresh -h github.com -s project` |
| `Could not resolve to a ProjectV2` | Wrong project number or owner | Verify with `gh project list --owner "@me"` |
| `Field does not exist` | Wrong field ID | List fields with `gh project field-list 1 --owner "@me"` |
| `Not Found` when archiving | Item already archived | Use `--undo` to unarchive instead |
| `jq: parse error: Invalid string: control characters` | `gh` CLI outputs malformed JSON with literal newlines in the `body` field during `item-create` | Use `grep` + `cut` to extract the ID instead of `jq` (see Step 5) |

### Scopes Required

- **Reading projects**: `read:project`
- **Writing to projects**: `project`

To add project write scope:
```bash
gh auth refresh -h github.com -s project
```

---

*Generated by opencode*
