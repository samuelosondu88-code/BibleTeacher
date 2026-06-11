# School Management System - Peculiar International College
## Full Project Specification Document

---

## 1. PROJECT OVERVIEW

A web-based School Management System (SMS) for Peculiar International College that manages the entire school ecosystem — academics, finance, communication, and administration — through a unified platform accessible by all stakeholders.

**Core Vision:** A full-fledged, income-generating product with high-quality UI/UX, bank-grade security, and free-hosting compatibility.

---

## 2. USER ROLES & ACCESS LEVELS

| Role | Access Level | Portal Name |
|------|-------------|-------------|
| **Super Admin** | Full system control | Admin Dashboard |
| **Admin Staff** | Academic & financial management | Admin Dashboard |
| **Teachers** | Class, grading & student management | Teacher Portal |
| **Students** | Academic & personal profile | Student Portal |
| **Parents/Guardians** | Monitor child's progress | Parent Portal |
| **Accountant** | Fee & payroll management | Finance Portal |
| **Prospect / Applicant** | Public — purchase & submit admission forms online (no login required) | Public Portal |

---

## 3. FEATURE MATRIX

### 3.1 ADMIN FEATURES
- [ ] Dashboard with analytics (charts, graphs, KPIs)
- [ ] School profile & configuration settings
- [ ] Academic calendar & term management
- [ ] Class & section management
- [ ] Subject creation & teacher assignment
- [ ] Student admission & enrollment management
- [ ] Teacher & staff recruitment management
- [ ] Timetable generation & management
- [ ] Examination management (create, schedule, publish results)
- [ ] Fee structure setup & management
- [ ] Library management system
- [ ] Transport management (bus routes, stops, tracking)
- [ ] Hostel/dormitory management
- [ ] Inventory & asset management
- [ ] Announcements & notices (push to all roles)
- [ ] SMS & email notification system
- [ ] Audit logs & activity tracking
- [ ] Backup & restore database
- [ ] Role-based permission management
- [ ] Multi-branch support (future expansion)

### 3.2 TEACHER FEATURES
- [ ] Personal profile & attendance marking
- [ ] Class roster view
- [ ] Student attendance entry (daily)
- [ ] Lesson notes & lesson plan upload
- [ ] Assignment creation & submission tracking
- [ ] Grade/score entry & management
- [ ] Report card generation
- [ ] Timetable view
- [ ] Communication with parents (messages)
- [ ] Leave application & approval tracking
- [ ] Resource/material sharing with students
- [ ] Online quiz/test creation
- [ ] Syllabus coverage tracker
- [ ] Student performance analytics
- [ ] Class diary / daily log

### 3.3 STUDENT FEATURES
- [ ] Personal profile view & edit (limited)
- [ ] Timetable view
- [ ] Attendance history
- [ ] Academic results & report cards
- [ ] Assignment submissions (file upload)
- [ ] Online quiz / test participation
- [ ] Fee payment history & receipts
- [ ] Lesson notes & materials access
- [ ] Library book search & borrowing history
- [ ] Examination schedule
- [ ] Announcements & notices
- [ ] Communication with teachers
- [ ] Study resources download
- [ ] Digital ID card
- [ ] Behavior/conduct records

### 3.4 PARENT FEATURES
- [ ] Dashboard with child's summary
- [ ] Attendance monitoring
- [ ] Academic performance & report cards
- [ ] Fee payment portal (online payment integration)
- [ ] Bank transfer payment form (upload proof of payment)
- [ ] Fee dues & payment history
- [ ] Teacher communication / messaging
- [ ] Announcements & notices
- [ ] Examination schedule
- [ ] Homework/assignment tracking
- [ ] Transport tracking (if applicable)
- [ ] Leave application for child
- [ ] Download receipts & reports
- [ ] Multiple children management
- [ ] Meeting scheduling with teachers
- [ ] Complaint/suggestion submission

