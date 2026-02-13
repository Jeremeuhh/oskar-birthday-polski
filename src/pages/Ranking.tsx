import { useCallback, useEffect, useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import type { Accommodation, Ranking as RankingType } from '../lib/types'

/* ── Sortable item ── */
function SortableItem({
  accommodation,
  position,
}: {
  accommodation: Accommodation
  position: number
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: accommodation.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <article
      ref={setNodeRef}
      style={style}
      className="ranking-item"
      {...attributes}
      {...listeners}
    >
      <span className="rank-number">#{position}</span>
      <div className="rank-info">
        <strong>{accommodation.name}</strong>
        {accommodation.city && (
          <small> — 📍 {accommodation.city}</small>
        )}
        {accommodation.price_per_night != null && (
          <small> — {accommodation.price_per_night} €/nuit</small>
        )}
      </div>
      <span className="drag-handle" title="Glisser pour réordonner">
        ⠿
      </span>
    </article>
  )
}

/* ── Aggregated result row ── */
interface AggregatedResult {
  accommodation: Accommodation
  score: number
  voterCount: number
}

export default function Ranking() {
  const { user } = useAuth()
  const [accommodations, setAccommodations] = useState<Accommodation[]>([])
  const [myOrder, setMyOrder] = useState<Accommodation[]>([])
  const [aggregated, setAggregated] = useState<AggregatedResult[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const fetchData = useCallback(async () => {
    if (!user) return
    setLoading(true)

    const [accRes, myRankRes, allRankRes] = await Promise.all([
      supabase.from('accommodations').select('*').order('created_at'),
      supabase
        .from('rankings')
        .select('*')
        .eq('user_id', user.id)
        .order('position'),
      supabase.from('rankings').select('*'),
    ])

    const accs: Accommodation[] = accRes.data ?? []
    const myRankings: RankingType[] = myRankRes.data ?? []
    const allRankings: RankingType[] = allRankRes.data ?? []

    // Build my ordered list
    if (myRankings.length > 0) {
      const accMap = new Map(accs.map((a) => [a.id, a]))
      const ordered = myRankings
        .map((r) => accMap.get(r.accommodation_id))
        .filter(Boolean) as Accommodation[]
      // Add any new accommodations not yet ranked
      const rankedIds = new Set(myRankings.map((r) => r.accommodation_id))
      const unranked = accs.filter((a) => !rankedIds.has(a.id))
      setMyOrder([...ordered, ...unranked])
    } else {
      setMyOrder(accs)
    }

    // Compute aggregated scores (Borda count)
    const totalAccommodations = accs.length
    const scoreMap = new Map<
      string,
      { score: number; voters: Set<string> }
    >()
    for (const r of allRankings) {
      if (!scoreMap.has(r.accommodation_id)) {
        scoreMap.set(r.accommodation_id, { score: 0, voters: new Set() })
      }
      const entry = scoreMap.get(r.accommodation_id)!
      entry.score += totalAccommodations - r.position + 1
      entry.voters.add(r.user_id)
    }

    const agg: AggregatedResult[] = accs
      .map((a) => ({
        accommodation: a,
        score: scoreMap.get(a.id)?.score ?? 0,
        voterCount: scoreMap.get(a.id)?.voters.size ?? 0,
      }))
      .sort((a, b) => b.score - a.score)

    setAggregated(agg)
    setAccommodations(accs)
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setMyOrder((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id)
      const newIndex = items.findIndex((i) => i.id === over.id)
      return arrayMove(items, oldIndex, newIndex)
    })
    setSaved(false)
  }

  const handleSave = async () => {
    if (!user) return
    setSaving(true)

    // Delete existing rankings for this user
    await supabase.from('rankings').delete().eq('user_id', user.id)

    // Insert new rankings
    const inserts = myOrder.map((a, index) => ({
      user_id: user.id,
      accommodation_id: a.id,
      position: index + 1,
    }))

    await supabase.from('rankings').insert(inserts)

    setSaving(false)
    setSaved(true)

    // Refresh aggregated results
    fetchData()
  }

  if (loading) return <p className="container">Chargement…</p>

  if (accommodations.length === 0) {
    return (
      <main className="container">
        <h2>Classement</h2>
        <p>Aucun logement à classer. Ajoute d'abord des logements sur la page d'accueil !</p>
      </main>
    )
  }

  return (
    <main className="container">
      <div className="ranking-layout">
        {/* Left: My ranking */}
        <section>
          <h2>Mon classement</h2>
          <p>Glisse les logements pour les ordonner du préféré (1er) au moins aimé.</p>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={myOrder.map((a) => a.id)}
              strategy={verticalListSortingStrategy}
            >
              {myOrder.map((a, index) => (
                <SortableItem
                  key={a.id}
                  accommodation={a}
                  position={index + 1}
                />
              ))}
            </SortableContext>
          </DndContext>

          <button
            onClick={handleSave}
            disabled={saving}
            aria-busy={saving}
            className="save-ranking-btn"
          >
            {saving
              ? 'Sauvegarde…'
              : saved
                ? '✓ Classement sauvegardé !'
                : 'Sauvegarder mon classement'}
          </button>
        </section>

        {/* Right: Aggregated */}
        <section>
          <h2>Classement du groupe</h2>
          <p>Score agrégé (méthode Borda) — plus le score est haut, plus le logement est populaire.</p>

          {aggregated.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Logement</th>
                  <th>Score</th>
                  <th>Votes</th>
                </tr>
              </thead>
              <tbody>
                {aggregated.map((row, i) => (
                  <tr key={row.accommodation.id}>
                    <td>
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                    </td>
                    <td>
                      <strong>{row.accommodation.name}</strong>
                      {row.accommodation.city && (
                        <small> — {row.accommodation.city}</small>
                      )}
                    </td>
                    <td>{row.score}</td>
                    <td>{row.voterCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Personne n'a encore voté.</p>
          )}
        </section>
      </div>
    </main>
  )
}
