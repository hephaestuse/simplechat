import { supabase } from "../lib/supabase/supabase"

export async function SignInByEmail(email, pass) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: pass,
        })
        if (error) {
            return { sucsess: false, data: error }
        }
        return { sucsess: true, data: data }
    } catch (err) {
        return { sucsess: false, data: `CatchError:${err}` }
    }
}
export async function SignUpByEmail(email, pass, userName) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: pass,
        })
        if (error) {
            return { sucsess: false, data: error }
        }


        const { error: userProfileError } = await supabase
            .from('profiles')
            .insert([
                { id: data.user.id, username: userName, email: data.user.email, avatar_url: "testUrl" },
            ])
            .select()
        if (userProfileError) {
            return { sucsess: false, data: userProfileError }
        }
        return { sucsess: true, data: data }
    } catch (err) {
        return { sucsess: false, data: `CatchError:${err}` }
    }
}
export async function getuser() {
    try {
        const { data, error } = await supabase.auth.getSession()
        if (error) {
            return { sucsess: false, data: error }
        }
        return { sucsess: true, data: data }
    } catch (err) {
        return { sucsess: false, data: `CatchError:${err}` }
    }
}
export async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) return { sucsess: false, data: error }
}