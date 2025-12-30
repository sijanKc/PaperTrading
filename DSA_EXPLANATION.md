# Project DSA Implementation: Technical Analysis Engine

**Author/Submitter:** [Your Name]
**Algorithm Focus:** Sliding Window & Mathematical Modeling

---

## 1. Requirement & Problem Statement
In a real-time trading environment, calculating technical indicators (like Moving Averages) across thousands of data points can become a performance bottleneck.
*   **Initial Problem:** Recalculating the average of the last $K$ data points for every timestamp $N$ leads to a time complexity of $O(N \times K)$.
*   **The Goal:** Optimize the calculation to ensure real-time responsiveness.

## 2. Selected Algorithm: Sliding Window
I implemented the **Sliding Window algorithm** to calculate the **Simple Moving Average (SMA)**.

### Why Sliding Window?
Instead of summing all elements in the window every time, the algorithm maintains a **running sum**. 
*   **Logic:** $NewSum = OldSum - OldestElement + NewestElement$
*   **Time Complexity:** 
    *   Initialization: $O(K)$
    *   Processing: $O(N - K)$
    *   **Total: $O(N)$** (Linear Time)
*   **Space Complexity:** $O(N)$ to store the result array.

## 3. Implementation Details
The algorithm is encapsulated in `backend/utils/technicalAnalysis.js`.

```javascript
static calculateSMA(prices, period) {
    let windowSum = 0;
    // ... initial O(K) sum ...
    for (let i = period; i < prices.length; i++) {
        // Optimization: Standard Sliding Window Logic
        windowSum = windowSum - prices[i - period] + prices[i];
        smas.push(windowSum / period);
    }
}
```

## 4. Practical Application
This algorithm powers the **Real-time Analytics API** available at `/api/market/analytics/:symbol`. It provides:
1.  **SMA (Simple Moving Average):** Trend identification.
2.  **RSI (Relative Strength Index):** Momentum measurement using smoothed gains/losses.

## 5. Summary for Supervisor
By choosing the **Sliding Window algorithm**, I have optimized the system's "analytic brain." This ensures that as the stock price history grows, the platform remains fast and scalable, utilizing $O(N)$ efficiency which is the theoretical limit for this problem.
