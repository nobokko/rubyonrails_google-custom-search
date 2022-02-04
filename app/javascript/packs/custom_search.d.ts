/**
 * 検索結果
 */
export type TypeGoogleApiCustomSearchResultItem = ({
    pagemap?: {
        [key: string]: ({
            [key: string]: string
        }[])
    }
} & {
    [key: string]: string
});