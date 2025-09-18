import { API } from '@/app/api/[[...slugs]]/route';
import { treaty } from '@elysiajs/eden';
export const api = treaty<API>(process.env.NEXT_PUBLIC_BASE_URL);