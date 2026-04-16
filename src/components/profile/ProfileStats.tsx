import { TrendingUp, Heart, MessageCircle, Eye } from 'lucide-react';
import { formatNumber } from '../../utils/formatters';

interface ProfileStatsProps {
  totalLikes: number;
  totalComments: number;
  totalViews: number;
  engagementRate: number;
}

export function ProfileStats({ totalLikes, totalComments, totalViews, engagementRate }: ProfileStatsProps) {
  const stats = [
    { label: 'Total Likes', value: formatNumber(totalLikes), icon: Heart, color: 'text-destructive' },
    { label: 'Comments', value: formatNumber(totalComments), icon: MessageCircle, color: 'text-primary' },
    { label: 'Impressions', value: formatNumber(totalViews), icon: Eye, color: 'text-green-500' },
    { label: 'Engagement', value: `${engagementRate.toFixed(1)}%`, icon: TrendingUp, color: 'text-yellow-500' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="bg-card border border-border rounded-xl p-4 text-center">
          <Icon className={`w-5 h-5 mx-auto mb-2 ${color}`} />
          <p className="text-xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  );
}
