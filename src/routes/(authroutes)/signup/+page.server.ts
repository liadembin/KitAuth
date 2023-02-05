import type { Actions } from './$types';
import { PrismaClient } from '@prisma/client';
import { fail, json, redirect } from '@sveltejs/kit';
const prisma = new PrismaClient();
import { hash } from 'bcrypt';
import { HASH_ROUNDS } from '$env/static/private';

function ValidatePassword(password: string) {
	const capitalLetterPattern = /[A-Z]/;
	const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;
	const numberPattern = /[0-9]/;
	return (
		!capitalLetterPattern.test(password) ||
		password.length < 8 ||
		!specialCharPattern.test(password) ||
		numberPattern.test(password)
	);
}
export const actions: Actions = {
	default: async ({ cookies, request, setHeaders, locals }) => {
		const formData = await request.formData();
		console.log(formData);

		const hashedPass = await hash(formData.get('password') as string, Number(HASH_ROUNDS) ?? 10);
		const sessId = await generateSessid();
		if (!ValidatePassword(formData.get('password') as string)) {
			return fail(500, {
				status: 'err'
			});
		}
		try {
			/*    { name: 'username', value: 'asd' },
					{ name: 'email', value: 'asd@dasdasd' },
					{ name: 'password', value: 'adsV123$' },
					{ name: 'aboutMe', value: 'qwe123' }*/
			console.log('Prisma Res:');
			console.log(
				await prisma.user.create({
					data: {
						AboutMe: formData.get('aboutMe') as string,
						email: formData.get('email') as string,
						password: hashedPass,
						sessId,
						username: formData.get('username') as string
					}
				})
			);
		} catch (e) {
			console.log(e);
			return fail(500, {
				err: structuredClone(e)
			});
		}
		cookies.set('sessid', sessId, {
			httpOnly: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24,
			path: '/',
			secure: true,
			sameSite: 'strict'
		});
		console.log('red');
		throw redirect(303, '/');
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
