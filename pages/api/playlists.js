// pages/api/playlists.js
// 使用全局 fetch（Next.js / Vercel 环境已提供）

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_VIDEOS_DB_ID = process.env.NOTION_VIDEOS_DB_ID;

export default async function handler(req, res) {
  if (!NOTION_TOKEN || !NOTION_VIDEOS_DB_ID) {
    return res.status(500).json({ error: 'Server not configured: missing NOTION_TOKEN or NOTION_VIDEOS_DB_ID' });
  }

  try {
    const notionUrl = `https://api.notion.com/v1/databases/${NOTION_VIDEOS_DB_ID}/query`;
    const headers = {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    };

    // 取较多条目以收集所有 select 值（若数据很多建议分页）
    const body = { page_size: 100 };
    const notionRes = await fetch(notionUrl, { method: 'POST', headers, body: JSON.stringify(body) });
    if (!notionRes.ok) {
      const text = await notionRes.text();
      return res.status(502).json({ error: 'Notion API error', detail: text });
    }
    const data = await notionRes.json();

    const set = new Set();
    (data.results || []).forEach(page => {
      // 兼容两种可能的字段名：play_lists 或 paly_lists
      const candidates = [page.properties?.play_lists, page.properties?.paly_lists];
      for (const prop of candidates) {
        if (!prop) continue;
        if (prop.select && prop.select.name) set.add(prop.select.name);
        if (Array.isArray(prop.multi_select)) prop.multi_select.forEach(s => s?.name && set.add(s.name));
        if (Array.isArray(prop.rich_text) && prop.rich_text.length) {
          const txt = prop.rich_text.map(t => t.plain_text).join('').trim();
          if (txt) set.add(txt);
        }
      }
    });

    const playlists = Array.from(set).map(name => ({ name }));
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    return res.status(200).json({ playlists });
  } catch (err) {
    console.error('playlists api error:', err);
    return res.status(500).json({ error: 'server error', detail: err?.message || String(err) });
  }
}