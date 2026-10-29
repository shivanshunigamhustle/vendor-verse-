/* Content of the VendorVerse Software Requirements Specification v1.0 (17 Oct 2026) */
export const FRS = {
  'FR-01': { title: 'Authentication and Accounts', items: ['Users shall register/sign in using the phone/email method selected for launch.', 'Users shall manage profiles and sessions; public browsing may be available without login.', 'Account status and protected actions shall require appropriate authentication.'] },
  'FR-02': { title: 'Role-Based Access Control', items: ['The system shall restrict screens, records, and actions by role and permission.', 'Authorization shall be enforced by the backend for protected operations.', 'Vendor/organization data shall be isolated; Sales Agents shall not have vendor-approval or platform-setting permissions by default.'] },
  'FR-03': { title: 'Vendor Registration and Verification', items: ['Vendors shall submit business details, service areas/branches, and required documents.', 'Super Admins shall approve, reject with a reason, or request more information.', 'Vendors shall view status and correct/resubmit rejected information.', 'Unverified vendors shall not be represented as verified.'] },
  'FR-04': { title: 'Categories and Listings', items: ['Super Admins shall manage categories, subcategories, product/service types, and required fields.', 'Vendors shall create and maintain listings with descriptions, images, and category-specific details.', 'Authorized admins shall approve, reject, suspend, or remove listings.', 'Prices, stock, variants, MOQ, lead time, and service availability shall be supported where applicable.'] },
  'FR-05': { title: 'Search and Discovery', items: ['Customers shall search vendors, products, and services.', 'Filters shall include category, location, price, availability, and verification where data exists.', 'Customers shall view profiles, listing details, images, prices, reviews, and availability where applicable.', 'Customers may save and compare relevant vendors/listings.'] },
  'FR-06': { title: 'Service Bookings', items: ['Customers shall select a service/time and submit a booking.', 'Vendors shall accept/decline requests and update job status through completion.', 'The system shall prevent conflicting bookings for unavailable slots/resources.', 'Customers may request cancellation/rescheduling under the approved policy.'] },
  'FR-07': { title: 'Product Orders', items: ['Customers shall place orders and view status/tracking where available.', 'Vendors shall process orders through configured statuses such as confirmed, packed, shipped, or delivered.', 'Inventory-enabled listings shall track stock and prevent invalid stock reductions.', 'Returns/refunds shall follow the approved policy.'] },
  'FR-08': { title: 'RFQs and Quotations', items: ['Customers shall submit RFQs with requirements and files where enabled.', 'Vendors shall submit/revise quotations and track quote status.', 'Customers shall compare quotations, ask questions/negotiate where supported, and accept a quote.', 'The system shall retain quotation history and status changes.'] },
  'FR-09': { title: 'Payments and Financial Records', items: ['The system shall support payment methods selected for launch.', 'Customers shall see applicable prices and fees before payment.', 'The system shall record payment status and show receipts/invoices where applicable.', 'Refunds, chargebacks, commissions, settlements, and payouts shall follow approved rules and provider capabilities.'] },
  'FR-10': { title: 'Communication and Notifications', items: ['Customers and vendors shall have messaging or an enquiry channel.', 'Relevant users shall receive updates for booking, order, quotation, payment, and onboarding events.', 'In-app notifications are the proposed baseline; other channels depend on provider readiness.'] },
  'FR-11': { title: 'Reviews, Support, and Disputes', items: ['Customers shall review eligible completed transactions.', 'Users shall report issues or submit support requests.', 'Super Admins shall review escalated complaints/disputes and record actions.'] },
  'FR-12': { title: 'Sales-Agent Lead Management', items: ['Agents shall create customer/vendor leads with contact, category, location, source, priority, and notes.', 'Pipeline: New, Contacted, Interested, Registration Started, Registered/Submitted, Approved/Converted, Lost, Inactive.', 'Agents shall log calls/messages/visits, outcomes, next actions, and follow-up dates.', 'Agents may assist onboarding and collect documents only with consent.', 'Agents shall see assigned leads and permitted records only.', 'Agent commissions/referrals require approved attribution, calculation, approval, and payout rules.'] },
  'FR-13': { title: 'Admin Dashboard and Reports', items: ['Super Admins shall view registrations, active users/vendors, orders, bookings, RFQs, sales, and agent conversions.', 'Reports shall support relevant filters such as date, category, location, vendor, and agent where applicable.', 'Export capability shall be included where approved.'] },
  'FR-14': { title: 'Commercial and Platform Settings', items: ['Authorized Super Admins shall manage platform fees, vendor plans, commission rules, locations, notifications, and feature availability where required.', 'Customer-facing charges shall be clear before payment.', 'Sensitive setting changes shall be logged.'] },
  'FR-15': { title: 'Audit and Status History', items: ['The system shall retain status history for verification, listings, orders, bookings, RFQs, payments, refunds, disputes, and leads.', 'Critical administrative and financial actions shall record actor, action, target, and timestamp.'] },
}

