/**
 * 是否静态导出；或ISR动态站点
 */
function isExport() {
  return process.env.EXPORT === 'false'
}

module.exports = { isExport }
