import { useEffect, useState } from 'react'
import { supabase } from './supabase'

export interface Profile {
  id: string
  display_name: string
}

export function useProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>([])

  useEffect(() => {
    supabase
      .from('profiles')
      .select('*')
      .then(({ data }) => {
        if (data) setProfiles(data as Profile[])
      })
  }, [])

  return profiles
}
