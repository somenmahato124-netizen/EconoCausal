# 📈 EconoCausal: Dynamic Pricing via Double Machine Learning

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://reactjs.org/)
[![EconML](https://img.shields.io/badge/Causal%20AI-EconML%20%7C%20DoWhy-orange)](https://github.com/py-why/EconML)
[![Status](https://img.shields.io/badge/Status-Completed-success.svg)](#)

> **Industry Domain:** Economics, E-Commerce & Causal Machine Learning  
> **Role:** Data Associate L1 Intern — Data Science & Machine Learning  
> **Organization:** Infotact Solutions  

---

## 📌 Executive Summary & Problem Statement

Standard predictive Machine Learning (ML) architectures model **correlation**, not **causation**. In customer retention and dynamic pricing campaigns, traditional models predict churn risk and often issue blanket discounts (e.g., \$20 coupons) to high-risk customers. 

This causes massive marketing inefficiency:
1. **Sure Things / Organic Buyers:** Customers who would complete their purchases regardless, resulting in wasted budget.
2. **Lost Causes:** Disengaged customers who will churn even if offered a voucher.
3. **Sleeping Dogs:** Customers whose purchasing decisions are negatively impacted by marketing contact.

**EconoCausal** transforms predictive churn pipelines into actionable, prescriptive decision systems. Utilizing **Double/Debiased Machine Learning (DML)** alongside Causal Graph architectures, the platform computes the **Individual Treatment Effect (ITE)** to isolate **Persuadables**—customers whose purchase likelihood increases strictly due to a targeted discount tier ($0, $10, $20, or $30).

---

## 🏛️ System Architecture

```text
       ┌────────────────────────┐
       │ Observational Dataset  │ (Customer demographics, browsing sessions, loyalty)
       └───────────┬────────────┘
                   ▼
       ┌────────────────────────┐
       │   Causal Graph (DAG)   │ (Confounder control & identification via DoWhy)
       └───────────┬────────────┘
                   ▼
       ┌────────────────────────┐
       │  Double ML Estimator   │ (EconML: First-stage residualization + Causal Forest)
       └───────────┬────────────┘
                   ▼
       ┌────────────────────────┐
       │   Refutation Audits    │ (Placebo tests & random common cause validation)
       └───────────┬────────────┘
                   ▼
       ┌────────────────────────┐
       │ Prescriptive Optimizer │ (SciPy: Revenue maximization under strict budget)
       └───────────┬────────────┘
                   ▼
       ┌────────────────────────┐
       │ FastAPI & React UI     │ (Interactive Qini curves, discount prescriptions & drift alerts)
       └────────────────────────┘


🚀 Key Modules & Capabilities

Causal Graph Modeling (DoWhy): Directed Acyclic Graph (DAG) definition to explicitly model confounding variables (e.g., browsing history, income segment, customer ratings) and verify unconfoundedness.

Double Machine Learning Engine (EconML): Implementation of DML with orthogonalization to purge regularized nuisance estimates, delivering unbiased heterogeneous treatment effects (ITE).

Causal Refutation Audits: Statistical validation utilizing Placebo Treatment and Random Common Cause refutations to mathematically confirm that the causal signal is robust against hidden bias.

Prescriptive Optimization (SciPy): Constrained optimization solver assigning personalized discount vouchers that maximize net margin subject to strict campaign budget constraints.

Real-Time Inference REST API (FastAPI): Endpoints serving dashboard analytics, dynamic uplift scenario simulations, and prescriptive customer recommendations.

Automated Data Drift Detection: KS-Test statistical monitoring tracking incoming live feature distributions and alerting when behavioral drift necessitates model retraining.

Interactive Decision Dashboard (React + Vite + Tailwind CSS): Visual experimentation interface displaying Qini/Uplift curves, budget sliders, and prescription matrices.


📂 Project Structure
EconoCausal/
├── README.md                                 # Complete project documentation
├── requirements.txt                          # Top-level dependencies
├── backend/
│   ├── main.py                               # FastAPI inference & drift detection engine
│   ├── prescribed_discount_matrix.csv        # Pre-calculated customer prescription matrix
│   ├── requirements.txt                      # Backend service dependencies
│   └── uplift_curve_evaluation.png           # Evaluated uplift performance chart
├── data/
│   ├── raw/                                  # Raw observational e-commerce dataset
│   └── processed/                            # Cleaned and feature-engineered causal dataset
├── frontend/
│   ├── index.html                            # Frontend entry point
│   ├── package.json                          # Node dependencies
│   ├── vite.config.js                        # Vite build configuration
│   ├── tailwind.config.js                    # Tailwind styling configuration
│   └── src/
│       ├── App.jsx                           # Core dashboard, uplift curves & optimizer UI
│       └── main.jsx                          # React application root
└── notebooks/
    └── econocausal_full_pipeline.ipynb       # End-to-end causal pipeline (DAG -> DML -> Refutation)
