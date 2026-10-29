import {
  Home, Compass, ClipboardList, MessageCircle, User, LayoutDashboard, Briefcase, Package, MoreHorizontal, Users, CalendarClock,
  Wallet, ShieldCheck, BarChart3, Settings, LineChart, UserRound, Store, Megaphone, CreditCard, TicketPercent, AlertOctagon, Image, History, Camera, Tag, HelpCircle, Languages, Rocket, Bot, CalendarRange, ClipboardCheck, GitBranch, FileSearch, ShieldAlert, FileCog, Activity, SlidersHorizontal, Boxes,
} from 'lucide-react'

export const ROLES = [
  { id: 'customer', label: 'Customer', short: 'Customer' },
  { id: 'vendor', label: 'Vendor / Supplier', short: 'Vendor' },
  { id: 'business', label: 'Business / Company Supplier', short: 'Business' },
  { id: 'agent', label: 'Sales Agent', short: 'Agent' },
  { id: 'admin', label: 'Super Admin', short: 'Admin' },
]

export const HOME = { customer: 'c_home', vendor: 'v_dash', agent: 'a_home', admin: 'ad_dash' }
HOME.business = 'v_dash'

/* bottom navigation per role — `k` is a dictionary key for Hindi/English labels */
export const TABS = {
  customer: [
    { id: 'c_home', k: 'home', icon: Home },
    { id: 'c_explore', k: 'explore', icon: Compass },
    { id: 'c_activity', k: 'quotes', icon: ClipboardList },
    { id: 'messages', k: 'messages', icon: MessageCircle },
    { id: 'c_profile', k: 'profile', icon: User },
  ],
  vendor: [
    { id: 'v_dash', k: 'dashboard', icon: LayoutDashboard },
    { id: 'v_work', k: 'quotes', icon: Briefcase },
    { id: 'v_listings', k: 'listings', icon: Package },
    { id: 'messages', k: 'messages', icon: MessageCircle },
    { id: 'v_more', k: 'more', icon: MoreHorizontal },
  ],
  business: [
    { id: 'v_dash', k: 'dashboard', icon: LayoutDashboard },
    { id: 'v_work', k: 'quotes', icon: Briefcase },
    { id: 'v_listings', k: 'listings', icon: Package },
    { id: 'messages', k: 'messages', icon: MessageCircle },
    { id: 'v_more', k: 'more', icon: MoreHorizontal },
  ],
  agent: [
    { id: 'a_home', k: 'home', icon: Home },
    { id: 'a_leads', k: 'leads', icon: Users },
    { id: 'a_followups', k: 'followups', icon: CalendarClock },
    { id: 'a_earnings', k: 'earnings', icon: Wallet },
    { id: 'a_profile', k: 'profile', icon: User },
  ],
  admin: [
    { id: 'ad_dash', k: 'dashboard', icon: LayoutDashboard },
    { id: 'ad_approvals', k: 'approvals', icon: ShieldCheck },
    { id: 'ad_users', k: 'users', icon: Users },
    { id: 'ad_reports', k: 'reports', icon: BarChart3 },
    { id: 'ad_more', k: 'more', icon: Settings },
  ],
}

export const ADMIN_SIDEBAR = [
  { label: 'Overview', items: [{ id: 'ad_dash', label: 'Dashboard', icon: LayoutDashboard }, { id: 'ad_analytics', label: 'Analytics', icon: LineChart }] },
  { label: 'Users', items: [{ id: 'ad_vendors', label: 'Vendors', icon: Store }, { id: 'ad_customers', label: 'Customers', icon: UserRound }, { id: 'ad_agents', label: 'Sales Agents', icon: Users }] },
  { label: 'Operations', items: [{ id: 'ad_notifications', label: 'Send notification', icon: Megaphone }, { id: 'ad_settings', label: 'Plans & add-ons', icon: CreditCard }, { id: 'ad_coupons', label: 'Coupons', icon: TicketPercent }, { id: 'ad_disputes', label: 'Disputes', icon: AlertOctagon }, { id: 'ad_photo_approvals', label: 'Photo approvals', icon: Image }, { id: 'ad_previous', label: 'Previous work', icon: History }, { id: 'ad_profile_images', label: 'Profile images', icon: Camera }, { id: 'ad_shop_leads', label: 'Shop leads', icon: Tag }] },
  { label: 'Platform', items: [{ id: 'ad_categories', label: 'Categories', icon: Tag }, { id: 'ad_faqs', label: 'FAQs', icon: HelpCircle }] },
  { label: 'RFQ Console', items: [{ id: 'ad_requirements', label: 'Requirements', icon: ClipboardCheck }, { id: 'ad_supply_gaps', label: 'Supply gaps', icon: GitBranch }, { id: 'ad_quote_moderation', label: 'Quote moderation', icon: FileSearch }, { id: 'ad_category_templates', label: 'Category templates', icon: FileCog }, { id: 'ad_rfq_health', label: 'RFQ health', icon: ShieldAlert }] },
  { label: 'System', items: [{ id: 'ad_reports', label: 'Reports', icon: BarChart3 }, { id: 'ad_platform_settings', label: 'Platform settings', icon: SlidersHorizontal }, { id: 'ad_audit', label: 'Audit log', icon: ClipboardList }] },
]

