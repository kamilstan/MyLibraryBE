export interface BookEntity {
    id: string;
    title: string;
    author: string;
    description: string;
    review: number;
    isAvailable: boolean;
}

export interface  NewBookEntity extends Omit<BookEntity, 'id'> {
    id?: string;
}