### 3.5 PUBLIC / APPLICANT FEATURES (No Login Required)
- [ ] View school info, prospectus & browse admission requirements
- [ ] Purchase admission form online (₦4,000 via card or bank transfer)
- [ ] Fill and submit admission application form (personal info, academics, parent/guardian details)
- [ ] Upload required documents (birth certificate, passport photo, previous school report)
- [ ] Receive application acknowledgment & receipt via email/SMS
- [ ] Track application status online (pending → reviewing → accepted/rejected)
- [ ] Print/download admission letter if accepted
- [ ] Make acceptance fee payment online
- [ ] Contact school via public inquiry form

### 3.6 FINANCE / ACCOUNTANT FEATURES
- [ ] Fee collection & receipt generation
- [ ] Bank transfer payment verification (review & approve proof of payment)
- [ ] Online payment gateway integration (Paystack, Flutterwave, Stripe)
- [ ] Expense tracking & management
- [ ] Payroll management for staff
- [ ] Financial reports (profit/loss, balance sheet)
- [ ] Invoice generation
- [ ] Budget planning & tracking
- [ ] Audit trail of all transactions

---

## 4. TECHNOLOGY STACK

| Layer | Technology | Justification |
|-------|-----------|---------------|
| **Frontend** | HTML5, CSS3, JavaScript (ES6+) | Core requirements |
| **CSS Framework** | Bootstrap 5 + Custom CSS | Rapid UI, responsive, free |
| **UI Enhancement** | Font Awesome Icons, Animate.css | Visual appeal |
| **Charts** | Chart.js | Free, lightweight analytics |
| **Backend** | PHP 8.x | Universal hosting support, simple |
| **Backend Enhancement** | Core PHP (No heavy framework - keeps it lightweight for free hosting) | Minimal server load |
| **Database** | MySQL / MariaDB | Industry standard, free hosting support |
| **Server** | Apache / Nginx | Universal support |
| **Email** | PHP Mailer / SMTP | Notifications |
| **SMS** | Africa's Talking / Twilio API | Communication |
| **Payment** | Paystack / Flutterwave API | Income generation |

### Why PHP + MySQL?
- Supported by ALL free hosting platforms (000webhost, InfinityFree, AwardSpace, etc.)
- Low server resource consumption
- Mature security practices
- Huge community & documentation
- No build tools required (unlike Node/React on free hosts)

---

## 5. DATABASE DESIGN (Core Tables)

```
users (id, role, username, email, password_hash, first_name, last_name, phone, address, avatar, status, created_at)
students (id, user_id, admission_no, class_id, parent_id, dob, gender, blood_group, religion, reg_date)
teachers (id, user_id, employee_id, qualification, department_id, date_hired)
parents (id, user_id, occupation, relationship, emergency_contact)
classes (id, name, section, capacity, class_teacher_id)
subjects (id, name, code, class_id, teacher_id, credit_unit)
attendance (id, student_id, class_id, date, status, marked_by)
exams (id, name, term_id, class_id, start_date, end_date)
results (id, student_id, exam_id, subject_id, score, grade, remark)
fees (id, student_id, amount, balance, due_date, status, paid_date)
payments (id, fee_id, amount_paid, payment_method, reference, receipt_no, date)
timetable (id, class_id, subject_id, teacher_id, day, time_start, time_end, room)
assignments (id, title, description, file, subject_id, teacher_id, due_date, class_id)
submissions (id, assignment_id, student_id, file, submitted_at, score, feedback)
library (id, book_id, title, author, isbn, category, quantity, available)
borrowings (id, book_id, user_id, borrow_date, return_date, status)
messages (id, sender_id, receiver_id, subject, body, attachment, read_status, sent_at)
notice (id, title, content, target_role, created_by, created_at, file)
audit_logs (id, user_id, action, table_name, record_id, old_value, new_value, ip_address, timestamp)

admission_forms (id, form_name, description, price, is_active, created_at)
applications (id, form_id, first_name, last_name, email, phone, dob, gender, address, class_applying, parent_name, parent_phone, parent_email, documents, payment_ref, status, created_at)
application_payments (id, application_id, amount, payment_method, transaction_ref, receipt_no, paid_at, verified_by)
```

---

## 6. UI/UX DESIGN GUIDELINES

### Color Palette

