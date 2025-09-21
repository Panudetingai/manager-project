import { API } from '@/app/api/[[...slugs]]/route';
import { treaty } from '@elysiajs/eden';
export const elysia = treaty<API>(process.env.NEXT_PUBLIC_APP_URL!);