import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Euro, 
  Calendar, 
  Target, 
  Award, 
  Gift, 
  Users, 
  TrendingUp,
  Star,
  Medal,
  Zap,
  Crown,
  CheckCircle,
  Lock,
  Unlock,
  Clock,
  DollarSign,
  Flame
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  reward: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedDate?: string;
  category: 'milestone' | 'referral' | 'performance' | 'streak';
}

interface Bonus {
  id: string;
  title: string;
  amount: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  status: 'available' | 'earned' | 'locked';
  earnedDate?: string;
}

export const HeroesDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  
  // Mock stats - in real app, these would come from database
  const [stats, setStats] = useState({
    totalEarnings: 12500,
    completedJobs: 23,
    daysWorked: 87,
    currentStreak: 12,
    totalReferrals: 3,
    rating: 4.8,
    level: 5
  });

  // Compute achievements based on current stats
  const achievements = React.useMemo<Achievement[]>(() => [
    {
      id: 'first-job',
      title: 'First Hero Job',
      description: 'Complete your first job assignment',
      icon: Star,
      reward: '€50',
      progress: 1,
      maxProgress: 1,
      unlocked: true,
      unlockedDate: '2024-01-15',
      category: 'milestone'
    },
    {
      id: '100-days',
      title: '100 Days of Work',
      description: 'Work for 100 days',
      icon: Calendar,
      reward: '€200',
      progress: stats.daysWorked,
      maxProgress: 100,
      unlocked: stats.daysWorked >= 100,
      category: 'milestone'
    },
    {
      id: '1-year',
      title: '1 Year Anniversary',
      description: 'Complete 1 year of service',
      icon: Crown,
      reward: '€500',
      progress: stats.daysWorked,
      maxProgress: 365,
      unlocked: stats.daysWorked >= 365,
      category: 'milestone'
    },
    {
      id: 'referral-1',
      title: 'First Referral',
      description: 'Refer your first colleague',
      icon: Users,
      reward: '€25',
      progress: stats.totalReferrals,
      maxProgress: 1,
      unlocked: stats.totalReferrals >= 1,
      category: 'referral'
    },
    {
      id: 'referral-5',
      title: 'Referral Champion',
      description: 'Refer 5 colleagues',
      icon: Trophy,
      reward: '€100',
      progress: stats.totalReferrals,
      maxProgress: 5,
      unlocked: stats.totalReferrals >= 5,
      category: 'referral'
    },
    {
      id: 'streak-30',
      title: '30 Day Streak',
      description: 'Work 30 consecutive days',
      icon: Zap,
      reward: '€150',
      progress: stats.currentStreak,
      maxProgress: 30,
      unlocked: stats.currentStreak >= 30,
      category: 'streak'
    },
    {
      id: 'rating-5',
      title: 'Perfect Rating',
      description: 'Maintain 5.0 rating for 10 jobs',
      icon: Award,
      reward: '€300',
      progress: 7,
      maxProgress: 10,
      unlocked: false,
      category: 'performance'
    },
    {
      id: 'jobs-50',
      title: '50 Jobs Completed',
      description: 'Complete 50 jobs',
      icon: Target,
      reward: '€400',
      progress: stats.completedJobs,
      maxProgress: 50,
      unlocked: stats.completedJobs >= 50,
      category: 'milestone'
    }
  ], [stats]);

  // Compute bonuses based on current stats
  const bonuses = React.useMemo<Bonus[]>(() => [
    {
      id: 'referral-bonus',
      title: 'Referral Bonus',
      amount: 25,
      icon: Users,
      status: 'available',
    },
    {
      id: 'streak-bonus',
      title: 'Weekly Streak Bonus',
      amount: 50,
      icon: Zap,
      status: stats.currentStreak >= 7 ? 'available' : 'locked',
    },
    {
      id: 'performance-bonus',
      title: 'Performance Bonus',
      amount: 100,
      icon: Trophy,
      status: stats.rating >= 4.5 ? 'available' : 'locked',
    },
    {
      id: 'milestone-bonus',
      title: '100 Days Milestone',
      amount: 200,
      icon: Crown,
      status: stats.daysWorked >= 100 ? 'available' : 'locked',
    }
  ], [stats]);

  const unlockedAchievements = achievements.filter(a => a.unlocked).length;
  const totalAchievements = achievements.length;
  const availableBonuses = bonuses.filter(b => b.status === 'available').length;
  const earnedBonuses = bonuses.filter(b => b.status === 'earned').length;

  const getLevelProgress = () => {
    const xpPerLevel = 1000;
    const currentXP = stats.completedJobs * 50 + stats.daysWorked * 10;
    const levelXP = stats.level * xpPerLevel;
    const nextLevelXP = (stats.level + 1) * xpPerLevel;
    const progress = ((currentXP - levelXP) / (nextLevelXP - levelXP)) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  const getNextMilestone = () => {
    const milestones = [10, 25, 50, 100, 250, 500];
    return milestones.find(m => m > stats.completedJobs) || 500;
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Crown className="h-8 w-8 text-yellow-300" />
                <h1 className="text-4xl font-bold">Welcome, {user?.name || 'Hero'}!</h1>
              </div>
              <p className="text-blue-100 text-lg">Your journey to becoming an Expat Hero</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-6 w-6 text-yellow-300 fill-current" />
                <span className="text-3xl font-bold">Level {stats.level}</span>
              </div>
              <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-300 rounded-full transition-all duration-500"
                  style={{ width: `${getLevelProgress()}%` }}
                ></div>
              </div>
              <p className="text-sm text-blue-100 mt-1">{getLevelProgress().toFixed(0)}% to Level {stats.level + 1}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-2">
            <Euro className="h-8 w-8 text-green-500" />
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Earnings</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">€{stats.totalEarnings.toLocaleString()}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="h-8 w-8 text-purple-500" />
            <Target className="h-5 w-5 text-purple-500" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Jobs Completed</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedJobs}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">/ {getNextMilestone()}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 border-orange-200 dark:border-orange-800">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="h-8 w-8 text-orange-500" />
            <Clock className="h-5 w-5 text-orange-500" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Days Worked</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.daysWorked}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 border-red-200 dark:border-red-800">
          <div className="flex items-center justify-between mb-2">
            <Zap className="h-8 w-8 text-red-500" />
            <Flame className="h-5 w-5 text-red-500" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Streak</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.currentStreak} days</p>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Achievements</h2>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">Progress</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {unlockedAchievements} / {totalAchievements}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            const progressPercent = (achievement.progress / achievement.maxProgress) * 100;
            
            return (
              <div
                key={achievement.id}
                className={`relative p-4 rounded-lg border-2 transition-all ${
                  achievement.unlocked
                    ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-400 shadow-lg'
                    : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                }`}
              >
                {achievement.unlocked && (
                  <div className="absolute top-2 right-2">
                    <Unlock className="h-5 w-5 text-yellow-600" />
                  </div>
                )}
                {!achievement.unlocked && (
                  <div className="absolute top-2 right-2">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                )}
                
                <div className="flex items-start gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${
                    achievement.unlocked 
                      ? 'bg-yellow-200 dark:bg-yellow-800' 
                      : 'bg-gray-200 dark:bg-gray-600'
                  }`}>
                    <Icon className={`h-6 w-6 ${
                      achievement.unlocked 
                        ? 'text-yellow-700 dark:text-yellow-300' 
                        : 'text-gray-500'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold mb-1 ${
                      achievement.unlocked 
                        ? 'text-gray-900 dark:text-white' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {achievement.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {achievement.description}
                    </p>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-yellow-600 dark:text-yellow-400">
                        Reward: {achievement.reward}
                      </span>
                      {achievement.unlocked && achievement.unlockedDate && (
                        <span className="text-xs text-gray-500">
                          {new Date(achievement.unlockedDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          achievement.unlocked 
                            ? 'bg-yellow-500' 
                            : 'bg-blue-500'
                        }`}
                        style={{ width: `${Math.min(100, progressPercent)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {achievement.progress} / {achievement.maxProgress}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bonuses Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Gift className="h-6 w-6 text-pink-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Available Bonuses</h2>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">Ready to Claim</p>
            <p className="text-xl font-bold text-green-600 dark:text-green-400">
              {availableBonuses} bonuses
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bonuses.map((bonus) => {
            const Icon = bonus.icon;
            return (
              <div
                key={bonus.id}
                className={`p-6 rounded-lg border-2 transition-all ${
                  bonus.status === 'available'
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-400 shadow-lg hover:shadow-xl cursor-pointer transform hover:scale-105'
                    : bonus.status === 'earned'
                    ? 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 opacity-75'
                    : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 opacity-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${
                      bonus.status === 'available'
                        ? 'bg-green-200 dark:bg-green-800'
                        : 'bg-gray-200 dark:bg-gray-600'
                    }`}>
                      <Icon className={`h-8 w-8 ${
                        bonus.status === 'available'
                          ? 'text-green-700 dark:text-green-300'
                          : 'text-gray-500'
                      }`} />
                    </div>
                    <div>
                      <h3 className={`font-bold text-lg mb-1 ${
                        bonus.status === 'available'
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {bonus.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Euro className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <span className={`text-2xl font-bold ${
                          bonus.status === 'available'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-gray-500'
                        }`}>
                          {bonus.amount}
                        </span>
                      </div>
                    </div>
                  </div>
                  {bonus.status === 'available' && (
                    <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors">
                      Claim
                    </button>
                  )}
                  {bonus.status === 'locked' && (
                    <Lock className="h-6 w-6 text-gray-400" />
                  )}
                  {bonus.status === 'earned' && bonus.earnedDate && (
                    <div className="text-right">
                      <CheckCircle className="h-6 w-6 text-green-500 mb-1" />
                      <p className="text-xs text-gray-500">
                        {new Date(bonus.earnedDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Referral Section */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-6 w-6" />
              <h2 className="text-2xl font-bold">Referral Program</h2>
            </div>
            <p className="text-purple-100 mb-4">
              Refer your colleagues and earn up to €100 per referral!
            </p>
            <div className="flex items-center gap-6">
              <div>
                <p className="text-sm text-purple-100">Total Referrals</p>
                <p className="text-3xl font-bold">{stats.totalReferrals}</p>
              </div>
              <div>
                <p className="text-sm text-purple-100">Earned</p>
                <p className="text-3xl font-bold">€{stats.totalReferrals * 25}</p>
              </div>
            </div>
          </div>
          <button className="px-6 py-3 bg-white text-purple-600 rounded-lg font-bold hover:bg-purple-50 transition-colors shadow-lg">
            Refer a Colleague
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Clock className="h-6 w-6 text-blue-500" />
          Recent Activity
        </h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Job Completed: Warehouse Operations
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Earned €280 • 2 days ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Trophy className="h-5 w-5 text-blue-500" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Achievement Unlocked: First Referral
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Earned €25 bonus • 5 days ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <Medal className="h-5 w-5 text-purple-500" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Level Up! Reached Level 5
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">1 week ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