| Purpose | Color | Hex Code |
|---------|-------|----------|
| **Primary** | Royal Blue | `#1a237e` |
| **Secondary** | Gold/Amber | `#ffc107` |
| **Accent** | Emerald Green | `#00c853` |
| **Success** | Green | `#28a745` |
| **Danger** | Crimson Red | `#dc3545` |
| **Warning** | Orange | `#ff9800` |
| **Info** | Sky Blue | `#17a2b8` |
| **Background** | Light Gray | `#f4f7fc` |
| **Text Dark** | Dark Navy | `#263238` |
| **White** | Pure White | `#ffffff` |

### Design Principles
- **Responsive:** Mobile-first design (parents use phones)
- **Clean:** Minimal clutter, ample whitespace
- **Consistent:** Uniform buttons, cards, forms throughout
- **Accessible:** WCAG 2.1 AA compliant contrast ratios
- **Loading states:** Skeleton screens for all data loads
- **Animations:** Subtle micro-interactions (hover, transitions)
- **Error handling:** User-friendly error messages with recovery actions
- **Dashboard-first:** Each role sees a personalized KPI dashboard on login

### Pages to Design
1. Landing/Welcome page (public)
2. Login page (with role selection dropdown)
3. Password reset flow
4. Admin dashboard
5. Teacher dashboard
6. Student dashboard
7. Parent dashboard
8. User profile page
9. Class management
10. Student management
11. Attendance screen
12. Exam & results screens
13. Fee management & payment portal
14. Timetable view
15. Library system
16. Messaging/inbox
17. Reports analytics
18. System settings
19. **Admission form purchase page (public, ₦4,000)**
20. **Online application form (public, after payment)**
21. **Application status tracker (public, by reference no.)**
22. **Admin application review & approval dashboard**
23. **Admission letter download page**

---

## 7. SECURITY ARCHITECTURE (Bank-Grade Protection)

### 7.1 Authentication & Access
| Measure | Implementation | Why It Matters |
|---------|---------------|----------------|
| **Password Hashing** | bcrypt (cost factor 12) or Argon2id | Even if DB is stolen, passwords are unreadable |
| **Rate Limiting** | 5 failed attempts → 15-minute account lock | Prevents brute-force attacks |
| **Session Security** | HTTP-only, Secure, SameSite cookies; regenerates on login | Prevents session hijacking |
| **2-Factor Auth** | Email/SMS OTP (optional, toggle in settings) | Extra layer for admin accounts |
| **Password Policy** | Min 8 chars, uppercase + number + symbol, 90-day expiry | Strong password enforcement |

### 7.2 Data Protection
| Measure | Implementation | Why It Matters |
|---------|---------------|----------------|
| **SQL Injection** | All queries use PDO prepared statements (never raw concatenation) | #1 web attack vector — fully blocked |
| **XSS (Cross-Site Scripting)** | htmlspecialchars() on all output, CSP headers | Prevents script injection into pages |
| **CSRF** | Unique per-session token on every form POST | Prevents unauthorized actions from external sites |
| **Input Validation** | Both client-side JS validation + server-side PHP validation | Defense in depth |
| **File Uploads** | Validate MIME type, file extension, max size (2MB), store outside webroot | Prevents malicious file uploads |

### 7.3 Infrastructure Security
| Measure | Implementation | Why It Matters |
|---------|---------------|----------------|
| **RBAC** | Middleware check on EVERY page load — redirects unauthorized users | Ensures parents can't access admin pages |
| **HTTPS** | .htaccess forces all traffic to HTTPS | Encrypts all data in transit (passwords, payments) |
| **Error Handling** | Custom 404, 403, 500 pages; no PHP errors displayed | Hides server internals from attackers |
| **SQL Exposure** | .sql files stored outside public_html (not web-accessible) | Prevents direct DB download |
| **Database Backup** | Automated daily backup emailed to admin + stored securely | Disaster recovery |
| **Audit Logs** | Every CRUD action logged: who, what, when, IP address | Full accountability & forensic traceability |

