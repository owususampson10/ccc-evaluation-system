# Calvary Charismatic Centre (CCC)
## General Evaluation Questionnaire - Digital Data Entry System
### Product Requirements Document (PRD)

---

## Document Information

**Project Name:** CCC Evaluation Form Data Entry System  
**Version:** 1.0  
**Date:** December 21, 2025  
**Prepared By:** Development Team  
**Status:** Final

---

## 1. Executive Summary

### 1.1 Project Overview
This document outlines the requirements for developing a local network-based data entry system for Calvary Charismatic Centre's General Evaluation Questionnaire. The system will enable church volunteers to digitally enter responses from physical paper questionnaires, while allowing church leadership to view reports and export data.

### 1.2 Purpose
- Digitize paper-based evaluation questionnaire responses
- Provide efficient data entry interface for multiple volunteers
- Enable church leadership to analyze congregation feedback
- Replace manual data entry and spreadsheet management

### 1.3 Goals
- Deploy on a single PC accessible via local network
- Support simultaneous data entry by multiple volunteers
- Maintain 100% fidelity to original questionnaire wording
- Provide simple reporting and data export for admin

---

## 2. User Personas

### 2.1 Volunteer Data Entry Clerks
- **Role:** Church volunteers entering responses from paper forms
- **Technical Skills:** Basic computer literacy
- **Goals:** 
  - Enter forms accurately and quickly
  - Minimize errors during data entry
  - Track progress (number of forms entered)
- **Access:** Shared login credentials across multiple PCs

### 2.2 Church Administrator
- **Role:** Pastor, church leadership, or administrative staff
- **Technical Skills:** Moderate computer literacy
- **Goals:**
  - View response statistics and reports
  - Export data for further analysis
  - Understand congregation feedback
- **Access:** Private admin credentials, not shared

---

## 3. System Architecture

### 3.1 Deployment Model
- **Type:** Local network application
- **Hosting:** Single PC acting as server
- **Access:** Multiple client PCs via web browser on same network
- **URL Format:** `http://[HOST_PC_IP]:3000`

### 3.2 Technology Stack
- **Frontend:** Next.js 14 (App Router), React, Tailwind CSS
- **Backend:** Next.js API Routes, Node.js
- **Database:** SQLite (file-based, simple backup)
- **Authentication:** JWT-based session management
- **Form Management:** React Hook Form with Zod validation

### 3.3 System Requirements
**Host PC (Server):**
- Windows 10/11 or macOS
- Node.js 18+ installed
- Minimum 4GB RAM
- 10GB available storage
- Network connectivity

**Client PCs (Volunteers):**
- Modern web browser (Chrome, Firefox, Edge, Safari)
- Network connectivity to host PC
- No software installation required

---

## 4. Functional Requirements

### 4.1 Authentication System

#### 4.1.1 User Roles
**Admin User:**
- Username: Configurable (default: `admin`)
- Password: Strong, unique (set during setup)
- Capabilities: View reports, export data, analytics
- Restrictions: Cannot enter form data
- Credentials: Private, never shared

**Volunteer User:**
- Username: Shared account (e.g., `volunteer`)
- Password: Simple, shared password
- Capabilities: Data entry only
- Restrictions: Cannot view reports or other responses
- Credentials: Shared across all data entry PCs

#### 4.1.2 Login Flow
1. User navigates to login page
2. Enters username and password
3. System validates credentials
4. Redirects based on role:
   - Admin → Dashboard (`/admin`)
   - Volunteer → Data Entry Form (`/form`)
5. Session expires after 8 hours of inactivity

#### 4.1.3 Security Requirements
- Passwords hashed with bcrypt (10 rounds)
- JWT tokens for session management
- HTTP-only cookies
- Protected routes via middleware
- Automatic session timeout

---

## 5. Data Entry Form Requirements

### 5.1 Form Presentation
- **Structure:** Multi-step form with 5 sections
- **Progress:** Visual progress indicator showing current section
- **Navigation:** Next/Previous buttons between sections
- **Validation:** Real-time field validation
- **Confirmation:** Success message after submission

### 5.2 Exact Questionnaire Content

**IMPORTANT:** All questions, labels, options, and help text must match the original document word-for-word, including:
- Question numbering
- Checkbox/radio labels
- Introductory text in italics
- All punctuation and formatting

