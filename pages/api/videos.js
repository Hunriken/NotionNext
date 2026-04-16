// pages/api/videos.js
import fetch from 'node-fetch';

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_VIDEOS_DB_ID = process.env.NOTION_VIDEOS_DB_ID;

export default async function handler(req, res) {
  if (!NOTION_TOKEN || !NOTION_VIDEOS_DB_ID) {
    return res.status(500).json({ error: 'Server not configured' });
  }

  const { playlist, page_size = 100 } = req.query;

  try {
    const body = { page_size: Number(page_size) };
    if (playlist) {
      // 过滤 Select 字段 paly_lists 等于 playlist 名称
      body.filter = {
        property: 'paly_lists',
        select: { equals: playlist }
      };
    }

    const notionRes = await fetch(`https://api.notion.com/v1/databases/${NOTION_VIDEOS_DB_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!notionRes.ok) {
      const text = await notionRes.text();
      return res.status(502).json({ error: 'Notion API error', detail: text });
    }

    const data = await notionRes.json();

    const videos = data.results.map(page => {
      const titleProp = page.properties?.video_list;
      const urlProp = page.properties?.video_url; // 你存的是对象键，如 "beta_app/xxx.mp4"（Text）
      const name = Array.isArray(titleProp?.title) && titleProp.title.length
        ? titleProp.title.map(t => t.plain_text).join('')
        : (titleProp?.rich_text?.[0]?.plain_text || 'Untitled');

      // 如果你把对象键存在 text 字段，Notion API 返回可能在 urlProp?.rich_text 或 urlProp?.text
      let fileKey = null;
      if (urlProp) {
        if (urlProp.type === 'url' && urlProp.url) fileKey = urlProp.url;
        else if (Array.isArray(urlProp.rich_text) && urlProp.rich_text.length) fileKey = urlProp.rich_text.map(t => t.plain_text).join('');
        else if (urlProp.rich_text === undefined && urlProp?.text?.content) fileKey = urlProp.text.content;
      }

      // 兼容：如果数据库里误填了完整 URL，也保留
      return { id: page.id, name, file: fileKey };
    }).filter(v => v.file);

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    return res.status(200).json({ videos });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error', detail: err.message });
  }
}