### 7.4 Payment Security
| Measure | Implementation |
|---------|---------------|
| **No Card Storage** | Payment via Paystack/Flutterwave — card details NEVER touch our server |
| **Bank Transfer Verification** | Admin manually verifies proof of payment before activating |
| **Receipt Integrity** | Each receipt has unique hash + QR code to verify authenticity |
| **Transaction Logs** | Immutable audit trail for all financial transactions |

### 7.5 Security Checklist
- [ ] **Password Hashing:** bcrypt/argon2 (never MD5/SHA1)
- [ ] **SQL Injection Prevention:** Prepared statements / PDO
- [ ] **XSS Protection:** Input sanitization, output escaping
- [ ] **CSRF Protection:** Tokens on all POST requests
- [ ] **Session Security:** HTTP-only cookies, session_regenerate_id()
- [ ] **HTTPS Enforcement:** Redirect all HTTP to HTTPS
- [ ] **Role-Based Access Control (RBAC):** Middleware on every page
- [ ] **Rate Limiting:** Login attempt throttling (5 attempts → 15min lock)
- [ ] **File Upload Security:** Validate MIME type, extension, size limit
- [ ] **SQL File Exposure Prevention:** .sql files outside public_html
- [ ] **Error Handling:** Custom error pages (no stack traces to users)
- [ ] **Data Validation:** Both client-side (JS) & server-side (PHP)
- [ ] **2-Factor Authentication:** Optional via email/SMS OTP (premium feature)
- [ ] **GDPR/NITDA Compliance:** Data export & deletion capability
- [ ] **Backup:** Automated daily database backup to email/cloud

---

## 8. MONETIZATION STRATEGY (Income Generation)

### 8.1 One-Time Revenue
- **License Fee:** One-time purchase for school installation
- **Installation & Setup:** Service charge for deployment

### 8.2 Recurring Revenue (Subscription Model)
- **Monthly/Annual Subscription:** Maintenance & updates
- **SMS Credits:** Pay-per-use bulk SMS for notifications
- **Cloud Backup:** Premium cloud backup service

### 8.3 Transaction-Based Revenue
- **Payment Gateway Commission:** 1-2% on fee payments
- **Result Printing:** Premium report card formats
- **Admission Form Sales:** ₦4,000 per form — 100% school revenue
- **Bank Deposit/Transfer:** Manual payment via bank, tracked in system

### 8.6 PAYMENT METHODS (Bank Deposit Form)
Parents/staff can pay fees directly into the school's bank account and submit proof of payment via an online form.

**Bank Transfer / Deposit Payment Flow:**
```
Parent logs in → Fee page → Select "Bank Transfer"
→ System displays school bank details:
   - Bank Name: [School Bank]
   - Account Name: Peculiar International College
   - Account Number: [School Account Number]
   - Sort Code: [Bank Sort Code]
→ Parent pays via mobile/USSD/branch deposit
→ Parent fills online payment form:
   [ ] Student Name (auto-filled)
   [ ] Class (auto-filled)
   [ ] Amount Paid
   [ ] Transaction Reference / Receipt Number
   [ ] Date of Payment
   [ ] Bank Name
   [ ] Upload Payment Proof (screenshot/receipt image)
→ System records payment as "PENDING VERIFICATION"
→ Admin/Accountant logs in → Payment Verification page
   → Reviews proof document
   → Approves or Rejects payment
   → If approved, fee is marked "PAID", receipt generated
   → SMS/Email notification sent to parent
```

**Payment Form UI Elements:**
- School bank details displayed prominently (copy-able)
- File upload with drag-and-drop for receipt/proof
- Auto-validation: amount must match fee structure
- Reference number uniqueness check
- Confirmation modal before submission
- Printable receipt after admin approval

### 8.7 ONLINE ADMISSION FORM PURCHASE FLOW (₦4,000)

