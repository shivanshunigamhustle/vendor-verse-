import * as Auth from './screens/auth.jsx'
import * as C1 from './screens/customer1.jsx'
import * as C2 from './screens/customer2.jsx'
import * as V from './screens/vendor.jsx'
import * as A from './screens/agent.jsx'
import * as AD from './screens/admin.jsx'
import { WebsiteHome } from './screens/website-home.jsx'
import { ScopeReview } from './screens/scope.jsx'
import { VendorExplore } from './screens/vendor-explore.jsx'


/*  id → { C: component, role, title, fr: [FR codes], bar: status-bar tone, defaultParams: route defaults for the directory }  */
const R = (id, C, role, title, fr = [], extra = {}) => [id, { id, C, role, title, fr, ...extra }]

export const SCREENS = Object.fromEntries([
  // ---- auth ----
  R('splash', Auth.Splash, 'auth', 'Splash', ['FR-01'], { bar: 'brand-dark' }),
  R('welcome', Auth.Welcome, 'auth', 'Welcome & language', ['FR-01'], { bar: 'brand' }),
  R('login', Auth.Login, 'auth', 'Log in (phone / email)', ['FR-01', 'FR-02']),
  R('otp', Auth.Otp, 'auth', 'OTP & admin MFA', ['FR-01', 'FR-02'], { defaultParams: { contact: '+91 98290 00001', role: 'customer' } }),
  R('register', Auth.Register, 'auth', 'Create account', ['FR-01', 'FR-03']),
  R('scope_review', ScopeReview, 'auth', 'MVP scope review', ['FR-05', 'FR-15']),

  // ---- customer ----
  R('c_home', WebsiteHome, 'customer', 'Marketplace', ['FR-05', 'FR-10'], { tab: true, bar: 'brand' }),
  R('c_categories', C1.Categories, 'shared', 'All categories', ['FR-04', 'FR-05']),
  R('c_category', C1.Category, 'shared', 'Category detail', ['FR-04', 'FR-05'], { defaultParams: { id: 'elec' } }),
  R('c_explore', C1.Explore, 'shared', 'Search, filters & results', ['FR-05'], { tab: true }),
  R('c_listing', C1.ListingDetail, 'shared', 'Product / service detail', ['FR-04', 'FR-05', 'FR-10'], { defaultParams: { id: 'l1' } }),
  R('c_vendor', C1.VendorProfile, 'shared', 'Vendor profile', ['FR-03', 'FR-05'], { defaultParams: { id: 'v-me' } }),
  R('c_activity', C2.Quotes, 'customer', 'Quote requests (RFQ)', ['FR-08'], { tab: true }),
  R('c_booking_new', C2.BookingNew, 'customer', 'Request a service booking', ['FR-09']),
  R('c_booking', C2.BookingDetail, 'shared', 'Booking details & actions', ['FR-09', 'FR-11'], { defaultParams: { id: 'BKG-1039' } }),
  R('c_order_new', C2.OrderNew, 'shared', 'Create purchase order', ['FR-07', 'FR-09']),
  R('c_order', C2.OrderDetail, 'shared', 'Purchase order tracking', ['FR-07', 'FR-09', 'FR-11'], { defaultParams: { id: 'ORD-24020' } }),
  R('c_rfq_new', C2.RfqNew, 'shared', 'Create RFQ', ['FR-08']),
  R('c_rfq', C2.RfqDetail, 'shared', 'RFQ & compare quotations', ['FR-08', 'FR-15'], { defaultParams: { id: 'RFQ-311' } }),
  R('c_saved', C2.Saved, 'customer', 'Saved & compare', ['FR-05']),
  R('messages', C2.Messages, 'shared', 'Messages (customer and vendor)', ['FR-10'], { tab: true }),
  R('chat', C2.Chat, 'shared', 'Chat', ['FR-10'], { defaultParams: { id: 't1' } }),
  R('notifications', C2.Notifications, 'shared', 'Notifications', ['FR-10']),
  R('c_review', C2.WriteReview, 'customer', 'Rate a vendor', ['FR-11'], { defaultParams: { vendorId: 'v-me' } }),
  R('c_issue_new', C2.IssueNew, 'customer', 'Report an issue', ['FR-11']),
  R('c_issues', C2.Issues, 'customer', 'Support & issues', ['FR-11']),
  R('c_issue', C2.IssueDetail, 'customer', 'Issue status', ['FR-11', 'FR-15'], { defaultParams: { id: 'DSP-204' } }),
  R('c_profile', C2.Profile, 'customer', 'Profile', ['FR-01'], { tab: true }),
  R('c_profile_edit', C2.ProfileEdit, 'customer', 'Edit profile', ['FR-01']),
  R('c_settings', C2.CustomerSettings, 'customer', 'Settings, privacy & sessions', ['FR-01', 'FR-10']),

  // ---- vendor ----
  R('v_dash', V.VendorDashboard, 'vendor', 'Dashboard', ['FR-03', 'FR-08', 'FR-10'], { tab: true, bar: 'ink' }),
  R('v_explore', VendorExplore, 'vendor', 'Supplier marketplace', ['FR-05', 'FR-08']),
  R('v_business_onboard', V.BusinessOnboarding, 'vendor', 'Business supplier onboarding', ['FR-03', 'FR-04']),
  R('v_register', V.VendorRegister, 'shared', 'Vendor account creation', ['FR-03']),
  R('v_verify', V.VendorVerify, 'vendor', 'Verification status', ['FR-03', 'FR-15']),
  R('v_listings', V.VendorListings, 'vendor', 'My listings', ['FR-04'], { tab: true }),
  R('v_listing_edit', V.ListingEdit, 'vendor', 'Add / edit listing', ['FR-04'], { defaultParams: { id: 'l1' } }),
  R('v_work', V.VendorQuotes, 'vendor', 'Quote requests (RFQ)', ['FR-08'], { tab: true }),
  R('v_orders', V.VendorOrders, 'vendor', 'Purchase orders', ['FR-09', 'FR-15']),
  R('v_rfq', V.VendorRfq, 'vendor', 'Submit / revise quotation', ['FR-08', 'FR-15'], { defaultParams: { id: 'RFQ-315' } }),
  R('v_perf', V.Performance, 'vendor', 'Performance reports', ['FR-13']),
  R('v_reviews', V.VendorReviews, 'vendor', 'Customer reviews', ['FR-11']),
  R('v_more', V.VendorMore, 'vendor', 'More', ['FR-02'], { tab: true }),
  R('v_profile', V.VendorProfile, 'vendor', 'Business profile & plan', ['FR-03', 'FR-14']),

  // ---- sales agent ----
  R('a_home', A.AgentHome, 'agent', 'Home & pipeline', ['FR-12'], { tab: true, bar: 'brand-dark' }),
  R('a_leads', A.Leads, 'agent', 'Leads', ['FR-12'], { tab: true }),
  R('a_lead', A.LeadDetail, 'agent', 'Lead detail', ['FR-12', 'FR-15'], { defaultParams: { id: 'ld1' } }),
  R('a_lead_new', A.LeadNew, 'agent', 'Add lead', ['FR-12']),
  R('a_log', A.LogActivity, 'agent', 'Log call / message / visit', ['FR-12'], { defaultParams: { id: 'ld1' } }),
  R('a_followups', A.Followups, 'agent', 'Follow-ups', ['FR-12'], { tab: true }),
  R('a_onboard', A.Onboard, 'agent', 'Assisted onboarding (consent)', ['FR-12', 'FR-03'], { defaultParams: { id: 'ld1' } }),
  R('a_earnings', A.AgentEarnings, 'agent', 'Commissions', ['FR-12'], { tab: true }),
  R('a_profile', A.AgentProfile, 'agent', 'Profile', ['FR-02', 'FR-12'], { tab: true }),

  // ---- super admin ----
  R('ad_dash', AD.AdminReferenceDashboard, 'admin', 'Dashboard', ['FR-13'], { tab: true, bar: 'ink' }),
  R('ad_approvals', AD.Approvals, 'admin', 'Approvals hub', ['FR-03', 'FR-04', 'FR-11'], { tab: true }),
  R('ad_vendors', AD.AdminVendors, 'admin', 'Vendor verification queue', ['FR-03']),
  R('ad_vendor_new', AD.AdminVendorNew, 'admin', 'Add vendor or business supplier', ['FR-03']),
  R('ad_vendor', AD.AdminVendor, 'admin', 'Review vendor', ['FR-03', 'FR-15'], { defaultParams: { id: 'v8' } }),
  R('ad_listings', AD.AdminListings, 'admin', 'Listing moderation', ['FR-04']),
  R('ad_listing', AD.AdminListing, 'admin', 'Review listing', ['FR-04', 'FR-15'], { defaultParams: { id: 'l5' } }),
  R('ad_users', AD.UsersScreen, 'admin', 'Users', ['FR-02'], { tab: true }),
  R('ad_user', AD.UserDetail, 'admin', 'User & role', ['FR-02'], { defaultParams: { id: 'u1' } }),
  R('ad_roles', AD.Roles, 'admin', 'Roles & permissions', ['FR-02']),
  R('ad_categories', AD.AdminCategories, 'admin', 'Categories', ['FR-04']),
  R('ad_category', AD.AdminCategory, 'admin', 'Category & required fields', ['FR-04'], { defaultParams: { id: 'elec' } }),
  R('ad_agents', AD.AdminAgents, 'admin', 'Sales agents', ['FR-12']),
  R('ad_agent', AD.AdminAgent, 'admin', 'Agent & commissions', ['FR-12', 'FR-09'], { defaultParams: { id: 'ag1' } }),
  R('ad_disputes', AD.AdminDisputes, 'admin', 'Disputes & support', ['FR-11']),
  R('ad_dispute', AD.AdminDispute, 'admin', 'Resolve dispute', ['FR-11', 'FR-15'], { defaultParams: { id: 'DSP-204' } }),
  R('ad_reports', AD.AdminReports, 'admin', 'Reports & export', ['FR-13'], { tab: true }),
  R('ad_settings', AD.AdminSettings, 'admin', 'Platform settings', ['FR-14']),
  R('ad_audit', AD.AuditLog, 'admin', 'Audit log', ['FR-15']),
  R('ad_more', AD.AdminMore, 'admin', 'More', ['FR-02'], { tab: true }),
  R('ad_analytics', AD.AdminReports, 'admin', 'Analytics', ['FR-13']),
  R('ad_customers', AD.UsersScreen, 'admin', 'Customers', ['FR-02'], { defaultParams: { role: 'Customer' } }),
  R('ad_notifications', AD.AdminFeature, 'admin', 'Send notification', [], { defaultParams: { kind: 'notifications', title: 'Send notification' } }),
  R('ad_coupons', AD.AdminSettings, 'admin', 'Coupons', ['FR-14']),
  R('ad_photo_approvals', AD.AdminListings, 'admin', 'Photo approvals', ['FR-04']),
  R('ad_previous', AD.AuditLog, 'admin', 'Previous work', ['FR-15']),
  R('ad_profile_images', AD.AdminFeature, 'admin', 'Profile images', [], { defaultParams: { kind: 'profile-images', title: 'Profile images' } }),
  R('ad_shop_leads', AD.AdminAgents, 'admin', 'Shop leads', ['FR-12']),
  R('ad_faqs', AD.AdminFeature, 'admin', 'FAQs', [], { defaultParams: { kind: 'faqs', title: 'FAQs' } }),
  R('ad_requirements', AD.AdminRfqWorkspace, 'admin', 'Requirements', [], { defaultParams: { kind: 'requirements' } }),
  R('ad_supply_gaps', AD.AdminRfqWorkspace, 'admin', 'Supply gaps', [], { defaultParams: { kind: 'supply-gaps' } }),
  R('ad_quote_moderation', AD.AdminRfqWorkspace, 'admin', 'Quote moderation', [], { defaultParams: { kind: 'quote-moderation' } }),
  R('ad_category_templates', AD.AdminCategories, 'admin', 'Category templates', ['FR-04']),
  R('ad_rfq_health', AD.AdminReports, 'admin', 'RFQ health', ['FR-13']),
  R('ad_platform_settings', AD.AdminSettings, 'admin', 'Platform settings', ['FR-14']),
])

export const GROUPS = [
  { id: 'auth', label: 'Auth' },
  { id: 'customer', label: 'Customer' },
  { id: 'vendor', label: 'Vendor' },
  { id: 'agent', label: 'Agent' },
  { id: 'admin', label: 'Admin' },
]


