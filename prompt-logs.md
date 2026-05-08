# AI Agent Prompt Logs

> This project is an AI agent showcase. All prompts given to the agent are recorded here for transparency and reference.

---

## Session Log

### 1. Project Initialization
**Prompt:**
> initialize project with Storybook, React, Tailwindcss, Typescript, Vite, with pnpm

---

### 2. FlightSearch Component
**Prompt:**
> remove all stories and add a new one, `FlightSearch`. A component which consist of 3 input and 1 button, which are 2 airports selector (dropdown) and 1 dates selector (calendar) and 1 search button

---

### 3. Responsive Styling
**Prompt:**
> make responsive styling for flight search. Desktop - 1 row, all within container with border and shadow. Tablet - 1 column, all within container with border and shadow. Mobile - 1 column, full screen modal

---

### 4. First Commit
**Prompt:**
> make a first commit based on changes

---

### 5. Test Setup
**Prompt:**
> setup vitest and create first simple test on FlightSearch component to ensure the test pass

---

### 6. Second Commit
**Prompt:**
> commit all changes

---

### 7. Custom AirportSelector
**Prompt:**
> create AirportSelector component. Make it custom dropdown and add it to FlightSearch

---

### 8. Format Prompt Logs
**Prompt:**
> make prompt-logs.md more readable. (Note: this project will be a show case for AI agent so I want to records all prompt logs)

---

### 9. Commit Changes
**Prompt:**
> commit all changes

---

### 10. Create Storybook for AirportSelector
**Prompt:**
> Create storybook for @src/components/FlightSearch/AirportSelector.tsx

---

### 11. Write Unit Test for AirportSelector
**Prompt:**
> Write unit test for @src/components/FlightSearch/AirportSelector.tsx

---

### 12. Make AirportSelector Responsive
**Prompt:**
> Make @src/components/FlightSearch/AirportSelector.tsx responsive. On mobile, it should be full screen instead of dropdown.

---

### 14. Create DatesSelector Component
**Prompt:**
> Create DatesSelector component with custom calendar and it to FlightSearch

---

### 15. Add Return/One Way Radio Buttons
**Prompt:**
> In DatesSelector, add Return and OneWay radio button (default is Return). If user select return, in calendar, user can select 2 dates instead of 1

---

### 16. Rewrite README
**Prompt:**
> Rewrite @README.md , this project is a showcase using AI agent to build FlightSearch UI. add https://flightsearch-poc.vercel.app/ as demo link in readme as well

---

### 17. Remove Unnecessary Files for Storybook
**Prompt:**
> This project suppose to run with storybook. Remove all unneccessary files that not relate to component and storybook. Remove unneccessary pnpm command as well

---

### 18. Update README for Storybook-Only
**Prompt:**
> update readme as well

---

### 19. Disable Arrival and Date Selectors
**Prompt:**
> In @src/components/FlightSearch/FlightSearch.tsx , disable arrival airport and date selector if user haven't select departure airport yet. In the same way, disable date selector if user haven't select both departure and arrival airport yet

---

### 20. Update Tests and Storybook
**Prompt:**
> continue. Don't forget to update test and storybook

---

### 21. Add Reset and Confirm Buttons to DatesSelector
**Prompt:**
> in @src/components/FlightSearch/DatesSelector.tsx , instead of closing DatesSelector once you select dates, add reset and confirm button.

---

### 22. Create Bug Ticket Skill
**Prompt:**
> create create_bug_ticket skill at @.agents/skills/create-bug-ticket/SKILL.md . This skill will ask user several questions which are: where it happen, which device, browser, version, etc. Steps to reproduce, expect and actual behavior. The template of bug ticket should be in this skill so the bug ticket has consistent format. After everything done. Create bug ticket at ./bugs/{title}.md

---

### 23. Update Bug Ticket Skill
**Prompt:**
> update @.agents/skills/create-bug-ticket/SKILL.md to rewrite the input from user as well. The skill will expect user to put some fuzzy information and it's the skill job to make it structured and easy to read.

