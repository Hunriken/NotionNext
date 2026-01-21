import crypto from 'crypto'

export default function handler(req, res) {
  const { file } = req.query

  if (!file) {
    return res.status(400).json({ error: 'Missing file parameter' })
  }

  const accessKey = process.env.R2_ACCESS_KEY_ID
  const secretKey = process.env.R2_SECRET_ACCESS_KEY
  const endpoint = process.env.R2_PUBLIC_ENDPOINT

  // 5 分钟有效期
  const expires = Math.floor(Date.now() / 1000) + 60 * 5

  // ❗ 你的自定义域名已经映射到 bucket 根目录
  const path = `/${file}`

  const stringToSign = `GET\n\n\n${expires}\n${path}`

  const signature = crypto
    .createHmac('sha1', secretKey)
    .update(stringToSign)
    .digest('base64')

  // ❗ 不要再拼 bucket 名
  const signedUrl = `${endpoint}/${file}?AWSAccessKeyId=${accessKey}&Expires=${expires}&Signature=${encodeURIComponent(signature)}`

  res.status(200).json({ url: signedUrl })
}