---

### SECTION A: PERSONAL INFORMATION

**Age Group:**  
- Text input field
- Label: "Age Group:"

**Gender:**  
- Radio buttons
- Options: ☐ Male ☐ Female

**Which service do you attend regularly?**  
- Radio buttons
- Options:
  - ☐ 1st Service (6:00--8:00am)
  - ☐ 2nd Service (8:00--10:00am)
  - ☐ 3rd Service (10:00am--12:00noon)

**Are you a member of this church?**  
- Radio buttons
- Options: ☐ Yes ☐ No

**If "yes", state your membership code:**  
- Text input field
- Conditional: Only show if "Are you a member" = Yes
- Optional field

**If "no", are you a regular visitor (i.e., at least 2 times a month).**  
- Radio buttons
- Options: ☐ Yes ☐ No
- Conditional: Only show if "Are you a member" = No
- Optional field

**Do you have children?**  
- Radio buttons
- Options: ☐ Yes ☐ No

**If yes, are they part of any of our departments?**  
- Checkboxes (multiple selection allowed)
- Options:
  - ☐ Children Ministry
  - ☐ New Generation
  - ☐ Salt City
- Conditional: Only show if "Do you have children" = Yes

---

### SECTION B: SERVICE EXPERIENCE

**Section Introduction (display as italic text):**  
*Each Sunday, our services include a time of Worship & Preaching, followed by Bible Study to deepen our understanding of God's Word.*

**1. How would you rate the overall flow and experience of our services?**  
- Radio buttons
- Options: ☐ Excellent ☐ Good ☐ Fair ☐ Needs Improvement

**2. Is the transition between worship/preaching and Bible Study smooth and well-timed?**  
- Radio buttons
- Options: ☐Yes ☐ Somewhat ☐ No

**3. What do you enjoy most about the services?**  
- Multi-line text area
- Required field

**4. What aspects of the services could be improved, and how?**  
- Multi-line text area
- Required field

**5. Are the current service times convenient for you?**  
- Radio buttons
- Options: ☐ Yes ☐ No

**If no, please suggest what might work better:**  
- Multi-line text area
- Conditional: Only show if "service times convenient" = No
- Optional field

---

### SECTION C: DEPARTMENTAL INVOLVEMENT

**Section Introduction (display as italic text):**  
*CCC has active departments such as Men's Ministry, Women's Ministry (CLM), Youth Ministry (Young Adults), and Children's Ministry.*

**1. Which department(s) are you involved in?**  
- Multi-line text area
- Required field

**2. How would you describe your department's level of activity and support?**  
- Radio buttons
- Options: ☐ Very Active ☐ Active ☐ Not Active

**3. How effectively does your department help members grow spiritually and build meaningful relationships?**  
- Radio buttons
- Options: ☐ Excellent ☐ Good ☐ Fair ☐ Needs Improvement

**4. What could be done to make your department more effective and engaging?**  
- Multi-line text area
- Required field

---

### SECTION D: MINISTRY FUNCTIONALITY

**Section Introduction (display as italic text):**  
*In addition to departments, CCC functions through key ministries such as the Family Life Ministry, Hospitality Ministry, and others (e.g., Ushering, Protocol, Media, Music, Prayer, etc.).*

**1. Which ministry or ministries are you currently serving in (if any)?**  
- Multi-line text area
- Required field

**2. How would you rate teamwork and coordination within your ministry?**  
- Radio buttons
- Options: ☐ Excellent ☐ Good ☐ Fair ☐ Needs Improvement

**3. Does your ministry receive adequate support from leadership and other teams?**  
- Radio buttons
- Options: ☐ Yes ☐ Sometimes ☐ No

**4. Suggest what can be done to improve your ministry?**  
- Multi-line text area
- Required field

---

### SECTION E: OVERALL FEEDBACK

**1. How would you describe the overall spiritual atmosphere at CCC?**  
- Radio buttons
- Options: ☐ Vibrant ☐ Encouraging ☐ Neutral ☐ Needs Revival

**2. What do you believe CCC is doing exceptionally well?**  
- Multi-line text area
- Required field

**3. What area do you believe CCC should focus on improving most urgently?**  
- Multi-line text area
- Required field

