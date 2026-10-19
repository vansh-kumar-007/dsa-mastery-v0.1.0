# DEPLOYMENT.md — ₹0-Cost Deployment, Quotas, & Rollback Guide

## 1. Verified Free-Tier Provider Comparison

| Provider | Free Plan Quotas (Verified) | SPA Routing Support | Credit Card Required? | Official Documentation |
| :--- | :--- | :--- | :--- | :--- |
| **Cloudflare Pages** *(Primary)* | **1 concurrent build**, **500 builds/month**, **20,000 files/site**, **25 MiB max file size**, **100 custom domains/project**, unlimited static bandwidth | Native via `public/_redirects` (`/* /index.html 200`) | **No** | [Cloudflare Pages Limits](https://developers.cloudflare.com/pages/platform/limits/) |
| **GitHub Pages** *(Secondary)* | **1 GB max site size**, **100 GB/month soft bandwidth limit**, **10 builds/hour**, **10 min build timeout** | Via `404.html` fallback or hash routing | **No** | [GitHub Pages Limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) |

## 2. Deployment & Instant Rollback
- **Build Command**: `npm run build` | **Output Directory**: `dist`
- **Rollback**: Use Cloudflare Pages Dashboard -> Deployments -> **Rollback to this deployment** (`< 15s`), or `git checkout v0.1.0`.
