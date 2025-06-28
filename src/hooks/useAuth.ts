import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      checkPremiumStatus();
    }
  }, [user]);

  const checkPremiumStatus = async () => {
    try {
      const { data } = await supabase
        .from('users')
        .select('premium_until')
        .eq('id', user?.id)
        .single();

      if (data?.premium_until) {
        setIsPremium(new Date(data.premium_until) > new Date());
      }
    } catch (error) {
      console.error('Error checking premium status:', error);
    }
  };

  return {
    user,
    loading,
    isPremium,
    checkPremiumStatus
  };
}