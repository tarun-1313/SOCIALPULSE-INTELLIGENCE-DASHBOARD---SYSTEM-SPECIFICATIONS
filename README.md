
SOCIALPULSE INTELLIGENCE DASHBOARD - SYSTEM SPECIFICATIONS
OVERVIEW
--------------------------------------------------------------------------------
SocialPulse Intelligence is a high-end, enterprise-grade social media analytics 
and intelligence platform. It is designed to empower digital marketers, brand 
managers, and business owners with deep, actionable insights across their 
entire social ecosystem. 

By unifying data from multiple platforms (Twitter, LinkedIn, Facebook, Instagram) 
into a single, cohesive dashboard, SocialPulse eliminates the need for manual 
data consolidation. The platform features advanced data normalization, automated 
executive reporting, and AI-driven narrative insights to help users understand 
not just "what" happened, but "why" it matters and "how" to improve.

Key Value Propositions:
- Single Source of Truth: Centralized metrics for global brand performance.
- Intelligence at Scale: Automated reporting that saves hours of manual work.
- Strategic Roadmap: Actionable insights that drive real business growth.
- Data Flexibility: Seamlessly blend live API data with custom manual uploads.


1. CORE FEATURES
--------------------------------------------------------------------------------
A. UNIFIED ANALYTICS DASHBOARD
   - Aggregated view of followers, reach, and engagement across all platforms.
   - Real-time KPI tiles with performance change indicators.
   - Interactive trend charts (D3.js & Chart.js) for engagement and growth.
   - Platform-specific deep dives for Twitter, LinkedIn, Facebook, and Instagram.

B. INTELLIGENCE REPORT GENERATOR
   - Automated server-side generation of Executive PDF and Raw CSV reports.
   - Custom data merging: Upload your own performance, growth, and top posts 
     (CSV, XLSX, JSON) to include in reports.
   - Intelligent narrative generation with smart insights based on data trends.
   - Persistent report history stored in Supabase with instant download access.

C. BI-ANALYTICS ENGINE
   - Multi-platform data normalization and aggregation.
   - Smart Narrative: AI-driven text summaries of your performance data.
   - Comparison Matrix: Benchmarking performance between different social channels.
   - Automated growth forecasting and trend analysis.

D. PLATFORM INTEGRATIONS
   - Secure OAuth2 connections for social media platforms.
   - Manual data upload system for custom platform tracking.
   - Automated sync with Supabase for persistent metrics and post history.

E. USER MANAGEMENT & RBAC
   - Authentication system via Supabase Auth.
   - Role-Based Access Control (RBAC) for report generation and settings access.
   - Personalized user profiles and connection management.

2. ENVIRONMENT VARIABLE REQUIREMENTS (.env.local)
--------------------------------------------------------------------------------
Required variables for the system to function correctly:

A. SUPABASE CONFIGURATION (Essential for Database & Auth)
   - NEXT_PUBLIC_SUPABASE_URL: Your Supabase project URL.
   - NEXT_PUBLIC_SUPABASE_ANON_KEY: Public anonymous key for client-side access.
   - SUPABASE_SERVICE_ROLE_KEY: Secret role key for server-side operations.
   - SUPABASE_JWT_SECRET: Secret for verifying JWT tokens.

B. POSTGRES DATABASE (Direct Database Access)
   - POSTGRES_URL: Connection string for pooled database connections.
   - POSTGRES_HOST: Database host address.
   - POSTGRES_USER: Database username.
   - POSTGRES_PASSWORD: Database password.
   - POSTGRES_DATABASE: Database name.

C. PLATFORM API CREDENTIALS (For Live Data Sync)
   - TWITTER_BEARER_TOKEN: For Twitter API v2 access.
   - TWITTER_ACCESS_TOKEN: User-specific access token.
   - TWITTER_TOKEN_SECRET: User-specific token secret.

3. REQUIRED DATABASE TABLES (SUPABASE)
--------------------------------------------------------------------------------
- generated_reports: Stores report metadata and history.
- platform_metrics: Stores normalized KPI data per platform.
- recent_posts: Stores post-level engagement data.
- social_media_connections: Tracks connected user accounts.
- user_roles: Manages RBAC permissions.

================================================================================
Generated on: 2026-01-04
================================================================================
