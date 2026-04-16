// pages/api/videos.js
// 使用全局 fetch（Next.js / Vercel 环境已提供），不要引入 node-fetch

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_VIDEOS_DB_ID = process.env.NOTION_VIDEOS_DB_ID;

export default async function handler(req, res) {
  if (!NOTION_TOKEN || !NOTION_VIDEOS_DB_ID) {
    return res.status(500).json({ error: 'Server not configured: missing NOTION_TOKEN or NOTION_VIDEOS_DB_ID' });
  }

  const { playlist, page_size = 100 } = req.query;

  try {
    const body = { page_size: Number(page_size) || 100 };

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

    const videos = (data.results || []).map(page => {
      // 标题字段 video_list（Title 类型）
      const titleProp = page.properties?.video_list;
      let name = 'Untitled';
      if (titleProp) {
        if (Array.isArray(titleProp.title) && titleProp.title.length) {
          name = titleProp.title.map(t => t.plain_text).join('') || name;
        } else if (Array.isArray(titleProp.rich_text) && titleProp.rich_text.length) {
          name = titleProp.rich_text.map(t => t.plain_text).join('') || name;
        }
      }

      // video_url 字段（你选择 Text 存对象键），Notion API 可能返回 rich_text 数组或 text.content
      const urlProp = page.properties?.video_url;
      let fileKey = null;

      if (urlProp) {
        // 如果是 URL 类型（意外情况），直接取 url
        if (urlProp.type === 'url' && urlProp.url) {
          fileKey = urlProp.url;
        }
        // rich_text 数组（Text 类型常见）
        else if (Array.isArray(urlProp.rich_text) && urlProp.rich_text.length) {
          fileKey = urlProp.rich_text.map(t => t.plain_text).join('').trim();
        }
        // 兼容旧结构
        else if (urlProp?.text?.content) {
          fileKey = String(urlProp.text.content).trim();
        }
        // 兼容直接存在 plain_text（极少见）
        else if (typeof urlProp === 'string' && urlProp.trim()) {
          fileKey = urlProp.trim();
        }
      }

      return { id: page.id, name, file: fileKey };
    }).filter(v => v.file); // 过滤掉没有 file 的记录

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    return res.status(200).json({ videos });
  } catch (err) {
    console.error('videos api error:', err);
    return res.status(500).json({ error: 'server error', detail: err?.message || String(err) });
  }
}