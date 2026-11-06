import type { components } from '../../api/schema';

type GroupResponse = components['schemas']['GroupResponse'];
type GroupDetailResponse = components['schemas']['GroupDetailResponse'];
type StandingEntryResponse = components['schemas']['StandingEntry'];

export interface Group {
    id: number;
    name: string;
    inviteCode: string;
    seasonId: number;
    competitionName: string;
    seasonName: string;
    ownerId: number;
    memberCount: number;
    readOnly: boolean;
}

export interface GroupMember {
    userId: number;
    displayName: string;
    joinedAt: Date | null;
}

export interface StandingEntry {
    position: number;
    userId: number;
    displayName: string;
    points: number;
    exactHits: number;
}

export function toGroup(response: GroupResponse): Group {
    return {
        id: response.id ?? 0,
        name: response.name ?? '',
        inviteCode: response.inviteCode ?? '',
        seasonId: response.seasonId ?? 0,
        competitionName: response.competitionName ?? '',
        seasonName: response.seasonName ?? '',
        ownerId: response.ownerId ?? 0,
        memberCount: response.memberCount ?? 0,
        readOnly: response.readOnly ?? false,
    };
}

export function toGroupDetail(response: GroupDetailResponse): {
    group: Group;
    members: GroupMember[];
} {
    return {
        group: toGroup(response.group ?? {}),
        members: (response.members ?? []).map((member) => ({
            userId: member.userId ?? 0,
            displayName: member.displayName ?? '',
            joinedAt: member.joinedAt ? new Date(member.joinedAt) : null,
        })),
    };
}

export function toStandings(list: StandingEntryResponse[]): StandingEntry[] {
    return list.map((entry) => ({
        position: entry.position ?? 0,
        userId: entry.userId ?? 0,
        displayName: entry.displayName ?? '',
        points: entry.points ?? 0,
        exactHits: entry.exactHits ?? 0,
    }));
}

export function initials(name: string): string {
    const words = name.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return '?';
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
}
