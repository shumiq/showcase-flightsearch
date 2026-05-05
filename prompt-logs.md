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

*Last updated: 2026-05-06*
