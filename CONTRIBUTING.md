# 🤝 Contributing to Boi-Para

Boi-Para is an active open-source project participating in GSSoC 2026. 
This document is not a suggestion — it is the standard. All contributions must comply with it. 
Read it fully before writing a single line of code.

## 🚀 Getting Started

Before anything else:
*   Read the `README.md` completely — it covers setup, project structure, and environment variables.
*   Make sure your local environment is fully working before picking an issue.
*   If setup fails, check existing GitHub Issues before opening a new one.

**Finding issues to work on:**
1. Browse open issues.
2. New contributors must start with `good first issue` labeled issues — do not jump to `feature` or complex `bug` issues on your first contribution.
3. Filter by label to find the right issue for your skill level.
4. Read the issue description fully before commenting.

---

## 📌 Issue Assignment Rules

These rules exist to keep the project moving efficiently. They are strictly enforced.

*   **One issue per contributor at a time.** Do not request a second issue until your first PR is merged.
*   **You must comment on the issue and wait for assignment** before starting any work. Unassigned PRs will be closed.
*   Do not open a PR for an issue assigned to someone else.
*   **Inactivity policy:** If you are assigned an issue and show no progress (no commits, no updates) within **3 days**, you will be automatically unassigned and the issue will be reopened. No exceptions.
*   If you need more time, comment on the issue *before* the deadline — not after.

> ⚠️ PRs submitted for issues you were not assigned to will be closed immediately without review.

---

## 🌿 Branch Naming Convention

All branches must follow this naming convention. PRs from non-conforming branch names will be asked to rename.

**Format:** `type/short-hyphenated-description`

| Type | When to use | Example |
| :--- | :--- | :--- |
| `feature` | Adding new functionality | `feature/dark-mode-toggle` |
| `fix` | Fixing a bug | `fix/login-redirect-loop` |
| `docs` | Documentation changes only | `docs/update-contributing` |
| `refactor` | Code restructuring, no behavior change | `refactor/api-hook-cleanup` |
| `style` | CSS/UI-only changes, no logic | `style/navbar-spacing` |
| `test` | Adding or fixing tests | `test/auth-controller-unit` |

**Rules:**
* Always branch off from `main`.
* Keep branch names lowercase and hyphen-separated.
* No generic names like `patch-1`, `my-fix`, or `update`.

---

## 💬 Commit Message Guidelines

Boi-Para follows the Conventional Commits specification. Every commit message must follow this format:

**Format:** `type: short imperative description`

**Real examples:**
*   `feat: add search filter for book categories`
*   `fix: resolve JWT token expiry not clearing localStorage`
*   `docs: update quick start steps in README`
*   `style: align book cards in dashboard grid view`

**Rules:**
*   Use present tense, imperative mood — "add" not "added" or "adds".
*   Keep the description under 72 characters.
*   Do not use vague messages like "fixed stuff", "update", or "changes".
    *   ❌ `git commit -m "update"` → **Rejected**
    *   ✅ `git commit -m "fix: prevent duplicate book save on double-click"` → **Accepted**

---

## 🔧 Development Workflow

Follow this workflow exactly. Skipping steps leads to rejected PRs.

### 1. Fork the repository
Click **Fork** on the original Boi-Para repository page.

### 2. Clone your fork
Go to your newly created fork on GitHub, click the green "Code" button, and copy your URL. Run this in your terminal:
```bash
git clone PASTE_YOUR_COPIED_URL_HERE
cd boi-para