**4. Any additional thoughts, comments, or creative ideas to help CCC grow stronger?**  
- Multi-line text area
- Required field

---

### 5.3 Form Validation Rules

**Required Fields:**
- All questions marked as required in the original document
- Cannot proceed to next section without completing required fields
- Submit button disabled until all required fields complete

**Conditional Field Logic:**
- Membership code: Show only if member = Yes
- Regular visitor: Show only if member = No
- Children departments: Show only if has children = Yes
- Service time suggestions: Show only if times convenient = No

**Data Type Validation:**
- Text fields: Maximum 500 characters per field
- Text areas: Maximum 2000 characters
- No special character restrictions (allow all input)

### 5.4 Data Capture Metadata
Each response must automatically capture:
- Submission timestamp
- Username of volunteer who entered the data
- Unique response ID

---

## 6. Admin Dashboard Requirements

### 6.1 Dashboard Overview
**Components:**
1. Statistics cards showing:
   - Total responses collected
   - Responses entered today
   - Responses entered this week
   - Last response timestamp

2. Quick access buttons:
   - View All Responses
   - Generate Reports
   - Export Data

### 6.2 View All Responses
**Features:**
- Paginated table (50 responses per page)
- Columns to display:
  - Response ID
  - Date/Time submitted
  - Entered by (volunteer username)
  - Service attendance
  - Member status
  - Overall rating
- Click row to view full response details
- Search functionality (by date, service time, rating)

### 6.3 Simple Reports

#### 6.3.1 Demographics Report
- Age group distribution (if provided)
- Gender distribution
- Service attendance breakdown (1st, 2nd, 3rd service)
- Member vs Non-member ratio
- Families with children percentage
- Display as: Pie charts and bar charts

#### 6.3.2 Satisfaction Metrics
- Overall service rating distribution
- Transition smoothness rating
- Service time convenience satisfaction
- Department activity levels
- Ministry teamwork ratings
- Ministry support adequacy
- Spiritual atmosphere assessment
- Display as: Stacked bar charts

#### 6.3.3 Department & Ministry Summary
- List of all departments mentioned (with frequency)
- List of all ministries mentioned (with frequency)
- Activity level breakdown
- Effectiveness ratings
- Display as: Sortable tables

#### 6.3.4 Open-Ended Responses
- Searchable list of all text responses
- Grouped by question
- Export capability for each question

### 6.4 Data Export
**Export Options:**
1. **Full CSV Export**
   - All responses with all fields
   - One row per response
   - Filename: `ccc-responses-YYYY-MM-DD.csv`

2. **Filtered Export**
   - Filter by date range
   - Filter by service attendance
   - Filter by member status
   - Filter by rating thresholds

3. **Summary Report Export**
   - PDF or Excel format
   - Contains: Statistics, charts, and summaries
   - Filename: `ccc-summary-report-YYYY-MM-DD.pdf`

**Export Button Location:**
- Prominent button on admin dashboard
- One-click download
- No authentication required after login

---

## 7. Database Schema

### 7.1 Users Table
```
Table: User
- id (Primary Key, UUID)
- username (Unique, String)
- password (Hashed, String)
- role (Enum: 'admin' | 'volunteer')
- createdAt (DateTime)
```

### 7.2 Responses Table
```
Table: Response
- id (Primary Key, UUID)
- createdAt (DateTime)
- updatedAt (DateTime)
- enteredBy (String, FK to User.username)

Section A Fields:
- ageGroup (String, nullable)
- gender (String)
- serviceAttendance (String)
- isMember (Boolean)
- membershipCode (String, nullable)
- isRegularVisitor (Boolean, nullable)
- hasChildren (Boolean)
- childrenDepartments (JSON Array, nullable)

Section B Fields:
- overallRating (String)
- transitionSmooth (String)
- enjoyMost (Text)
- improveAspects (Text)
- timesConvenient (Boolean)
- timeSuggestions (Text, nullable)

Section C Fields:
- departmentsInvolved (Text)
- departmentActivity (String)
- departmentEffectiveness (String)
- departmentImprovements (Text)

Section D Fields:
- ministriesServing (Text)
- ministryTeamwork (String)
- ministrySupport (String)
- ministryImprovements (Text)

Section E Fields:
- spiritualAtmosphere (String)
- exceptionalAreas (Text)
- urgentImprovements (Text)
- additionalThoughts (Text)
```

