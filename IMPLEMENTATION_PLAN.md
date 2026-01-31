# Frontend-Backend Integration - Implementation Plan

## Phase 1: Backend - Notifications Module
- [ ] Create notifications app
- [ ] Create Notification model
- [ ] Create serializers
- [ ] Create views (CRUD + mark as read)
- [ ] Configure admin panel
- [ ] Add URLs

## Phase 2: Frontend Services
- [ ] Create notificationsService.js
- [ ] Create enquiriesService.js (Contact Us)
- [ ] Update jobsService.js with apply functionality

## Phase 3: Frontend - AuthContext Enhancements
- [ ] Add notifications state
- [ ] Add fetchNotifications function
- [ ] Add markAsRead function
- [ ] Add unread count tracking

## Phase 4: Frontend - App.jsx Integration
- [ ] Integrate real job data from backend API
- [ ] Update Dashboard with live job listings
- [ ] Add Notifications dropdown in header
- [ ] Create Profile page with API data
- [ ] Create Contact Us page
- [ ] Create Job Apply modal
- [ ] Update Applications tab with real data

## Phase 5: UI Components
- [ ] Create NotificationsDropdown component
- [ ] Create ContactUs component
- [ ] Create JobApplyModal component
- [ ] Update JobCard to accept real job data

## Phase 6: Testing & Verification
- [ ] Test job listings from backend
- [ ] Test job application flow
- [ ] Test notifications system
- [ ] Test contact us form
- [ ] Test profile page

## Backend Files to Create:
- `backend/notifications/__init__.py`
- `backend/notifications/apps.py`
- `backend/notifications/models.py`
- `backend/notifications/serializers.py`
- `backend/notifications/views.py`
- `backend/notifications/urls.py`
- `backend/notifications/admin.py`

## Backend Files to Update:
- `backend/recruit_art/settings.py` (add notifications app)
- `backend/recruit_art/urls.py` (add notifications URLs)

## Frontend Files to Create:
- `frontend/src/services/notifications.js`
- `frontend/src/services/enquiries.js`
- `frontend/src/components/Notifications/NotificationsDropdown.jsx`
- `frontend/src/components/Contact/ContactUs.jsx`
- `frontend/src/components/Job/JobApplyModal.jsx`
- `frontend/src/pages/ContactUs.jsx`

## Frontend Files to Update:
- `frontend/src/contexts/AuthContext.jsx`
- `frontend/src/App.jsx`
- `frontend/src/components/Layout/Sidebar.jsx`
- `frontend/src/services/jobs.js`

