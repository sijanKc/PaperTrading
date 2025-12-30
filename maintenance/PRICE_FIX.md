# Fix Stock Price Changes

## Problem
Stock prices show 0.00% change because `previousClose` is updated every 2 minutes.

## Solution
In `backend/utils/priceAlgorithm.js` line 126, **DELETE** this line:
```javascript
previousClose: stock.currentPrice,
```

And **ADD** these two lines after `currentPrice: newPrice,`:
```javascript
change: newPrice - stock.previousClose,
changePercent: ((newPrice - stock.previousClose) / stock.previousClose) * 100,
```

## Full Code (lines 124-137)
Replace lines 124-137 with:
```javascript
          // Update stock
          await Stock.findByIdAndUpdate(stock._id, {
            currentPrice: newPrice,
            change: newPrice - stock.previousClose,
            changePercent: ((newPrice - stock.previousClose) / stock.previousClose) * 100,
            dayHigh: Math.max(stock.dayHigh || newPrice, newPrice),
            dayLow: Math.min(stock.dayLow || newPrice, newPrice),
            volume: stock.volume + volumeIncrease,
            $push: {
              priceHistory: {
                price: newPrice,
                timestamp: new Date()
              }
            }
          });
```

## Result
✅ Prices will change every 2 minutes
✅ Percentage will show change from start of day
✅ You'll see: `📈 NABIL: ₹255 → ₹258 (+1.18%)`
