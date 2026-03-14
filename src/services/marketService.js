export const fetchMarketData = async () => {
  try {
    const res = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT')
    const data = await res.json()
    return {
      price: parseFloat(data.lastPrice),
      change: parseFloat(data.priceChangePercent),
      high: parseFloat(data.highPrice),
      low: parseFloat(data.lowPrice),
      volume: parseFloat(data.volume)
    }
  } catch (error) {
    console.error('Market data fetch failed:', error)
    return {
      price: 64250,
      change: 1.23,
      high: 65000,
      low: 63500,
      volume: 25000000
    }
  }
}