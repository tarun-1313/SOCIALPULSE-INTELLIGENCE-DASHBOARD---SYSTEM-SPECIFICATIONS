-- Create social media metrics table
CREATE TABLE IF NOT EXISTS platform_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL, -- e.g., 'Instagram', 'Twitter', 'LinkedIn'
  followers_count INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0,
  growth_rate DECIMAL(5,2) DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a table for recent activity/posts
CREATE TABLE IF NOT EXISTS recent_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  content TEXT,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  posted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE platform_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE recent_posts ENABLE ROW LEVEL SECURITY;

-- Simple policies (allow all read for demo purposes)
CREATE POLICY "Allow public read access for metrics" ON platform_metrics FOR SELECT USING (true);
CREATE POLICY "Allow public read access for posts" ON recent_posts FOR SELECT USING (true);

-- Seed initial data
INSERT INTO platform_metrics (platform, followers_count, engagement_rate, growth_rate)
VALUES 
  ('Instagram', 12540, 4.2, 12.5),
  ('Twitter', 8920, 2.1, -2.4),
  ('LinkedIn', 4320, 5.8, 8.2),
  ('YouTube', 25600, 3.5, 15.0);

INSERT INTO recent_posts (platform, content, likes, comments, shares)
VALUES 
  ('Instagram', 'Checking out the new design trends in 2026! #design #v0', 1240, 45, 12),
  ('Twitter', 'Just launched my new dashboard project. Check it out!', 540, 22, 85),
  ('LinkedIn', 'Excited to announce my new role as Lead Designer at Vercel!', 2300, 150, 45);