---

## 8. Non-Functional Requirements

### 8.1 Performance
- Form submission: < 2 seconds
- Report generation: < 5 seconds for 1000 responses
- Page load time: < 3 seconds
- Support concurrent data entry by 5-10 volunteers

### 8.2 Usability
- Clean, uncluttered interface
- Large, readable fonts (minimum 14px)
- Clear section headings
- Intuitive navigation
- Mobile-responsive (works on tablets)

### 8.3 Reliability
- Auto-save functionality (save draft every 60 seconds)
- Prevent data loss on connection issues
- Database backup before system restart
- Error messages are clear and actionable

### 8.4 Data Integrity
- No duplicate response IDs
- All required fields enforced
- Data type validation
- SQL injection prevention
- XSS attack prevention

### 8.5 Accessibility
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode option
- Text size adjustability

---

## 9. User Interface Specifications

### 9.1 Color Scheme
- Primary: Church brand color (if available) or professional blue
- Secondary: Neutral grays
- Success: Green for confirmations
- Error: Red for validation errors
- Background: White or light gray

### 9.2 Typography
- Headings: Sans-serif, bold, 24-32px
- Body text: Sans-serif, regular, 16px
- Form labels: Sans-serif, medium, 14px
- Buttons: Sans-serif, bold, 16px

### 9.3 Layout Guidelines
- Maximum content width: 800px (centered)
- Form fields: Full width with adequate spacing
- Buttons: Minimum 44px height (touch-friendly)
- White space: Generous padding and margins
- Progress bar: Fixed at top of form

### 9.4 Component Specifications

**Progress Bar:**
- 5 steps labeled: A, B, C, D, E
- Current step highlighted
- Completed steps marked with checkmark
- Remaining steps grayed out

**Form Fields:**
- Radio buttons: Large clickable area (entire label)
- Checkboxes: Large clickable area
- Text inputs: Clear borders, 48px height
- Text areas: Minimum 120px height, resizable
- Error messages: Display below field in red

**Buttons:**
- Primary (Next, Submit): Solid fill, prominent
- Secondary (Previous): Outline style
- Disabled state: Grayed out, no interaction
- Hover state: Slight color change

---

## 10. Development Phases

### Phase 1: Foundation (Week 1)
- Project setup (Next.js, Tailwind, Prisma)
- Database schema implementation
- Authentication system
- User seed script (create admin + volunteer)

### Phase 2: Data Entry Form (Week 1-2)
- Section A implementation
- Section B implementation
- Section C implementation
- Section D implementation
- Section E implementation
- Form navigation and validation
- Submit functionality

### Phase 3: Admin Dashboard (Week 2)
- Dashboard layout
- Statistics cards
- View all responses
- Response detail view

### Phase 4: Reports & Export (Week 2-3)
- Demographics report
- Satisfaction metrics report
- Department/Ministry summary
- CSV export functionality
- PDF report generation

### Phase 5: Testing & Deployment (Week 3)
- Volunteer workflow testing
- Admin workflow testing
- Network deployment testing
- Documentation and training materials
- Production deployment

---

## 11. Testing Requirements

### 11.1 Unit Testing
- Form validation logic
- Authentication functions
- Data export functions
- Report calculation functions

### 11.2 Integration Testing
- Login → Data Entry flow
- Login → Admin Dashboard flow
- Form submission → Database storage
- Database query → Report generation
- Data export → File download

### 11.3 User Acceptance Testing
- Volunteer completes 10 sample forms
- Admin generates all reports
- Admin exports data to CSV
- Verify data accuracy against paper forms
- Test on multiple browsers

### 11.4 Performance Testing
- 5 volunteers entering data simultaneously
- 100 responses in database
- Report generation time
- Export large dataset (500+ responses)

### 11.5 Security Testing
- SQL injection attempts
- XSS attack attempts
- Unauthorized access attempts
- Session hijacking attempts

---

## 12. Deployment Checklist

### 12.1 Pre-Deployment
- [ ] Database migrated and seeded
- [ ] Admin credentials created and documented
- [ ] Volunteer credentials created and documented
- [ ] Environment variables configured
- [ ] Build completed successfully (`npm run build`)