---

### 24. Enhance Bug Ticket Skill with Investigation
**Prompt:**
> The @.agents/skills/create-bug-ticket/SKILL.md should also try to do some early investigation and put it's own context in the bug ticket as well. Basically your job is not just put what user describe as is but try to help user gather information, gap, clues, etc.

---

### 25. Generate Bug Description
**Prompt:**
> Also generate the description of bug in the ticket as well. The skill should derive from all context user provided.

---

### 26. Create Story Ticket Skill
**Prompt:**
> using @.agents/skills/create-bug-ticket/SKILL.md as reference, Can you create `create-story-ticket` skill for me. In the same way, when invoke the skill, user will provider what they want in natural language. And have to generate the structure story ticket including prompt user for more information. These are what it should be in the story ticket
> - title
> - description
> - Requirement
> - Scope
> - AC in given when then format
> - Estimation (xs, s, m, l, xl)
> - Other technical notes like Tech task (step-by-step to complete the work) or related files and lines. No need to be perfect just a early investigate is fine.

---

### 27. Clarify Vague Requirements
**Prompt:**
> It's also skill job to clarify some vague requirements or edge cases as well

---

### 28. Create Development Plan Skill
**Prompt:**
> create create-development-plan skill for me
> - user will tell the ticket they want to create a plan for (either in ./bugs or ./stories)
> - The plan will be read by developer so feel free to use technical terms as much as you like.
> - The plan will be in TDD approach and ensure it coverage both storybook and unit test
> - You can design the plan format but put template in skill so that it will be consistent

---

### 29. Update Skill for pnpm
**Prompt:**
> this project is using pnpm

---

### 30. Generate Document Skill
**Prompt:**
> create a generate-document skill.
> - user will tell which component they want to generate the document for it.
> - you have to generate the technical document for that component under ./docs
> - You can design what it should be in document but put template in skill as well for consistentcy
> - This document will be read by developer. It should describe everything they need to know if they want to use this component.
> - If this is not standalone component and suppose to use with other, mention it as well
> - Have some sample code in document as well

---

### 31. Update AGENTS.md for pnpm
**Prompt:**
> Updage @AGENTS.md to tell agent that this project use pnpm

---

### 32. Update README.md to Match Current State
**Prompt:**
> update @README.md to match with current state of project right now. Also the list of available skills as well

---

### 33. Sync Project
**Prompt:**
> sync the project

---

### 34. Create Implement Ticket Skill
**Prompt:**
> create implement-ticket skill to follow the development plan in ./plans .
> - the skill will ask user first if you want to be yolo mode or approval mode which user will approve each step
> - Either mode, the skill must be transparent and report user every step

---

### 35. Create GitHub Action for Storybook
**Prompt:**
> create new github action to build storybook (with `pnpm build-storybook`) and deploy to github pages

---

### 36. Create Manage Project Skill
**Prompt:**
> create manage-github-project skill to create/update/move/archive item in https://github.com/users/santiphap-tw/projects/1

---

### 37. Add Sync Operation to Manage Project Skill
**Prompt:**
> Add sync operation into the skill
> - read tickets in ./bugs and ./stories in local
> - read items in github project
> - if items in github not existed, create a new one
> - if items in github existed, update detail on github to match with local, and update local status to match with github

---

### 38. Add File Link to GitHub Items
**Prompt:**
> make sure item in github project link with file in ./bugs or ./stories as well
> 
> make sure item in github project link with file in ./bugs or ./stories as well (ie. put the link into the item)

---

### 39. Use Remote Link Instead of Local Link
**Prompt:**
> Instead of local link, use remote link. This is repo on github https://github.com/santiphap-tw/flightsearch-ai

---

### 40. Sync Project and Commit
**Prompt:**
> sync project and commit

---

*Last updated: 2026-05-09*
