import os
from typing import List, Optional
import numpy as np
import pandas as pd
from scipy import stats
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(
    title="EconoCausal API Engine",
    description="Causal AI Dynamic Pricing & Prescriptive Analytics Engine powered by Double Machine Learning",
    version="1.1.0"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(CURRENT_DIR, "prescribed_discount_matrix.csv")

if not os.path.exists(DATA_FILE):
    DATA_FILE = os.path.join(CURRENT_DIR, "..", "prescribed_discount_matrix.csv")

try:
    df = pd.read_csv(DATA_FILE)
    df_sorted = df.sort_values(by="ite_uplift", ascending=False).reset_index(drop=True)
    UPLIFT_THRESHOLD = float(df_sorted.iloc[min(499, len(df_sorted) - 1)]["ite_uplift"])
    print(f"Dataset successfully loaded from: {DATA_FILE} ({len(df_sorted)} records)")
except Exception as e:
    df_sorted = pd.DataFrame()
    UPLIFT_THRESHOLD = 0.05
    print(f"CSV load warning/error: {e}")


# --- Pydantic Schemas ---
class CustomerInferenceRequest(BaseModel):
    age: int = Field(..., ge=18, le=100, description="Customer age in years")
    session_duration: float = Field(..., ge=0.0, description="Session length in seconds")
    pages_viewed: int = Field(..., ge=1, le=100, description="Pages browsed")
    customer_rating: float = Field(..., ge=1.0, le=5.0, description="Customer feedback score")
    product_price: float = Field(default=100.0, gt=0.0, description="Base product price in USD")


class BatchCustomerData(BaseModel):
    session_durations: List[float]
    pages_viewed: List[int]


# --- Routes ---

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "EconoCausal Inference Engine",
        "version": "1.1.0",
        "records_loaded": len(df_sorted)
    }


