-- adding activity logs and refining roles for RBAC
-- adding normalized analytics table for multi-platform engine

-- Create activity_logs table for auditing
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create reports table for automated generation tracking
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'weekly', 'monthly'
  format TEXT NOT NULL, -- 'pdf', 'csv'
  status TEXT DEFAULT 'completed',
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create normalized analytics table
CREATE TABLE IF NOT EXISTS multi_platform_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL, -- 'facebook', 'twitter', 'instagram', 'linkedin'
  metric_name TEXT NOT NULL, -- 'followers', 'likes', 'comments', 'engagement'
  metric_value NUMERIC NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE multi_platform_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own activity logs" ON activity_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own reports" ON reports
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Everyone can view analytics" ON multi_platform_analytics
  FOR SELECT USING (true);

-- Seed some multi-platform data
INSERT INTO multi_platform_analytics (platform, metric_name, metric_value) VALUES
('facebook', 'followers', 15400),
('facebook', 'engagement', 3.2),
('twitter', 'followers', 8900),
('twitter', 'engagement', 4.5),
('instagram', 'followers', 22100),
('instagram', 'engagement', 5.1),
('linkedin', 'followers', 4500),
('linkedin', 'engagement', 2.8);
