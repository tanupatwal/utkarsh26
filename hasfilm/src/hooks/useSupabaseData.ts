/**
 * useSupabaseData.ts — Lazy-loading hooks for Events, Team, and Highlights.
 *
 * Each hook:
 *   1. Uses IntersectionObserver (react-intersection-observer) to detect when
 *      the section is approaching the viewport
 *   2. Uses TanStack Query with `enabled: inView` so data only fetches when needed
 *   3. Falls back to hardcoded data if Supabase is unavailable or errors
 *   4. Caches results — scrolling back/switching views never re-fetches
 */
import { useQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { supabase } from '../lib/supabaseClient';

// Hardcoded fallback data
import { SCHEDULE_EVENTS, SCHEDULE_DAYS } from '../data/schedule';
import type { ScheduleEvent } from '../data/schedule';
import { TEAM_MEMBERS } from '../data/team';
import type { TeamMember } from '../data/team';
import { HIGHLIGHTS_CONTENT } from '../data/highlights';
import type { ImageData } from '../types';

// ════════════════════════════════════════════════
//  useEvents — Schedule events from Supabase
// ════════════════════════════════════════════════

export interface SupabaseEvent {
    id: string;
    day_id: number;
    time: string;
    title: string;
    venue: string;
    society: string | null;
    coordinator: string | null;
    coordinator_contact: string | null;
    description: string | null;
    registration_link: string | null;
    image_url: string | null;
}

function mapSupabaseEvent(e: SupabaseEvent): ScheduleEvent {
    return {
        dayId: e.day_id,
        time: e.time,
        title: e.title,
        venue: e.venue,
        society: e.society ?? undefined,
        coordinator: e.coordinator ?? undefined,
        coordinatorContact: e.coordinator_contact ?? undefined,
        description: e.description ?? undefined,
        registrationLink: e.registration_link ?? undefined,
        imageUrl: e.image_url ?? undefined,
    };
}

export function useEvents() {
    const [ref, inView] = useInView({ rootMargin: '300px', triggerOnce: true });

    const query = useQuery<ScheduleEvent[]>({
        queryKey: ['events'],
        enabled: inView && !!supabase,
        queryFn: async () => {
            const { data, error } = await supabase!
                .from('events')
                .select('*')
                .order('day_id', { ascending: true })
                .order('sort_order', { ascending: true });

            if (error) throw error;
            return (data as SupabaseEvent[]).map(mapSupabaseEvent);
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Fallback: use hardcoded data if Supabase is unavailable or errored
    const events = query.data ?? SCHEDULE_EVENTS;
    const days = SCHEDULE_DAYS; // Static, rarely changes

    return {
        events,
        days,
        isLoading: query.isLoading && inView && !!supabase,
        error: query.error,
        ref,
        isFromSupabase: !!query.data,
    };
}

export function getEventsForDayFromList(events: ScheduleEvent[], dayId: number): ScheduleEvent[] {
    return events.filter(e => e.dayId === dayId);
}

// ════════════════════════════════════════════════
//  useTeamMembers — Team from Supabase
// ════════════════════════════════════════════════

export interface SupabaseTeamMember {
    id: string;
    name: string;
    role: string;
    image_url: string;
    sort_order: number;
}

function mapSupabaseTeamMember(m: SupabaseTeamMember): TeamMember {
    return {
        name: m.name,
        role: m.role,
        image: m.image_url,
    };
}

export function useTeamMembers() {
    const [ref, inView] = useInView({ rootMargin: '300px', triggerOnce: true });

    const query = useQuery<TeamMember[]>({
        queryKey: ['team_members'],
        enabled: inView && !!supabase,
        queryFn: async () => {
            const { data, error } = await supabase!
                .from('team_members')
                .select('*')
                .order('sort_order', { ascending: true });

            if (error) throw error;
            return (data as SupabaseTeamMember[]).map(mapSupabaseTeamMember);
        },
        staleTime: 5 * 60 * 1000,
    });

    const members = query.data ?? TEAM_MEMBERS;

    return {
        members,
        isLoading: query.isLoading && inView && !!supabase,
        error: query.error,
        ref,
        isFromSupabase: !!query.data,
    };
}

// ════════════════════════════════════════════════
//  useHighlights — Highlights from Supabase
// ════════════════════════════════════════════════

export interface SupabaseHighlight {
    id: string;
    title: string;
    description: string;
    image_url: string;
    sort_order: number;
}

function mapSupabaseHighlight(h: SupabaseHighlight): ImageData {
    return {
        url: h.image_url,
        title: h.title,
        description: h.description,
    };
}

export function useHighlights() {
    const [ref, inView] = useInView({ rootMargin: '300px', triggerOnce: true });

    const query = useQuery<ImageData[]>({
        queryKey: ['highlights'],
        enabled: inView && !!supabase,
        queryFn: async () => {
            const { data, error } = await supabase!
                .from('highlights')
                .select('*')
                .order('sort_order', { ascending: true });

            if (error) throw error;
            return (data as SupabaseHighlight[]).map(mapSupabaseHighlight);
        },
        staleTime: 5 * 60 * 1000,
    });

    const highlights = query.data ?? HIGHLIGHTS_CONTENT;

    return {
        highlights,
        isLoading: query.isLoading && inView && !!supabase,
        error: query.error,
        ref,
        isFromSupabase: !!query.data,
    };
}
