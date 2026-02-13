import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import type { Comment } from '../lib/types'

interface Props {
  accommodationId: string
}

export default function CommentSection({ accommodationId }: Props) {
  const { user, profile } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchComments = async () => {
    // Try the view with user names first, fall back to raw table
    const { data, error } = await supabase
      .from('comments_with_user')
      .select('*')
      .eq('accommodation_id', accommodationId)
      .order('created_at', { ascending: true })

    if (error) {
      // View might not exist yet — fall back to comments table
      const { data: fallback } = await supabase
        .from('comments')
        .select('*')
        .eq('accommodation_id', accommodationId)
        .order('created_at', { ascending: true })
      if (fallback) setComments(fallback as Comment[])
    } else if (data) {
      setComments(data as Comment[])
    }
  }

  useEffect(() => {
    fetchComments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accommodationId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !body.trim()) return

    setLoading(true)
    await supabase.from('comments').insert({
      accommodation_id: accommodationId,
      user_id: user.id,
      body: body.trim(),
    })
    setBody('')
    setLoading(false)
    fetchComments()
  }

  const handleDelete = async (commentId: string) => {
    await supabase.from('comments').delete().eq('id', commentId)
    fetchComments()
  }

  return (
    <div className="comments">
      {comments.length === 0 && (
        <p className="no-comments">Aucun commentaire pour l'instant.</p>
      )}
      {comments.map((c) => (
        <div key={c.id} className="comment-bubble">
          <div className="comment-header">
            <strong>{c.user_name || c.user_email || 'Anonyme'}</strong>
            <small>{new Date(c.created_at).toLocaleString('fr-FR')}</small>
          </div>
          <p>{c.body}</p>
          {c.user_id === user?.id && (
            <button
              className="outline secondary comment-delete"
              onClick={() => handleDelete(c.id)}
            >
              ✕
            </button>
          )}
        </div>
      ))}

      <form onSubmit={handleSubmit} className="comment-form">
        <input
          type="text"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={`${profile?.name ?? 'Toi'} — ajouter un commentaire…`}
        />
        <button type="submit" disabled={loading || !body.trim()}>
          Envoyer
        </button>
      </form>
    </div>
  )
}
