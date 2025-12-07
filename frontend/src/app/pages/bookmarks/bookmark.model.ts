export interface BookmarkId {
    timestamp: number;
    date: string;
}

export interface Bookmark {
    id: BookmarkId;
    userId: BookmarkId;
    title: string;
    url: string;
    source?: string;
    _class?: string;
}
