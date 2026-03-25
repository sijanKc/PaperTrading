# Geometric Brownian Motion (GBM): The Heart of the Simulator

## 1. What is it?
**Geometric Brownian Motion (GBM)** is the standard mathematical model used by financial analysts and quants to simulate stock prices. It assumes that stock prices follow a "Random Walk" but with a general trend (Drift).

**Code Location:** `backend/utils/priceAlgorithm.js` (Method: `geometricBrownianMotion`)

---

## 2. The Formula
The scary-looking formula is:
$$ S_t = S_0 \cdot e^{(\mu - \frac{\sigma^2}{2})t + \sigma W_t} $$

Or in simple Code Terms:
`NewPrice = OldPrice * exp(Drift + Shock)`

## 3. The Three Key Components (The "Why")

### A. Drift ($\mu$) - The Trend
*   **Concept:** Over the long run, stocks tend to grow (due to inflation and economic growth).
*   **In Your Code:** `annualDrift`
*   **Effect:** This pushes the price **UP** slightly every day. Without this, the stock would just wiggle in place forever.

### B. Volatility ($\sigma$) - The Risk
*   **Concept:** Stocks are shaky. Some days they jump 10%, some days they drop 10%.
*   **In Your Code:** `annualVolatility`
*   **Effect:** This determines how "wild" the price swings are. Use a high number for risky stocks (Hydro), low for safe stocks (Banks).

### C. Random Shock ($W_t$) - The Noise
*   **Concept:** News happens. CEO quits, bad earnings, earthquakes. This is unpredictable.
*   **In Your Code:** `standardNormalRandom()`
*   **Effect:** This adds the pure randomness. It generates a number from a "Bell Curve". Most of the time it's small (quiet day), but sometimes it's huge (market crash or boom).

---

## 4. How It Works in Your Project (Step-by-Step)
Every time the simulator updates (e.g., every 2 minutes):

1.  **Start:** Take current price (e.g., Rs. 500).
2.  **Calculate Drift:** "The market usually goes up 6% a year, so for these 2 minutes, add Rs. 0.05."
3.  **Calculate Shock:** "Roll a dice." (The computer generates a random number).
    *   If roll is +2: Price jumps to Rs. 505.
    *   If roll is -2: Price drops to Rs. 495.
4.  **Result:** The new price is saved.

## 5. Why use GBM instead of `Random(1, 100)`?
If you just used `Math.random()`, prices could jump from 100 to 500 to 20 in seconds. That looks fake.
**GBM ensures:**
*   Prices move continuously (no teleporting).
*   Prices never go below zero (stocks can't have negative price).
*   The math mimics **real** historical stock behavior.
