import type { Actions } from './$types';
import { fail, json, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { PrismaClient } from '@prisma/client';
import { HASH_ROUNDS } from '$env/static/private';
import { hash } from 'bcrypt';
import bcrypt from 'bcrypt';
const prisma: PrismaClient = new PrismaClient();
export const load: PageServerLoad = async ({ locals, cookies }) => {
	if (locals.user) {
		console.log('Signed iN');
		throw redirect(300, '/protected/ShowUserData');
	}
};

export const actions: Actions = {
	default: async ({ cookies, request, setHeaders, locals }) => {
		const formData = await request.formData();
		// const hashedPass = await hash(formData.get('password') as string, Number(HASH_ROUNDS) ?? 10);
		// console.log({
		// 	hashedPass,
		// 	username: formData.get('username')
		// });

		const DbRes = await prisma.user.findFirst({
			where: {
				OR: [
					{
						email: {
							equals: formData.get('username') as string
						}
					},
					{
						username: {
							equals: formData.get('username') as string
						}
					}
				]
			}
		});
		if (!DbRes) {
			console.log('Not Found');
			return fail(401, {
				err: 'Email or password invalid'
			});
		}
		const DbPass = DbRes?.password ?? '';
		if (!(await bcrypt.compare(formData.get('password') as string, DbPass))) {
			console.log('Password invalid');
			return fail(401, {
				err: 'Password or email invalid'
			});
		}
		const newSessid = await generateSessid();
		const updated = await prisma.user.update({
			data: {
				sessId: newSessid
			},
			where: {
				id: DbRes?.id ?? -1
			}
		});
		console.log('Updated');
		console.log(updated);
		if (updated) {
			cookies.set('sessid', newSessid, {
				httpOnly: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24,
				path: '/',
				secure: true,
				sameSite: 'strict'
			});
			throw redirect(300, '/protected/ShowUserData');
		} else {
			console.log('No User Found But Weird we are here');
		}
		console.log('Dont Kw');
		throw redirect(300, '/protected/ShowUserData');
	}
};
async function generateSessid(): Promise<string> {
	const uuid = crypto.randomUUID();
	const res = await prisma.user.findFirst({
		where: {
			sessId: uuid
		}
	});
	if (res) return generateSessid();
	return uuid;
}
