export interface Blog {
    _id: string,
    title: string, 
    description: string,
    imageUrl: string,
    categoryId: string,
    tags?: any,
    createdAt: string;
}