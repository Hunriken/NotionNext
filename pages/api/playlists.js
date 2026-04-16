// pages/api/playlists.js
// 使用全局 fetch（Next.js / Vercel 环境已提供），不要引入 node-fetch

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_VIDEOS_DB_ID = process.env.NOTION_VIDEOS_DB_ID;

export default async function handler(req, res) {
  if (!NOTION_TOKEN || !NOTION_VIDEOS_DB_ID) {
    return res.status(500).json({ error: 'Server not configured: missing NOTION_TOKEN or NOTION_VIDEOS_DB_ID' });
  }

  try {
    // 查询数据库（一次性取较多条目，若条目很多建议改为分页）
    const notionRes = await fetch(`https://api.notion.com/v1/databases/${NOTION_VIDEOS_DB_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ page_size: 100 })
    });

    if (!notionRes.ok) {
      const text = await notionRes.text();
      return res.status(502).json({ error: 'Notion API error', detail: text });
    }

    const data = await notionRes.json();

    // 从每条记录中收集 paly_lists 的 select 值（去重）
    const set = new Set();
    (data.results || []).forEach(page => {
      const prop = page.properties?.paly_lists;
      if (!prop) return;

      // 处理 Select 类型
      if (prop.select && prop.select.name) {
        set.add(prop.select.name);
      }

      // 处理 Multi-select 类型
      if (Array.isArray(prop.multi_select)) {
        prop.multi_select.forEach(s => s?.name && set.add(s.name));
      }

      // 兼容：有时字段以 rich_text 存储（不常见）
      if (Array.isArray(prop.rich_text) && prop.rich_text.length) {
        const txt = prop.rich_text.map(t => t.plain_text).join('').trim();
        if (txt) set.add(txt);
      }
    });

    const playlists = Array.from(set).map(name => ({ name }));

    // 缓存头：Vercel edge cache / ISR 风格
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    return res.status(200).json({ playlists });
  } catch (err) {
    console.error('playlists api error:', err);
    return res.status(500).json({ error: 'server error', detail: err?.message || String(err) });
  }
}