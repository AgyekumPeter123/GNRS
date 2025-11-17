# TODO: Implement Job Posting Form and Staff Content View in Staff Dashboard

## Tasks

- [ ] Add state for job posting modal (visibility, form data, loading, errors)
- [ ] Create job posting modal component with glassmorphism styling (semi-transparent background, backdrop blur, subtle borders)
- [ ] Update "content" tab to fetch and display only current user's content (submitted_by = user.id, status in 'pending' or 'approved') from Supabase
- [ ] Add onClick handlers to "Add Job" buttons in welcome banner and content tab to open modal
- [ ] Implement form submission: validate fields, upload image to Supabase storage, insert into content table
- [ ] After submission, create notification in Supabase and update notifications state
- [ ] Add snackbar/toast for success message after job submission
- [ ] Make notifications clickable to open a dialog with full details (message, time, date, purpose, etc.)
- [ ] Add state for notification dialog (selected notification, visibility)
- [ ] Update stats (contentCreated) after successful submission
- [ ] Add loading states and error handling for all operations
- [ ] Test form submission, image upload, content display, notifications, and dialogs
