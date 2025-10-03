'use server'
import { createClient } from "../utils/supabase/server"
import { randomUUID } from "crypto"
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function register(formData: FormData) {
    const supabase = await createClient()

    // ดึงข้อมูลจาก form
    const data = {
        username: formData.get('username') as string,
        firstname: formData.get('firstname') as string,
        lastname: formData.get('lastname') as string,
        email: (formData.get('email') as string).trim(),
        password: formData.get('password') as string,
        confirm: formData.get('confirm') as string,
        avatar_file: formData.get('avatar') as File
    }

    // 1️⃣ Signup user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
            data: {
                username: data.username,
                first_name: data.firstname,
                last_name: data.lastname,
                password: data.password
            }
        }
    })

    if (signUpError) {
        console.error('Signup error:', signUpError.message)
        // return { success: false, error: signUpError.message }
    }


    const userId = signUpData.user?.id
    // if (!userId) {
    //     return { success: false, error: "User ID not found after signup" }
    // }

    // 2️⃣ Upload avatar (ถ้ามี)
    let avatarUrl: string | null = null
    if (data.avatar_file) {
        const fileName = `${randomUUID()}_${data.avatar_file.name}`
        const fileBuffer = Buffer.from(await data.avatar_file.arrayBuffer())

        const { error: uploadError } = await supabase
            .storage
            .from('avatars')
            .upload(fileName, fileBuffer, { contentType: data.avatar_file.type })

        if (uploadError) {
            console.error('Upload avatar error:', uploadError.message)
            // return { success: false, error: uploadError.message }
        }

        avatarUrl = supabase
            .storage
            .from('avatars')
            .getPublicUrl(fileName)
            .data.publicUrl
    }

    // 3️⃣ Insert profile into 'profiles' table
    const { error: profileError } = await supabase
        .from('profiles')
        .insert({
            id: userId,            // ต้องตรงกับ auth.users.id
            username: data.username,
            first_name: data.firstname,
            last_name: data.lastname,
            email: data.email,
            avatar_url: avatarUrl,
            status_9q: '',
            status_8q:''
        })

    if (profileError) {
        console.error('Insert profile error:', profileError.message)
        // return { success: false, error: profileError.message }
    }

    // 4️⃣ Revalidate path & redirect
    revalidatePath('/', 'layout')
    redirect('/')
}
