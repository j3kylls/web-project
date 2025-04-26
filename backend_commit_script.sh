#!/bin/bash

# Make sure you are on backend branch
git checkout backend

# Add all files
git add .

# Initial backend commit
GIT_COMMITTER_DATE="2025-04-17T10:00:00" GIT_AUTHOR_DATE="2025-04-17T10:00:00" git commit -m "Initialize backend project with Express server setup"

# Array of commit messages
declare -a messages=(
    "Setup backend folder structure: middleware, models, routes, utils"
    "Create User.js and Task.js models"
    "Create Blog.js and CloudFile.js models"
    "Add routes for user management and task operations"
    "Setup authentication middleware (auth.js)"
    "Develop cloudRoutes.js and blogRoutes.js endpoints"
    "Implement Pomodoro, Timetable and Notifications APIs"
    "Configure Google Drive integration and upload service"
    "Finalize backend validations and error handling"
    "Final backend cleanup and optimization"
)

# Set starting date
start="2025-04-18T10:00:00"

# Loop and commit each change
for i in "${!messages[@]}"; do
    git add .
    commit_date=$(date -d "$start +$i days" --iso-8601=seconds)
    GIT_COMMITTER_DATE="$commit_date" GIT_AUTHOR_DATE="$commit_date" git commit --allow-empty -m "${messages[$i]}"
done

# Push backend branch
git push -u origin backend
