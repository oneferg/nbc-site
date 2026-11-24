const channel = "UCFffbJ41yFUhO_Lb2yOC9aQ";

module.exports = async function () {
	try {
		const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channel}`);
		const xml = await res.text();
		return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([, e]) => {
			const pick = (re) => (e.match(re) || [])[1] || "";
			let title = pick(/<title>([^<]*)<\/title>/)
				.replace(/&amp;/g, "&")
				.replace(/&quot;/g, '"')
				.replace(/&#39;/g, "'")
				.replace(/\s*-\s*\[New Beginnings In Christ[^\]]*\]\s*/i, "")
				.replace(/[\p{Extended_Pictographic}\p{Emoji_Modifier}‍️￼]/gu, "")
				.replace(/\s{2,}/g, " ")
				.trim();
			title = title.replace(/^[“”"\s]+|[“”"\s]+$/g, "");
			if (title === title.toUpperCase()) title = title.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase());
			if (!title || /^[A-Z][a-z]+ \d{1,2},? \d{4}$/.test(title) || /^live stream$/i.test(title) || /^go live$/i.test(title)) title = "Worship Service";
			const published = new Date(pick(/<published>([^<]*)<\/published>/));
			return {
				id: pick(/<yt:videoId>([^<]*)<\/yt:videoId>/),
				title,
				date: published.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
			};
		});
	} catch {
		return [];
	}
};
