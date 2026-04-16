// pages/api/videos.js
// 使用全局 fetch（Next.js / Vercel 环境已提供）
// 兼容 play_lists / paly_lists 字段名，先尝试 select equals，再尝试 multi_select contains

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_VIDEOS_DB_ID = process.env.NOTION_VIDEOS_DB_ID;

export default async function handler(req, res) {
  if (!NOTION_TOKEN || !NOTION_VIDEOS_DB_ID) {
    return res.status(500).json({ error: 'Server not configured: missing NOTION_TOKEN or NOTION_VIDEOS_DB_ID' });
  }

  const { playlist, page_size = 100 } = req.query;
  const notionUrl = `https://api.notion.com/v1/databases/${NOTION_VIDEOS_DB_ID}/query`;
  const headers = {
    'Authorization': `Bearer ${NOTION_TOKEN}`,
    'Notion-Version': '2022-06-28',
    'Content-Type': 'application/json'
  };

  try {
    let data = null;

    // Helper to query Notion with a body
    async function queryNotion(bodyObj) {
      const r = await fetch(notionUrl, { method: 'POST', headers, body: JSON.stringify(bodyObj) });
      if (!r.ok) {
        const t = await r.text();
        throw new Error('Notion API error: ' + t);
      }
      return r.json();
    }

    if (playlist) {
      const trimmed = String(playlist).trim();

      // Try both possible property names and both select/multi_select strategies
      const propertyNames = ['play_lists', 'paly_lists'];

      for (const propName of propertyNames) {
        // 1) try select equals
        let body = { page_size: Number(page_size), filter: { property: propName, select: { equals: trimmed } } };
        data = await queryNotion(body);
        if ((data.results || []).length > 0) break;

        // 2) try multi_select contains
        body = { page_size: Number(page_size), filter: { property: propName, multi_select: { contains: trimmed } } };
        data = await queryNotion(body);
        if ((data.results || []).length > 0) break;

        // 3) try rich_text contains (fallback)
        body = {
          page_size: Number(page_size),
          filter: {
            property: propName,
            rich_text: { contains: trimmed }
          }
        };
        data = await queryNotion(body);
        if ((data.results || []).length > 0) break;
      }

      // If still no results, set data to empty structure
      if (!data) data = { results: [] };
    } else {
      // No playlist param: return all (first page)
      data = await queryNotion({ page_size: Number(page_size) });
    }

    // Parse results into videos array
    const videos = (data.results || []).map(page => {
      // 标题字段 video_list（Title 类型）
      const titleProp = page.properties?.video_list;
      let name = 'Untitled';
      if (titleProp) {
        if (Array.isArray(titleProp.title) && titleProp.title.length) {
          name = titleProp.title.map(t => t.plain_text).join('') || name;
        } else if (Array.isArray(titleProp.rich_text) && titleProp.rich_text.length) {
          name = titleProp.rich_text.map(t => t.plain_text).join('') || name;
        } else if (titleProp?.plain_text) {
          name = titleProp.plain_text || name;
        }
      }

      // video_url 字段（Text 存对象键），Notion API 可能返回 rich_text 数组或 text.content 或 url
      const urlProp = page.properties?.video_url;
      let fileKey = null;

      if (urlProp) {
        if (urlProp.type === 'url' && urlProp.url) {
          fileKey = urlProp.url;
        } else if (Array.isArray(urlProp.rich_text) && urlProp.rich_text.length) {
          fileKey = urlProp.rich_text.map(t => t.plain_text).join('').trim();
        } else if (urlProp?.text?.content) {
          fileKey = String(urlProp.text.content).trim();
        } else if (typeof urlProp === 'string' && urlProp.trim()) {
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