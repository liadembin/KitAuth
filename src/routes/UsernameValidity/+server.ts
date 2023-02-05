import type { RequestHandler } from './$types';
import { PrismaClient } from '@prisma/client';
import { json } from '@sveltejs/kit';
const prisma: PrismaClient = new PrismaClient();
export const POST: RequestHandler = async ({ request }) => {
	console.log('POSTED');
	let searchTerm;
	try {
		searchTerm = (await request.json()).username;
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
			username: {
				equals: searchTerm
			}
		}
	});
	console.log(result);
	return json({
		isValid: result.length > 0
	});
};
