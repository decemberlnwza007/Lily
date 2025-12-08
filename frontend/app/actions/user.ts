'use server'

import { createClient } from '../utils/supabase/server'
import { redirect } from 'next/navigation'

export async function completeAssessment() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('User not authenticated')
    }

    const { error } = await supabase.auth.updateUser({
        data: {
            has_completed_assessment: true,
            last_assessment_date: new Date().toISOString()
        }
    })

    if (error) {
        console.error('Error updating user metadata:', error)
        throw new Error('Failed to update assessment status')
    }

    return { success: true }
}
