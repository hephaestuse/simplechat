import { supabase } from "../lib/supabase/supabase"

export async function getConversationMembers(conversationId) {
    const { data, error } = await supabase
        .from('conversation_members')
        .select("*").eq('conversation_id', conversationId)

    if (error) {
        return { sucsess: false, data: error }
    }
    return { sucsess: true, data }
}