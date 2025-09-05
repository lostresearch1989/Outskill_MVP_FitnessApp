import React, { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import { AuthForm } from './components/auth/AuthForm';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { Navigation } from './components/layout/Navigation';
import { Dashboard } from './components/dashboard/Dashboard';
import { BaselineAssessment } from './components/profile/BaselineAssessment';
import { GoalSetting } from './components/profile/GoalSetting';
import { ProgressTracker } from './components/profile/ProgressTracker';
import { PersonalizedPlanView } from './components/profile/PersonalizedPlanView';
import { ActivityLogger } from './components/activities/ActivityLogger';
import { ActivityList } from './components/activities/ActivityList';
import { WorkoutRecommendations } from './components/workouts/WorkoutRecommendations';
import { useAuth } from './contexts/AuthContext';
import { Activity, User, BaselineData, FitnessTargets, PersonalizedPlan, ProgressEntry } from './types';
import { generatePersonalizedPlan } from './lib/ai-simulation';
import { Scale, Target, TrendingUp, Calendar } from 'lucide-react';
import { Card } from './components/ui/Card';

function AppContent() {
  const { user, loading } = useAuth();
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showActivityLogger, setShowActivityLogger] = useState(false);
  const [showBaselineAssessment, setShowBaselineAssessment] = useState(false);
  const [showGoalSetting, setShowGoalSetting] = useState(false);
  const [showProgressTracker, setShowProgressTracker] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [baseline, setBaseline] = useState<BaselineData | null>(null);
  const [fitnessTargets, setFitnessTargets] = useState<FitnessTargets | null>(null);
  const [personalizedPlan, setPersonalizedPlan] = useState<PersonalizedPlan | null>(null);
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([]);

  // Mock data for demonstration
  useEffect(() => {
    if (user) {
      // Check if user needs onboarding (mock check)
      const hasProfile = localStorage.getItem(`profile_${user.id}`);
      if (!hasProfile) {
        setNeedsOnboarding(true);
      } else {
        const savedProfile = JSON.parse(hasProfile);
        setUserProfile(savedProfile);
        setNeedsOnboarding(false);
        
        // Load activities
        const savedActivities = localStorage.getItem(`activities_${user.id}`);
        if (savedActivities) {
          setActivities(JSON.parse(savedActivities));
        }
        
        // Load baseline data
        const savedBaseline = localStorage.getItem(`baseline_${user.id}`);
        if (savedBaseline) {
          setBaseline(JSON.parse(savedBaseline));
        }
        
        // Load fitness targets
        const savedTargets = localStorage.getItem(`targets_${user.id}`);
        if (savedTargets) {
          setFitnessTargets(JSON.parse(savedTargets));
        }
        
        // Load personalized plan
        const savedPlan = localStorage.getItem(`plan_${user.id}`);
        if (savedPlan) {
          setPersonalizedPlan(JSON.parse(savedPlan));
        }
        
        // Load progress entries
        const savedProgress = localStorage.getItem(`progress_${user.id}`);
        if (savedProgress) {
          setProgressEntries(JSON.parse(savedProgress));
        }
      }
    }
  }, [user]);

  const handleOnboardingComplete = (data: any) => {
    const profile: User = {
      id: user!.id,
      email: user!.email!,
      full_name: data.full_name,
      disability_type: data.disability_type,
      mobility_notes: data.mobility_notes,
      fitness_goals: data.fitness_goals,
      created_at: new Date().toISOString(),
    };

    localStorage.setItem(`profile_${user!.id}`, JSON.stringify(profile));
    setUserProfile(profile);
    setNeedsOnboarding(false);
  };

  const handleSaveActivity = (activityData: Partial<Activity>) => {
    const newActivity: Activity = {
      id: Date.now().toString(),
      user_id: user!.id,
      ...activityData,
    } as Activity;

    const updatedActivities = [newActivity, ...activities];
    setActivities(updatedActivities);
    localStorage.setItem(`activities_${user!.id}`, JSON.stringify(updatedActivities));
    setShowActivityLogger(false);
  };

  const handleSaveBaseline = (baselineData: BaselineData) => {
    localStorage.setItem(`baseline_${user!.id}`, JSON.stringify(baselineData));
    setBaseline(baselineData);
    setShowBaselineAssessment(false);
  };

  const handleSaveTargets = (targetsData: FitnessTargets) => {
    localStorage.setItem(`targets_${user!.id}`, JSON.stringify(targetsData));
    setFitnessTargets(targetsData);
    
    // Generate personalized plan if we have baseline data
    if (baseline) {
      const plan = generatePersonalizedPlan(baseline, targetsData, userProfile?.disability_type);
      localStorage.setItem(`plan_${user!.id}`, JSON.stringify(plan));
      setPersonalizedPlan(plan);
    }
    
    setShowGoalSetting(false);
  };

  const handleAddProgressEntry = (entryData: Partial<ProgressEntry>) => {
    const newEntry: ProgressEntry = {
      id: Date.now().toString(),
      user_id: user!.id,
      ...entryData,
    } as ProgressEntry;

    const updatedEntries = [newEntry, ...progressEntries].sort((a, b) => 
      new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime()
    );
    setProgressEntries(updatedEntries);
    localStorage.setItem(`progress_${user!.id}`, JSON.stringify(updatedEntries));
  };

  const handleUpdateMilestone = (milestoneIndex: number, completed: boolean) => {
    if (!personalizedPlan) return;
    
    const updatedPlan = { ...personalizedPlan };
    updatedPlan.milestones[milestoneIndex].completed = completed;
    updatedPlan.milestones[milestoneIndex].completed_at = completed ? new Date().toISOString() : undefined;
    
    localStorage.setItem(`plan_${user!.id}`, JSON.stringify(updatedPlan));
    setPersonalizedPlan(updatedPlan);
  };

  const getCurrentWeek = () => {
    if (!personalizedPlan) return 1;
    const startDate = new Date(personalizedPlan.created_at);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    return Math.min(diffWeeks, personalizedPlan.timeline_weeks);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-8 h-8 bg-white rounded-full" />
          </div>
          <p className="text-gray-600">Loading AdaptFit...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  if (needsOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-6 pb-24">
        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {showActivityLogger && (
            <ActivityLogger
              onSave={handleSaveActivity}
              onCancel={() => setShowActivityLogger(false)}
            />
          )}
          
          {showBaselineAssessment && (
            <BaselineAssessment
              onSave={handleSaveBaseline}
              onCancel={() => setShowBaselineAssessment(false)}
              existingBaseline={baseline || undefined}
            />
          )}
          
          {showGoalSetting && baseline && (
            <GoalSetting
              onSave={handleSaveTargets}
              onCancel={() => setShowGoalSetting(false)}
              baseline={baseline}
              existingTargets={fitnessTargets || undefined}
            />
          )}
          
          {showProgressTracker && baseline && (
            <ProgressTracker
              baseline={baseline}
              progressEntries={progressEntries}
              plan={personalizedPlan || undefined}
              onAddEntry={handleAddProgressEntry}
            />
          )}
          
          {!showActivityLogger && !showBaselineAssessment && !showGoalSetting && !showProgressTracker && (
            <>
              {activeTab === 'dashboard' && (
                <Dashboard
                  userProfile={userProfile}
                  activities={activities}
                  onLogActivity={() => setShowActivityLogger(true)}
                />
              )}
              
              {activeTab === 'activities' && (
                <ActivityList
                  activities={activities}
                  onAddActivity={() => setShowActivityLogger(true)}
                />
              )}
              
              {activeTab === 'workouts' && (
                <WorkoutRecommendations userProfile={userProfile} />
              )}
              
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="text-center py-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Fitness Profile</h2>
                    <p className="text-gray-600">Manage your baseline, goals, and track progress</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Baseline Assessment */}
                    <Card className="p-6" hover onClick={() => setShowBaselineAssessment(true)}>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                          <Scale size={24} className="text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {baseline ? 'Update Baseline' : 'Create Baseline'}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                          {baseline ? 'Update your current physical state' : 'Establish your starting point'}
                        </p>
                        {baseline && (
                          <div className="text-xs text-green-600">
                            ✓ Last updated: {new Date(baseline.updated_at).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </Card>
                    
                    {/* Goal Setting */}
                    <Card className="p-6" hover onClick={() => baseline && setShowGoalSetting(true)}>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                          <Target size={24} className="text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {fitnessTargets ? 'Update Goals' : 'Set Goals'}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                          {fitnessTargets ? 'Modify your fitness targets' : 'Define what you want to achieve'}
                        </p>
                        {!baseline && (
                          <div className="text-xs text-gray-500">
                            Complete baseline assessment first
                          </div>
                        )}
                        {fitnessTargets && (
                          <div className="text-xs text-green-600">
                            ✓ Goal: {fitnessTargets.primary_goal.replace('_', ' ')}
                          </div>
                        )}
                      </div>
                    </Card>
                    
                    {/* Progress Tracking */}
                    <Card className="p-6" hover onClick={() => baseline && setShowProgressTracker(true)}>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                          <TrendingUp size={24} className="text-purple-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Progress Tracker
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                          Monitor your improvements over time
                        </p>
                        {!baseline && (
                          <div className="text-xs text-gray-500">
                            Complete baseline assessment first
                          </div>
                        )}
                        {progressEntries.length > 0 && (
                          <div className="text-xs text-green-600">
                            ✓ {progressEntries.length} entries logged
                          </div>
                        )}
                      </div>
                    </Card>
                    
                    {/* Personalized Plan */}
                    {personalizedPlan && (
                      <Card className="p-6">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <Calendar size={24} className="text-orange-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Your Plan
                          </h3>
                          <p className="text-gray-600 text-sm mb-4">
                            {personalizedPlan.plan_name}
                          </p>
                          <div className="text-xs text-green-600">
                            Week {getCurrentWeek()} of {personalizedPlan.timeline_weeks}
                          </div>
                        </div>
                      </Card>
                    )}
                  </div>
                  
                  {/* Personalized Plan View */}
                  {personalizedPlan && baseline && fitnessTargets && (
                    <PersonalizedPlanView
                      plan={personalizedPlan}
                      onUpdateMilestone={handleUpdateMilestone}
                      currentWeek={getCurrentWeek()}
                    />
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <Navigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AccessibilityProvider>
        <AppContent />
      </AccessibilityProvider>
    </AuthProvider>
  );
}

export default App;