```
Public visitor → School website → Click "Apply Now" / "Admission"
→ See admission form purchase page:
   - Form price clearly displayed: ₦4,000
   - Pay with Card (Paystack/Flutterwave) or Bank Transfer
→ Payment successful → Form unlocks → Fill application:
   [ ] Applicant's full name
   [ ] Date of birth / Age
   [ ] Gender
   [ ] Email address
   [ ] Phone number
   [ ] Residential address
   [ ] Class applying for (dropdown)
   [ ] Previous school attended
   [ ] Parent/Guardian full name
   [ ] Parent phone & email
   [ ] Parent occupation
   [ ] Upload required documents:
      - Passport photograph (max 500KB, JPG/PNG)
      - Birth certificate (PDF)
      - Previous school report (PDF)
→ Submit application → System generates:
   - Application reference number (e.g., PEC-2026-0001)
   - Acknowledgment receipt (email + SMS)
   - Application status: "UNDER REVIEW"
→ Admin reviews in dashboard → Updates status
→ If accepted:
   - Applicant receives admission letter (downloadable PDF)
   - Acceptance fee payment option appears
   - Applicant becomes student record in system
```

**Key Features of This Flow:**
- Pay ₦4,000 online before form unlocks (no free form access)
- Both card (instant) and bank transfer (manual verification) supported
- Auto-generated unique application reference number
- Email + SMS notification at every stage
- Admin dashboard: view all applicants, approve/reject, download documents
- Once fully accepted, applicant data auto-creates student record in database

### 8.4 Premium Features
- **Mobile App Access:** iOS/Android companion app
- **Custom Reports:** Bespoke analytics & exports
- **Multi-Branch Management:** Additional campus license
- **HR & Payroll Module:** Premium add-on

### 8.5 Sample Pricing Model (MAX ₦150,000/yr)
| Plan | Price (₦) | Features |
|------|-----------|----------|
| **Starter** | Free | Up to 50 students, basic features |
| **Standard** | 75,000/yr | Up to 300 students, all features |
| **Premium** | 150,000/yr | Unlimited students, SMS credits, priority support |
| **Enterprise** | 150,000/yr | Multi-branch, custom branding (custom quote for large scale) |

---

## 9. HOSTING STRATEGY (Free & Paid)

### Free Hosting Compatible
| Platform | PHP | MySQL | Storage | Limitation |
|----------|-----|-------|---------|------------|
| InfinityFree | ✓ | ✓ | 5 GB | 400 req/hr, no SSL on custom domain |
| 000webhost | ✓ | ✓ | 1 GB | 10 GB bandwidth, ads on free plan |
| AwardSpace | ✓ | ✓ | 1 GB | 5 GB monthly traffic |
| FreeHosting.com | ✓ | ✓ | 10 GB | Limited support |

### Recommended Paid Hosting (Low Cost)
| Platform | Monthly | Why |
|----------|---------|-----|
| Namecheap Stellar | ~$2.50/mo | Unlimited SSD, free SSL, cPanel |
| Hostinger Premium | ~$2.99/mo | Good speed, free domain + SSL |
| A2 Hosting | ~$2.99/mo | Turbo servers, great for schools |
| Interserver | ~$2.50/mo | Price lock guarantee |

---

## 10. WHAT YOU MIGHT HAVE MISSED — ADDITIONAL CONSIDERATIONS

### Features & Functionality
- [ ] **ID Card Generation:** Print digital/plastic ID cards for students & staff
- [ ] **Hostel/Dormitory Management:** Bed allocation, checkout, complaints
- [ ] **Transport Module:** GPS tracking link, route management, fee calculation
- [ ] **Alumni Portal:** Track graduates, donations, networking
- [ ] **Parent-Teacher Conference Scheduling:** Book slots online
- [ ] **Event Calendar:** Sports day, cultural events, PTA meetings
- [ ] **Health Record:** Medical history, allergies, immunization tracking
- [ ] **Inventory Management:** Books, uniforms, sports equipment
- [ ] **Canteen Management:** Meal plans, prepaid accounts, ordering
- [ ] **Online Paid Admission Form (₦4,000):** Purchase form, submit application, document upload, status tracking, admission letter generation
- [ ] **E-Learning Module:** Video lessons, live classes (Zoom/Meet integration)
- [ ] **Behavior/Discipline Tracking:** Conduct records, detention management
- [ ] **Staff Performance Evaluation:** Appraisal system
- [ ] **Letter Generation:** Bulk letters, transcript requests
- [ ] **Multi-Language Support:** English + French/Nigerian languages

