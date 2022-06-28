export interface BookEntity {
    id: string;
    title: string;
    author: string;
    description: string;
    review: number;
    count: number;
}

export interface  NewBookEntity extends Omit<BookEntity, 'id'> {
    id?: string;
}