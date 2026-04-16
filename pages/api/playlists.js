// pages/api/playlists.js
import fetch from 'node-fetch';

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_VIDEOS_DB_ID = process.env.NOTION_VIDEOS_DB_ID;

export default async function handler(req, res) {
  if (!NOTION_TOKEN || !NOTION_VIDEOS_DB_ID) {
    return res.status(500).json({ error: 'Server not configured' });
  }

  try {
    // 查询数据库，取 page_size 较大以获取所有条目（可按需调整或改为聚合）
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
    data.results.forEach(page => {
      const sel = page.properties?.paly_lists;
      if (sel && sel.select && sel.select.name) {
        set.add(sel.select.name);
      } else if (sel && sel.multi_select && Array.isArray(sel.multi_select)) {
        sel.multi_select.forEach(s => s.name && set.add(s.name));
      }
    });

    const playlists = Array.from(set).map(name => ({ name }));

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    return res.status(200).json({ playlists });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error', detail: err.message });
  }
}