### Technical Considerations
- [ ] **Progressive Web App (PWA):** Installable on mobile, works offline partially
- [ ] **RESTful API:** For future mobile app integration
- [ ] **Caching Strategy:** Browser caching, query caching for performance
- [ ] **SEO:** Public pages (landing, admission) optimized
- [ ] **GDPR/Data Protection:** Student data privacy compliance
- [ ] **Cookie Consent Banner:** For legal compliance
- [ ] **Favicon:** School logo as favicon
- [ ] **Print Stylesheets:** Result slips, receipts print-optimized
- [ ] **404 & Error Pages:** Custom, helpful error pages
- [ ] **Maintenance Mode:** Toggle for system updates
- [ ] **Documentation:** User manual & admin guide
- [ ] **Demo Mode:** Pre-populated demo data for trial
- [ ] **Data Migration Tool:** Import from Excel/CSV for transition
- [ ] **Multi-Term/Session Support:** Academic year tracking
- [ ] **Reusable Components:** Modal, alerts, data tables, pagination

---

## 11. PROJECT STRUCTURE (Folder Layout)

```
sms-peculiar-college/
├── index.php                    # Entry point / redirect
├── .htaccess                    # URL rewriting & security
├── config/
│   ├── database.php             # DB connection (PDO)
│   ├── app.php                  # App constants & settings
│   └── session.php              # Session management
│
├── assets/
│   ├── css/
│   │   ├── bootstrap.min.css
│   │   ├── style.css            # Main custom styles
│   │   ├── dashboard.css        # Dashboard layouts
│   │   └── print.css            # Print-optimized styles
│   ├── js/
│   │   ├── bootstrap.bundle.min.js
│   │   ├── main.js              # Core JavaScript
│   │   ├── validation.js        # Form validation
│   │   └── charts.js            # Chart.js configs
│   ├── images/
│   │   ├── logo.png
│   │   ├── favicon.ico
│   │   └── placeholders/
│   └── vendors/
│       ├── fontawesome/
│       ├── chart.js/
│       └── datatables/
│
├── public/                        # Public pages (no login required)
│   ├── index.php                  # Landing / welcome page
│   ├── about.php                  # About the school
│   ├── admission.php              # Admission info & form purchase
│   ├── apply.php                  # Fill & submit application (after payment)
│   ├── pay-form.php               # Pay ₦4,000 for admission form
│   ├── application-status.php     # Track application by reference no.
│   ├── contact.php                # Contact / inquiry form
│   └── download-letter.php        # Download admission letter
│
├── auth/
│   ├── login.php
│   ├── logout.php
│   ├── forgot-password.php
│   └── reset-password.php
│
├── admin/
│   ├── index.php                # Admin dashboard
│   ├── users.php                # Manage users
│   ├── classes.php              # Manage classes
│   ├── subjects.php             # Manage subjects
│   ├── timetable.php            # Timetable management
│   ├── exams.php                # Exam management
│   ├── fees.php                 # Fee structure
│   ├── library.php              # Library management
│   ├── transport.php            # Transport management
│   ├── hostel.php               # Hostel management
│   ├── notices.php              # Announcements
│   ├── attendance-report.php    # Attendance reports
│   ├── financial-reports.php    # Financial reports
│   ├── settings.php             # System settings
│   ├── backup.php               # Database backup
│   ├── applications.php         # View & manage admission applications
│   ├── admission-forms.php      # Configure form types & pricing
│   └── app-review.php           # Review single application, approve/reject
│
├── teacher/
│   ├── index.php                # Teacher dashboard
│   ├── classes.php              # My classes
│   ├── attendance.php           # Mark attendance
│   ├── grades.php               # Enter grades
│   ├── assignments.php          # Assignments
│   ├── lesson-notes.php         # Lesson plans
│   ├── timetable.php            # My timetable
│   ├── messages.php             # Communication
│   └── reports.php              # Performance reports
│
├── student/
│   ├── index.php                # Student dashboard
│   ├── profile.php              # My profile
│   ├── timetable.php            # My timetable
│   ├── attendance.php           # My attendance
│   ├── results.php              # My results
│   ├── assignments.php          # My assignments
│   ├── library.php              # Library access
│   ├── fees.php                 # My fees
│   ├── messages.php             # Messages
│   └── downloads.php            # Study materials
│
├── parent/
│   ├── index.php                # Parent dashboard
│   ├── children.php             # View children
│   ├── attendance.php           # Monitor attendance
│   ├── results.php              # View results
│   ├── fees.php                 # Pay fees
│   ├── messages.php             # Contact teachers
│   ├── timetable.php            # Children timetable
│   └── complaints.php           # Submit complaints
│
├── accountant/
│   ├── index.php                # Finance dashboard
│   ├── fees.php                 # Fee management
│   ├── payments.php             # Payment tracking
│   ├── expenses.php             # Expenses
│   ├── payroll.php              # Payroll
│   └── reports.php              # Financial reports
│
├── includes/
│   ├── header.php               # HTML header + nav
│   ├── footer.php               # HTML footer + scripts
│   ├── sidebar.php              # Dynamic sidebar per role
│   ├── functions.php            # Helper functions
│   ├── validation.php           # Input validation
│   └── mailer.php               # Email/SMS functions
│
├── api/
│   ├── process-payment.php      # Payment gateway callback (fees)
│   ├── process-form-payment.php # Payment gateway callback (admission forms)
│   ├── verify-payment.php       # Verify transaction status
│   ├── check-application.php    # Check application status by reference
│   ├── send-sms.php             # SMS API handler
│   ├── send-email.php           # Email handler
│   └── import-data.php          # CSV/Excel import
│
├── database/
│   ├── schema.sql               # Full database schema
│   ├── seed.sql                 # Demo data
│   ├── migrations/              # Versioned DB changes
│   └── backup/                  # Auto-backup storage
│
├── documents/                   # Uploaded files
│   ├── assignments/
│   ├── submissions/
│   ├── profiles/
│   ├── receipts/
│   └── applications/            # Admission form documents (photos, certs, reports)
│
└── docs/
    ├── user-manual.md
    ├── admin-guide.md
    └── api-docs.md
```