export const NFR = [
  ['Security', 'Secure authentication/session handling, backend authorization, protected documents, and privileged-role MFA where supported.'],
  ['Privacy', 'Data minimization, consent for assisted onboarding, and defined retention/export/deletion workflows.'],
  ['Usability', 'Responsive desktop/mobile interface, clear statuses, and actionable validation messages.'],
  ['Reliability', 'Handle duplicate submissions/payment events safely and maintain consistent transaction states.'],
  ['Auditability', 'Log critical administrative, approval, and financial actions.'],
  ['Localization', 'Hindi and English if both are confirmed for launch.'],
  ['Notifications', 'In-app notifications at minimum; email/SMS/push/WhatsApp subject to provider readiness.'],
]

export const MVP = [
  'Authentication, role-based permissions, and basic profiles.',
  'Vendor registration, document submission, and Super Admin approval.',
  'Category and product/service listing management.',
  'Customer search, filters, vendor profiles, and verification status.',
  'Service booking and product order workflows with clear statuses.',
  'RFQ submission, vendor quotation response, and customer quote acceptance.',
  'Basic supported payment flow, transaction records, and transparent price breakdown.',
  'Customer-vendor messaging or a minimal enquiry channel.',
  'Notifications for key status changes.',
  'Basic reviews, issue reporting, and admin dispute handling.',
  'Sales-agent lead pipeline, assisted onboarding, and follow-up reminders.',
  'Basic admin/vendor/agent reports and audit logs for sensitive actions.',
]

export const PHASE2 = [
  'AI requirement extraction, recommendations, price estimation, and assisted booking/RFQ.',
  'Enterprise procurement: branches/cost centres, approvals, purchase orders, budgets, bid comparison.',
  'Multi-vendor project boards, work packages, dependencies, and shared budgets.',
  'Staff hiring and candidate management.',
  'Field-staff route planning, GPS check-in, photos, and OTP job sign-off.',
  'Offline Sales Agent mode with later synchronization.',
  'Advanced analytics, lead scoring, pricing benchmarks, and conversion funnels.',
  'Clearly labelled sponsored placements.',
  'Warranty/asset tracking, maintenance reminders, group bookings, advanced dispatch/capacity planning.',
  'Advanced notification preferences, quiet hours, device/session controls, detailed security history.',
]

export const FUTURE = [
  'Multi-vendor project workspaces with shared budgets, dependencies and work packages.',
  'AI-led marketplace assistance beyond the MVP discovery and quotation flows.',
  'Advanced workforce, logistics, dispatch and field-operations automation.',
  'Enterprise-grade procurement approvals, budgets, cost centres and supplier governance.',
  'Cross-border trade automation, advanced compliance and country-specific tax workflows.',
]

export const ACCEPTANCE = [
  'Each role can perform only authorized actions; cross-vendor access is blocked.',
  'Vendor onboarding produces clear approval, rejection, or additional-information outcomes.',
  'Customers can complete enabled order, booking, and RFQ workflows with visible statuses.',
  'Vendors can manage listings and respond to orders, bookings, and RFQs.',
  'Sales Agents can manage assigned leads and follow-ups without unauthorized approval rights.',
  'Payment, cancellation, refund, and dispute flows pass tests against approved policies.',
  'Critical admin and financial actions generate audit records.',
  'High-priority defects are resolved and stakeholders approve UAT before production.',
]

export const DECISIONS = [
  'Confirm whether product orders, service bookings, and RFQs all belong in the first release.',
  'Select payment provider/methods, collection model, payout timing, fees, refunds, and chargeback handling.',
  'Approve cancellation, rescheduling, returns, refunds, and dispute policies.',
  'Define category-specific listing fields and stock/MOQ/lead-time/availability rules.',
  'Define vendor verification requirements and document retention/access rules.',
  'Decide whether subscriptions and paid plans are MVP or later.',
  'Define Sales Agent commission attribution, calculation, approval, and payout; agents must not approve their own onboarded vendors.',
  'Confirm launch geography, languages, notification providers, and compliance requirements.',
  'Approve which optional modules remain outside MVP.',
]

export const ROLE_TABLE = [
  ['Super Admin', 'Manage users/roles, vendor verification, listing moderation, categories, sales agents, marketplace operations, commercial settings, reports, and audit logs.'],
  ['Customer', 'Discover vendors/products/services; manage profile; order products; book services; submit RFQs; compare/accept quotations; pay; communicate, review, and raise issues.'],
  ['Vendor / Supplier', 'Manage business profile, verification, listings, pricing, applicable inventory, availability, orders, bookings, quotations, customer communication, and available financial/performance records.'],
  ['Sales Agent', 'Manage assigned leads, acquire customers/vendors, assist onboarding with consent, schedule follow-ups, track pipeline/conversions, and view permitted performance/commission information.'],
]
