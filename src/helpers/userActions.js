import { supabase } from "../lib/supabase/supabase"

export async function getUserProfile() {

    try {
        const { data: session } = await supabase.auth.getSession()
        const { data: profile, error } = await supabase
            .from('profiles')
            .select("*").eq('id', session.session.user.id)
        if (error) {
            return { sucsess: false, data: error }
        }


        return { sucsess: true, data: profile[0] }
    } catch (err) {
        return { sucsess: false, data: `CatchError:${err}` }
    }
}
export async function getUserConversations(userId) {
    const { data, error } = await supabase
        .from('conversation_members')
        .select("*").eq('user_id', userId)

    if (error) {
        return { sucsess: false, data: error }
    }
    return { sucsess: true, data }
}