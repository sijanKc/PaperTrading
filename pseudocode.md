# Pseudocode: Bounded Knapsack Portfolio Optimization

**Algorithm:** Bounded Knapsack Problem (Dynamic Programming)
**Input:** 
*   `Budget`: Total investment amount (e.g., 100,000)
*   `Stocks`: List of available stocks, each with `Price` and `PredictedProfit`
*   `Limit`: Maximum investment allowed per stock (e.g., 10,000)

**Output:**
*   `Portfolio`: List of stocks and quantities to buy to maximize total profit.

---

### Phase 1: Initialization

```text
FUNCTION SolvePortfolio(Budget, Stocks, Limit):
    GET N = Total number of Stocks
    GET W = Budget (converted to integer)

    // Create a 2D Table "DP" of size (N+1) x (W+1) filled with 0
    // DP[i][w] stores the Max Profit using first 'i' stocks with budget 'w'
    INITIALIZE DP[0..N][0..W] = 0

    // Create a 2D Table "Keep" to track quantities for reconstruction
    INITIALIZE Keep[0..N][0..W] = 0
```

### Phase 2: Building the Solution (The Optimization Loop)

```text
    FOR i FROM 1 TO N:
        LET CurrentStock = Stocks[i-1]
        LET Price = CurrentStock.Price
        LET Profit = CurrentStock.PredictedProfit
        
        // Constraint: Calculate max units we can buy of THIS stock
        LET MaxKitta = INT(Limit / Price)

        FOR w FROM 0 TO W:
            // Option 1: Don't buy this stock (Inherit logic from previous step)
            DP[i][w] = DP[i-1][w]
            Keep[i][w] = 0

            // Option 2: Try buying 'k' units (1, 2, ... up to MaxKitta)
            FOR k FROM 1 TO MaxKitta:
                IF (k * Price) <= w:
                    // Profit if we buy k units + Profit of remaining money
                    CurrentVal = DP[i-1][w - (k * Price)] + (k * Profit)

                    // If this choice is better, update our table
                    IF CurrentVal > DP[i][w]:
                        DP[i][w] = CurrentVal
                        Keep[i][w] = k
                    END IF
                END IF
            END FOR
        END FOR
    END FOR
```

### Phase 3: Backtracking (Reconstructing the Portfolio)

```text
    INITIALIZE RecommendedPortfolio = []
    LET RemainingBudget = W

    // Walk backwards from the last stock to the first
    FOR i FROM N DOWN TO 1:
        LET Qty = Keep[i][RemainingBudget]
        
        IF Qty > 0:
            ADD { Stock: Stocks[i-1], Quantity: Qty } to RecommendedPortfolio
            RemainingBudget = RemainingBudget - (Qty * Stocks[i-1].Price)
        END IF
    END FOR

    RETURN RecommendedPortfolio
END FUNCTION
```
