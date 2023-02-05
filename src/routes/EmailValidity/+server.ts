import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PrismaClient } from '@prisma/client';
const prisma: PrismaClient = new PrismaClient();
export const POST: RequestHandler = async ({ request }) => {
	console.log('POSTED');
	let searchTerm;
	try {
		searchTerm = (await request.json()).email;
	} catch (e) {
		return json({
			isValid: false
		});
	}
	if (!searchTerm)
		return json({
			isValid: false
		});
	const result = await prisma.user.findMany({
		where: {
			email: {
				equals: searchTerm
			}
		}
	});
	console.log(result);
	return json({
		isValid: result.length > 0
	});
};
export const GET: RequestHandler = async () => {
	return json({
		ok: 'OK'
	});
};
