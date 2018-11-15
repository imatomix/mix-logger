const { performance, PerformanceObserver } = require('perf_hooks')

const yellow = '\u001b[33m'
const bold = '\033[1m'
const reset = '\u001b[0m'

module.exports = (options) => (req, res) => {
  performance.mark('logger start')
  process.stdout.write('\n' + bold + req.method + reset + ' ' + req.url + '\n')
  res.on('finish', () => {
    performance.mark('logger end')
    performance.measure('logging', 'logger start', 'logger end')
    process.stdout.write(yellow + res.statusCode + reset + ' ')
  })
}

const obs = new PerformanceObserver((list) => {
  process.stdout.write('+' + list.getEntriesByName('logging')[0].duration.toFixed(2) + 'ms ')
  process.stdout.write('[' + (process.memoryUsage()['rss'] / 1024 / 1024).toFixed(2) + 'MB] \n')
  performance.clearMarks()
})

obs.observe({ entryTypes: ['measure'], buffered: true })