---

## 12. DEVELOPMENT PHASES

### Phase 1: Foundation (Weeks 1-2)
- Database schema design & creation
- Authentication system (login, register, password reset)
- Admin dashboard shell with navigation
- Core configuration & security middleware

### Phase 2: Admin Module (Weeks 3-4)
- User/role management
- Class, subject, teacher management
- Student admission workflow
- Timetable management

### Phase 3: Academic Module (Weeks 5-6)
- Attendance system
- Exam & grading system
- Report card generation
- Assignment & submission system

### Phase 4: Finance Module (Weeks 7-8)
- Fee structure & invoicing
- Payment processing (online gateway)
- Expense tracking
- Financial reporting

### Phase 5: Communication & Extra (Weeks 9-10)
- Messaging system (internal)
- SMS/email notifications
- Library management
- Transport & hostel modules
- Public admission form purchase (₦4,000)
- Online application & document upload
- Application review & approval workflow
- Admission letter generation

### Phase 6: Polish & Launch (Weeks 11-12)
- Performance optimization
- Security audit
- Documentation
- Deployment & testing

---

## 13. QUALITY ASSURANCE

- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsiveness testing
- [ ] Load testing (simulate 500+ concurrent users)
- [ ] SQL injection & XSS penetration testing
- [ ] Broken link checking
- [ ] Form validation (edge cases)
- [ ] Email deliverability testing
- [ ] Payment gateway sandbox testing
- [ ] Accessibility audit (WAVE tool)

---

## 14. FUTURE ENHANCEMENTS (v2.0)

- Mobile app (React Native / Flutter)
- AI-powered student performance prediction
- QR code attendance (scan to mark)
- Biometric integration (fingerprint)
- WhatsApp bot for notifications
- SMS gateway for offline parents
- Google Classroom / Moodle integration
- SMS exam results via USSD
- Online live class streaming integration
- Blockchain-based certificate verification

---

*Document Version: 1.0*
*Prepared for: Peculiar International College*
