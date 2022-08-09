export interface IPublicationResponse {
    content: string | null;
    image: string | null;
    id: number;
    user_id: number;
    time_posted: string;
}

export interface IPublication {
    content: string | null;
    image: string | null;
    id: number;
    userId: number;
    timePosted: Date;
}
