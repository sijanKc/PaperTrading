# DSA Project Implementation: Portfolio Optimization Engine

**Algorithm Implemented:** Bounded Knapsack Algorithm (Dynamic Programming)
**Category:** Optimization & Decision Making

---

## 1. Problem Statement
In a stock trading environment, an investor often has a limited budget (Knapsack Capacity). However, real-world trading platforms impose rules like **"Maximum Investment per Stock"** (e.g., Rs. 10,000) to ensure diversification and risk management.

The goal is to find the combination of stocks that yields the **maximum total predicted profit** while:
1. Staying within the **Total Budget**.
2. Respecting the **Max limit per Stock**.

## 2. Algorithm Detail: Bounded Dynamic Programming
I implemented the **Bounded Knapsack** variant using a 2D Dynamic Programming table.

### The DP State Relation
Let `dp[i][w]` be the maximum profit using the first `i` stocks with a budget `w`.
The recurrence relation used is:
`dp[i][w] = max(dp[i-1][w - k * price] + k * value)` 
where `k` is the number of units, bounded by `floor(10000 / price)`.

### Why Bounded Knapsack?
*   **Business Compliance**: Directly enforces the Rs. 10,000 per stock trading rule.
*   **Risk Mitigation**: Prevents the algorithm from "all-in" on a single stock, encouraging a diversified portfolio.
*   **Optimal Substructure**: Maintains the DP advantage of solving complex global optimizations by combining optimal local decisions.

## 3. Technical Specifications
*   **Time Complexity**: $O(W \times N \times K)$
    *   $W$ = Total budget (Capacity)
    *   $N$ = Number of stocks
    *   $K$ = Maximum units allowed per stock (the "Bound")
*   **Space Complexity**: $O(W \times N)$ using a 2D state table for precise backtracking.
*   **File Location**: `backend/utils/technicalAnalysis.js` (Method: `solveKnapsack`)

## 4. Practical Implementation
In this project, the "Bound" is dynamically fetched from the platform's **`TradingRule`** configuration. This makes the algorithm highly flexible—if the admin changes the "Per Trade Limit" to Rs. 50,000, the AI advisor automatically adapts its mathematical model.

## 5. Summary for Supervisor
While an "Unbounded" knapsack is a classic academic problem, the **Bounded Knapsack** implementation demonstrates a higher level of software engineering by integrating **Business Logic** with **Advanced Algorithms**. It shows the ability to translate project-specific constraints into a robust mathematical model.
