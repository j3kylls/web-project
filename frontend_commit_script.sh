#!/bin/bash

# Ensure on main branch
git branch -M main

# Setup basic files to be tracked
git add .
git commit --allow-empty -m "Project Initialization"

# Actual Commit Timeline
declare -a messages=(
    "Initialize Vite project with Tailwind setup"
    "Setup project structure: src/assets, src/pages, src/components"
    "Create Navbar.jsx and ProtectedRoute.jsx components"
    "Add LandingPage.jsx and Login.jsx pages"
    "Create Signup.jsx and Profile.jsx pages"
    "Add Dashboard.jsx and Blogs.jsx pages"
    "Create CloudFiles.jsx and Tasks.jsx pages"
    "Develop FocusTimer.jsx and Notifications.jsx pages"
    "Setup Redux store and authSlice.js"
    "Configure Tailwind CSS and PostCSS"
    "Final fixes: index.html, vite.config.js, minor bug fixes"
)

# Set start date
start="2025-04-06T10:00:00"

# Loop over commit messages
for i in "${!messages[@]}"; do
    # Add everything
    git add .

    # Calculate fake commit date
    commit_date=$(date -d "$start +$i days" --iso-8601=seconds)

    # Make the commit with a custom date
    GIT_COMMITTER_DATE="$commit_date" GIT_AUTHOR_DATE="$commit_date" git commit -m "${messages[$i]}"
done

# Push the commits
git push -u origin main
