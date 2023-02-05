import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, cookies }) => {
	if (!locals.user) {
		console.log('Not Signed In');
		throw redirect(300, '/login');
	}
	return { user: locals.user };
};
