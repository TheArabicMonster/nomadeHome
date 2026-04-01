export type NavLink = {
	label: string
	href: string
	enabled: boolean
}

export const DASHBOARD_NAV_LINKS: NavLink[] = [
	{ label: "DASHBOARD", href: "/dashboard", enabled: true },
	{ label: "TERMINAL", href: "/dashboard/terminal", enabled: true },
	{ label: "ANKI", href: "/dashboard/anki", enabled: true },
	{ label: "MANGA FEED", href: "/dashboard/uploads", enabled: true },
	{ label: "NETWORK", href: "#", enabled: false },
	{ label: "SETTINGS", href: "#", enabled: false },
]

export const ENABLED_DASHBOARD_NAV_LINKS = DASHBOARD_NAV_LINKS.filter(
	(link) => link.enabled,
)