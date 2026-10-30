import {
  Home, Compass, ClipboardList, MessageCircle, User, LayoutDashboard, Briefcase, Package, MoreHorizontal, Users, CalendarClock,
  TrendingUp, Building2, ShoppingCart, Wallet,
  ShieldCheck, BarChart3, Settings, LineChart, Store, UserRound, CreditCard, Tag, Globe2, ClipboardCheck, Megaphone, ScrollText, FileSearch, Star, Flag, Building, Percent, SlidersHorizontal, Map, KeyRound, ListChecks, UserPlus, Layers, Ticket,
} from 'lucide-react'

export const ROLES = [
  { id: 'customer', label: 'Customer', short: 'Customer' },
  { id: 'vendor', label: 'Vendor', short: 'Vendor' },
  { id: 'agent', label: 'Sales Agent', short: 'Agent' },
  { id: 'business', label: 'Business', short: 'Business' },
  { id: 'admin', label: 'Super Admin', short: 'Admin' },
]

/* The admin portal is web-only (D-015): the admin role exists in this web app and nowhere else. */
export const VISIBLE_ROLES = ROLES

/* Business is a separate account type (company owners only) - it never shares a vendor identity */
export const vendorSide = (me) => me.role === 'vendor'

export const HOME = { customer: 'c_home', vendor: 'v_dash', agent: 'a_home', business: 'b_home', admin: 'ad_dash' }

/* bottom navigation per role — `k` is a dictionary key for Hindi/English labels */
export const TABS = {
  customer: [
    { id: 'c_home', k: 'home', icon: Home },
    { id: 'c_explore', k: 'explore', icon: Compass },
    { id: 'c_activity', k: 'activity', icon: ClipboardList },
    { id: 'messages', k: 'messages', icon: MessageCircle },
    { id: 'c_profile', k: 'profile', icon: User },
  ],
  vendor: [
    { id: 'v_dash', k: 'dashboard', icon: LayoutDashboard },
    { id: 'v_work', k: 'work', icon: Briefcase },
    { id: 'v_listings', k: 'listings', icon: Package },
    { id: 'v_buy', k: 'buy', icon: ShoppingCart },
    { id: 'messages', k: 'messages', icon: MessageCircle },
    { id: 'v_more', k: 'more', icon: MoreHorizontal },
  ],
  agent: [
    { id: 'a_home', k: 'home', icon: Home },
    { id: 'a_leads', k: 'leads', icon: Users },
    { id: 'a_followups', k: 'followups', icon: CalendarClock },
    { id: 'a_perf', k: 'performance', icon: TrendingUp },
    { id: 'a_earnings', k: 'earnings', icon: Wallet },
    { id: 'a_profile', k: 'profile', icon: User },
  ],
  business: [
    { id: 'b_home', k: 'home', icon: Home },
    { id: 'b_company', k: 'company', icon: Building2 },
    { id: 'b_services', k: 'services', icon: Briefcase },
    { id: 'messages', k: 'messages', icon: MessageCircle },
    { id: 'b_more', k: 'more', icon: MoreHorizontal },
  ],
  admin: [
    { id: 'ad_dash', k: 'dashboard', icon: LayoutDashboard },
    { id: 'ad_approvals', k: 'approvals', icon: ShieldCheck },
    { id: 'ad_users', k: 'users', icon: Users },
    { id: 'ad_analytics', k: 'reports', icon: BarChart3 },
    { id: 'ad_more', k: 'more', icon: Settings },
  ],
}

/* Admin portal sidebar (web only, D-015). Every id is an `ad_*` screen in registry.jsx. */
export const ADMIN_SIDEBAR = [
  { label: 'Overview', items: [{ id: 'ad_dash', label: 'Dashboard', icon: LayoutDashboard }, { id: 'ad_approvals', label: 'Operational queues', icon: ListChecks }, { id: 'ad_analytics', label: 'Analytics', icon: LineChart }] },
  { label: 'Verification', items: [{ id: 'ad_vendors', label: 'Vendors', icon: Store }, { id: 'ad_listings', label: 'Listings', icon: Layers }, { id: 'ad_company', label: 'Companies', icon: Building }, { id: 'ad_vendor_new', label: 'Add vendor (on hold)', icon: UserPlus }] },
  { label: 'Trust & support', items: [{ id: 'ad_cases', label: 'Cases', icon: Flag }, { id: 'ad_reviews', label: 'Review moderation', icon: Star }] },
  { label: 'People', items: [{ id: 'ad_users', label: 'Users', icon: Users }, { id: 'ad_customers', label: 'Customers', icon: UserRound }, { id: 'ad_agents', label: 'Sales agents', icon: Megaphone }, { id: 'ad_roles', label: 'Roles & permissions', icon: KeyRound }] },
  { label: 'Billing', items: [{ id: 'ad_subs', label: 'Subscriptions', icon: CreditCard }, { id: 'ad_plans', label: 'Plans & entitlements', icon: Percent }, { id: 'ad_sponsored', label: 'Sponsored', icon: Megaphone }, { id: 'ad_coupons', label: 'Coupons (on hold)', icon: Ticket }, { id: 'ad_commission', label: 'Revenue & commission', icon: Percent }] },
  { label: 'Catalogue & markets', items: [{ id: 'ad_categories', label: 'Categories', icon: Tag }, { id: 'ad_taxonomy', label: 'Taxonomy builder', icon: Layers }, { id: 'ad_geo', label: 'Geo rollout', icon: Map }, { id: 'ad_country', label: 'Country packs', icon: Globe2 }] },
  { label: 'Platform', items: [{ id: 'ad_settings', label: 'Settings', icon: SlidersHorizontal }, { id: 'ad_cfg', label: 'Open configuration', icon: ClipboardCheck }, { id: 'ad_audit', label: 'Audit log', icon: ScrollText }] },
]
