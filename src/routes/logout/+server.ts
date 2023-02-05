import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies, request }) => {
	console.log('Recived');
	cookies.delete('sessid');
	throw redirect(300, '/');
};
