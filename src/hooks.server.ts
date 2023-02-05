import { redirect, type Handle, type RequestEvent } from '@sveltejs/kit';
import { PrismaClient, type User } from '@prisma/client';
const prisma = new PrismaClient();
export const handle: Handle = async ({ event, resolve }) => {
	// Stage 1
	event.locals.user = await authenticateUser(event);

	if (event.url.pathname.startsWith('/protected')) {
		console.log('Pro:');
		console.log(event.locals.user);
		if (event.locals.user == null) throw redirect(303, '/');
		if (!event.locals.user) {
			throw redirect(303, '/');
		}
		// if (event.url.pathname.startsWith('/protected/admin')) {
		// 	if (event.locals.user.Role != "ADMIN")
		// 		throw redirect(303, '/protected');
		// 	}
		// }
	} else {
		console.log('Req not prot');
		console.log(event.locals.user);
	}
	const response = await resolve(event); // Stage 2
	// Stage 3
	return response;
};
async function authenticateUser(event: RequestEvent): Promise<User | null> {
	const sessId = event.cookies.get('sessid') ?? '';
	const user = await prisma.user.findFirst({
		where: {
			sessId
		}
	});
	console.log('Authenticating: ');
	console.log(user);
	return user;
}
