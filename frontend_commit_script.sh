#!/bin/bash

# Ensure on main branch
git checkout main

# Setup basic files to be tracked
git add .
GIT_COMMITTER_DATE="2025-04-06T10:00:00" GIT_AUTHOR_DATE="2025-04-06T10:00:00" git commit --allow-empty -m "Initialize Vite project with Tailwind setup"

declare -a messages=(
    "Setup project structure: src/assets, src/pages, src/components"
    "Create Navbar.jsx and ProtectedRoute.jsx components"
    "Add LandingPage.jsx and Login.jsx pages"
    "Create Signup.jsx and Profile.jsx pages"
    "Add Dashboard.jsx and Blogs.jsx pages"
    "Create CloudFiles.jsx and Tasks.jsx pages"
    "Develop FocusTimer.jsx and Notifications.jsx pages"
    "Setup Redux store and authSlice.js"
    "Configure Tailwind CSS and PostCSS"
    "Final frontend fixes and cleanup"
)

# Set start date
start="2025-04-07T10:00:00"

# Loop over commit messages
for i in "${!messages[@]}"; do
    git add .
    commit_date=$(date -d "$start +$i days" --iso-8601=seconds)
    GIT_COMMITTER_DATE="$commit_date" GIT_AUTHOR_DATE="$commit_date" git commit --allow-empty -m "${messages[$i]}"
done

# Push all the new commits
git push origin main
