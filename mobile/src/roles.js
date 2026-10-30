import {
  Home, Compass, ClipboardList, MessageCircle, User, LayoutDashboard, Briefcase, Package, MoreHorizontal, Users, CalendarClock,
  TrendingUp, Building2, ShoppingCart, Wallet,
} from 'lucide-react'

export const ROLES = [
  { id: 'customer', label: 'Customer', short: 'Customer' },
  { id: 'vendor', label: 'Vendor', short: 'Vendor' },
  { id: 'agent', label: 'Sales Agent', short: 'Agent' },
  { id: 'business', label: 'Business', short: 'Business' },
]

/* The admin portal is web-only (D-015): no admin role exists in the mobile app. */
export const VISIBLE_ROLES = ROLES

/* Business is a separate account type (company owners only) - it never shares a vendor identity */
export const vendorSide = (me) => me.role === 'vendor'

export const HOME = { customer: 'c_home', vendor: 'v_dash', agent: 'a_home', business: 'b_home' }

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
}

