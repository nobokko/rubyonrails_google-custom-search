/**
 * 検索結果
 */
export type TypeGoogleApiCustomSearchResultItem = {
    pagemap?: {
        [key: string]: ({
            [key: string]: string
        }[])
    };
    link?: string;
    html_title?: string;
    html_snippet?: string;
};