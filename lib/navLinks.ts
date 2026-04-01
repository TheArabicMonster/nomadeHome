export type NavLink = {
	label: string
	href: string
	enabled: boolean
	icon: string
}

export const DASHBOARD_NAV_LINKS: NavLink[] = [
	{ label: "DASHBOARD", href: "/dashboard", enabled: true, icon: "/icons/dashboard.svg" },
	{ label: "TERMINAL", href: "/dashboard/terminal", enabled: true, icon: "/icons/terminal.svg" },
	{ label: "ANKI", href: "/dashboard/anki", enabled: true, icon: "/icons/anki.svg" },
	{ label: "TWITCH BOT", href: "/dashboard/twitch-bot", enabled: true, icon: "/icons/twitch-bot.svg" },
	{ label: "MANGA FEED", href: "/dashboard/uploads", enabled: true, icon: "/icons/manga-feed.svg" },
	{ label: "NETWORK", href: "#", enabled: false, icon: "/icons/network.svg" },
	{ label: "SETTINGS", href: "#", enabled: false, icon: "/icons/settings.svg" },
	{ label: "DISCONNECT", href: "#", enabled: true, icon: "/icons/disconnect.svg" },
]

export const ENABLED_DASHBOARD_NAV_LINKS = DASHBOARD_NAV_LINKS.filter(
	(link) => link.enabled,
)