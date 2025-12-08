import { MatSnackBar } from '@angular/material/snack-bar';
import { BookmarkService, BookmarkRequest } from './../pages/bookmarks/bookmark.service';

/**
 * Remove a bookmark by title and handle snackbars and error revert.
 * onErrorRevert is called when deletion fails so caller can revert local state.
 */
export function removeBookmark(
    title: string,
    bookmarkService: BookmarkService,
    snackBar: MatSnackBar,
    onErrorRevert?: () => void
): void {
    bookmarkService.deleteBookmark(title).subscribe({
        next: () => {
            snackBar.open(`Removed bookmark`, '', { duration: 2000 });
        },
        error: (err: any) => {
            console.error('Error removing bookmark', err);
            snackBar.open(`Failed to remove bookmark`, '', { duration: 2000 });
            if (onErrorRevert) onErrorRevert();
        }
    });
}

/**
 * Save a bookmark payload and handle snackbars and conflict / error cases.
 * onConflict and onError callbacks allow caller to set local state appropriately.
 */
export function saveBookmark(
    payload: BookmarkRequest,
    bookmarkService: BookmarkService,
    snackBar: MatSnackBar,
    onConflict?: () => void,
    onError?: () => void
): void {
    bookmarkService.saveBookmark(payload).subscribe({
        next: () => {
            snackBar.open('Bookmarked', '', { duration: 2000 });
        },
        error: (err: any) => {
            if (err && err.status === 409) {
                snackBar.open('Article already bookmarked', '', { duration: 2000 });
                if (onConflict) onConflict();
                return;
            }
            console.error('bookmark save error', err);
            snackBar.open('Failed to bookmark', '', { duration: 2000 });
            if (onError) onError();
        }
    });
}