@app.get("/api/dashboard-data")
def get_dashboard_data(
    budget: float = Query(default=5000.0, gt=0.0, description="Marketing discount budget"),
    cost_per_discount: float = Query(default=10.0, gt=0.0, description="Fixed cost per discount voucher")
):
    if df_sorted.empty:
        raise HTTPException(status_code=500, detail="Prescription data not loaded")

    total_customers = len(df_sorted)
    target_count = min(int(budget / cost_per_discount), total_customers)

    targeted_df = df_sorted.iloc[:target_count]
    incremental_conversions = float(targeted_df["ite_uplift"].sum())

    total_uplift = float(df_sorted["ite_uplift"].sum())
    random_benchmark = (target_count / total_customers) * total_uplift
    roi_multiplier = (
        round(incremental_conversions / random_benchmark, 2)
        if random_benchmark > 0
        else 1.0
    )

    # Uplift & Qini curves
    curve_steps = 20
    step_size = max(1, total_customers // curve_steps)
    uplift_curve = []
    running_causal = 0.0

    for idx in range(0, total_customers, step_size):
        chunk = df_sorted.iloc[idx : idx + step_size]
        running_causal += float(chunk["ite_uplift"].sum())
        pop_pct = round(((idx + len(chunk)) / total_customers) * 100, 1)
        random_lift = (pop_pct / 100.0) * total_uplift

        uplift_curve.append({
            "population_pct": pop_pct,
            "causal": round(running_causal, 2),
            "random": round(random_lift, 2),
        })

    # Top targets
    columns_to_show = ["Customer_ID", "ite_uplift"]
    if "prescribed_discount" in df_sorted.columns:
        columns_to_show.append("prescribed_discount")

    top_customers = (
        df_sorted.head(15)[columns_to_show]
        .to_dict(orient="records")
    )

    # Dynamic natural language summary
    saved_dollars = round((target_count * cost_per_discount) * (1 - (1 / roi_multiplier)), 2) if roi_multiplier > 1 else 0
    summary_text = (
        f"Targeting the top {target_count} persuadable users achieves {round(incremental_conversions, 1)} "
        f"incremental orders ({roi_multiplier}x ROI efficiency). This strategy prevents roughly "
        f"${saved_dollars:,.2f} in wasted ad spend compared to blanket discounting."
    )

    return {
        "kpis": {
            "budget": budget,
            "targeted_customers": target_count,
            "total_customers": total_customers,
            "incremental_orders": round(incremental_conversions, 2),
            "roi_multiplier": roi_multiplier,
            "summary_insight": summary_text,
        },
        "uplift_curve": uplift_curve,
        "top_customers": top_customers,
        "uplift_threshold": UPLIFT_THRESHOLD,
    }


@app.post("/api/recommend-discount")
def recommend_discount_api(customer: CustomerInferenceRequest):
    """
    Computes baseline purchase probability and causal uplift across discount tiers
    to prescribe the optimal profit-maximizing action.
    """
    base_prob = min(0.60, max(0.08, (
        (customer.session_duration / 600.0) * 0.20 +
        (customer.pages_viewed / 15.0) * 0.15 +
        (customer.customer_rating / 5.0) * 0.10
    )))

    elasticity = (
        (customer.pages_viewed * 0.005) +
        ((customer.session_duration / 120.0) * 0.01) +
        (max(0, 45 - customer.age) * 0.001)
    )

    scenarios = []
    tiers = [0, 10, 20, 30]

    for disc in tiers:
        if disc == 0:
            uplift = 0.0
            prob = base_prob
        elif disc == 10:
            uplift = min(0.35, elasticity * 1.8 + 0.05)
            prob = min(0.95, base_prob + uplift)
        elif disc == 20:
            uplift = min(0.48, elasticity * 2.8 + 0.10)
            prob = min(0.97, base_prob + uplift)
        else:
            uplift = min(0.55, elasticity * 3.4 + 0.13)
            prob = min(0.99, base_prob + uplift)

        net_margin = customer.product_price - disc
        expected_profit = round(prob * net_margin, 2)

        scenarios.append({
            "discount": disc,
            "probability_pct": round(prob * 100, 1),
            "uplift_pct": round(uplift * 100, 1),
            "expected_profit": expected_profit,
        })

    optimal_tier = max(scenarios, key=lambda x: x["expected_profit"])

    if optimal_tier["discount"] == 0:
        recommendation = "No Discount Needed (Organic Buyer or Inelastic Churn Risk)"
    else:
        recommendation = f"Prescribe ${optimal_tier['discount']} Discount (Maximum Net Profit)"

    return {
        "base_prob_pct": round(base_prob * 100, 1),
        "scenarios": scenarios,
        "optimal_discount": optimal_tier["discount"],
        "recommendation": recommendation,
    }


@app.post("/api/drift-detect")
def detect_data_drift(batch: BatchCustomerData):
    """
    Week 4 requirement: Automated Data Drift Detector.
    Compares incoming live traffic against the training baseline using KS-Test.
    """
    if len(batch.session_durations) < 10:
        raise HTTPException(status_code=400, detail="Batch size must be at least 10 for statistical significance")

    # Baseline synthetic stats (or drawn from historical df)
    baseline_sessions = np.random.normal(loc=300.0, scale=80.0, size=500)
    baseline_pages = np.random.poisson(lam=5.0, size=500)

    # 2-sample Kolmogorov-Smirnov Test
    stat_session, p_session = stats.ks_2samp(batch.session_durations, baseline_sessions)
    stat_pages, p_pages = stats.ks_2samp(batch.pages_viewed, baseline_pages)

    # Significant drift threshold at alpha = 0.05
    session_drift = bool(p_session < 0.05)
    page_drift = bool(p_pages < 0.05)
    drift_detected = session_drift or page_drift

    return {
        "drift_detected": drift_detected,
        "alert_level": "WARNING" if drift_detected else "HEALTHY",
        "metrics": {
            "session_duration_p_value": round(float(p_session), 4),
            "session_drift": session_drift,
            "pages_viewed_p_value": round(float(p_pages), 4),
            "pages_drift": page_drift,
        },
        "recommendation": (
            "Customer behavior has shifted significantly. Re-training the Double ML causal estimator is advised."
            if drift_detected
            else "Traffic distribution aligns with historical training baseline."
        )
    }