### 12.2 Network Setup
- [ ] Host PC IP address identified and documented
- [ ] Firewall configured to allow port 3000
- [ ] Network connectivity tested from client PCs
- [ ] Host PC set to never sleep/hibernate

### 12.3 Documentation
- [ ] Volunteer instruction sheet printed
- [ ] Admin user guide created
- [ ] Troubleshooting guide prepared
- [ ] Backup and restore procedures documented

### 12.4 Training
- [ ] Volunteer training session conducted
- [ ] Admin training session conducted
- [ ] Test forms completed during training
- [ ] Feedback collected and addressed

---

## 13. Maintenance & Support

### 13.1 Backup Procedures
- **Frequency:** Daily automatic backup
- **Location:** External drive or network location
- **Retention:** Keep last 30 days of backups
- **Format:** SQLite database file copy
- **Responsibility:** Church IT person or admin

### 13.2 Monitoring
- Check system daily during evaluation period
- Monitor database size
- Review error logs weekly
- Test data entry from sample PC weekly

### 13.3 Troubleshooting
Common issues and solutions documented:
- "Cannot connect to server" → Check host PC is on and server is running
- "Login failed" → Verify credentials, check CAPS lock
- "Form won't submit" → Check all required fields completed
- "Report not loading" → Refresh page, check database connection

---

## 14. Success Criteria

### 14.1 Volunteer Success Metrics
- ✅ Average form entry time: < 5 minutes per form
- ✅ Data entry error rate: < 2%
- ✅ Volunteer satisfaction: 4/5 or higher
- ✅ No data loss incidents

### 14.2 Admin Success Metrics
- ✅ Reports accessible within 30 seconds
- ✅ CSV export successful on first attempt
- ✅ All responses accurately captured
- ✅ Admin satisfaction: 4/5 or higher

### 14.3 Technical Success Metrics
- ✅ System uptime: 99% during evaluation period
- ✅ Zero security incidents
- ✅ Database size < 100MB for 500 responses
- ✅ Concurrent users supported: 5-10

---

## 15. Future Enhancements (Post-Launch)

### 15.1 Phase 2 Features
- Multiple volunteer accounts (individual tracking)
- Draft saving for incomplete forms
- Duplicate detection (prevent same paper form entered twice)
- Print response as PDF for record-keeping

### 15.2 Phase 3 Features
- Advanced reporting (trend analysis if run quarterly)
- Text analytics on open-ended responses
- Automated email reports to leadership
- Mobile app for volunteers

### 15.3 Phase 4 Features
- Online submission (congregation fills forms themselves)
- Integration with church management system
- Multi-language support
- Cloud deployment for remote access

---

## 16. Appendices

### Appendix A: Complete Original Document
*(Reference the uploaded CCC_General_Evaluation_Questionnaire_Improved 3.0 Approved V1.docx)*

### Appendix B: Sample Data Entry Scenarios
**Scenario 1: Member with Children**
- Age Group: 35-44
- Gender: Female
- Service: 2nd Service
- Member: Yes, Code: M12345
- Children: Yes, Departments: Children Ministry

**Scenario 2: Regular Visitor**
- Age Group: 25-34
- Gender: Male
- Service: 1st Service
- Member: No
- Regular Visitor: Yes
- No Children

### Appendix C: Network Configuration Example
```
Host PC Configuration:
- IP Address: 192.168.1.100
- Port: 3000
- OS: Windows 11
- Node.js Version: 18.17.0

Client PC Access:
- URL: http://192.168.1.100:3000
- Browser: Chrome, Firefox, or Edge
- No software installation required
```

### Appendix D: Glossary
- **PRD**: Product Requirements Document
- **JWT**: JSON Web Token (authentication method)
- **CSV**: Comma-Separated Values (export format)
- **SQLite**: Lightweight file-based database
- **Next.js**: React framework for web applications
- **Tailwind CSS**: Utility-first CSS framework
- **Prisma**: Database ORM (Object-Relational Mapping)

---

## Document Approval

**Prepared By:** Development Team  
**Reviewed By:** Church Leadership  
**Approved By:** ________________________  
**Date:** ________________________

---

**End of Document**

*This PRD serves as the authoritative specification for the CCC Evaluation Form Data Entry System. Any changes or additions must be documented as amendments with version control.*