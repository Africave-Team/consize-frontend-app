"use client"
import TeamsSubscription from '@/components/TeamSubscription'
import Layout from '@/layouts/PageTransition'
import { useAuthStore } from '@/store/auth.store'

import React from 'react'

export default function TeamsSettingsPage () {
  const { team } = useAuthStore()

  return (
    <Layout>
      <TeamsSubscription team={team} />
    </Layout>
  )
}
