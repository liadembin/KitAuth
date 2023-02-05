<script lang="ts">
	import type { ActionData } from './$types';

	//#region ValidationFuncs
	let emailValidity = false;
	let emailErr = '';
	let UsernameValidity = false;
	let PasswordValidity = false;
	let passwordErr = '';
	let username: string = '';
	let password: string = '';
	let email: string = '';
	$: PasswordOk = PasswordValidity || password == '';
	let form: ActionData;
	const inputCls = 'input input-bordered ';

	async function ValidateUserName(e: Event) {
		let element = e.target as HTMLInputElement;
		let username = element.value;

		UsernameValidity = await GetIsValidUsername(username);
	}
	async function GetIsValidUsername(username: string) {
		return (
			await (
				await fetch('/UsernameValidity', {
					method: 'POST',
					body: JSON.stringify({ username })
				})
			).json()
		).isValid;
	}
	async function ValidateEmail(e: Event) {
		let element = e.target as HTMLInputElement;
		let email = element.value;
		emailValidity = await GetIsValidEmail(email);

		emailErr = emailValidity ? '' : await GetEmailErr();
	}
	async function GetIsValidEmail(email: string): Promise<boolean> {
		return (
			new RegExp('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$').test(email) ||
			(await FetchEmailValidity(email))
		);
	}
	async function FetchEmailValidity(email: string) {
		return (
			await (
				await fetch('/EmailValidity', {
					method: 'POST',
					body: JSON.stringify({ email })
				})
			).json()
		).isValid;
	}
	function GetEmailErr(): string {
		return 'Email Taken or invalid';
	}
	function ValidatePassword(e: Event) {
		let element = e.target as HTMLInputElement;

		ValidatePasswordP(element.value);
	}
	function ValidatePasswordP(password: string) {
		const capitalLetterPattern = /[A-Z]/;
		const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;
		const numberPattern = /[0-9]/;
		if (!capitalLetterPattern.test(password)) {
			passwordErr = 'Password must contain at least one capital letter';
		} else if (password.length < 8) {
			passwordErr = 'Password must be at least 8 characters long';
		} else if (!specialCharPattern.test(password)) {
			passwordErr = 'Password must contain at least one special character';
		} else if (!numberPattern.test(password)) {
			passwordErr = 'Password must contain one number';
		} else {
			passwordErr = '';
		}
		PasswordValidity = passwordErr == '';
		console.log({ PasswordOk });
	}
	async function Sumbit(e: Event) {
		GetIsValidEmail(email);
		ValidatePasswordP(password);
		GetIsValidUsername(username);
		if (!email) emailErr = 'email mustnt be empty';
		if (!username) UsernameValidity = true;
		if (!emailErr && !UsernameValidity && !passwordErr && email && username) {
			(document.getElementById('form') as HTMLFormElement).submit();
		}
	}
	//#endregion ValidationFuncs
</script>

<div class=" w-full h-full ">
	<form action="" method="POST" on:submit|preventDefault class=" w-full" id="form">
		<div class="w-1/2" style="position:absolute;left:50%;transform:translateX(-50%)">
			<div class="form-control max-w-lg">
				<label for="username" class="label"><span class="label-text"> username </span></label>
				<input
					type="text"
					name="username"
					id="username"
					on:change={ValidateUserName}
					bind:value={username}
					class={inputCls + (UsernameValidity && username != '' ? 'input-error' : 'input-primary')}
					autocomplete="username"
				/>
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label class="label">
					<span class="label-text-alt text-red-600"
						>{!UsernameValidity ? '' : 'username taken or empty'}</span
					>
				</label>
			</div>
			<div class="form-control max-w-lg">
				<label for="email" class="label"><span class="label-text"> email </span></label>
				<input
					type="email"
					name="email"
					id="email"
					autocomplete="email"
					on:change={ValidateEmail}
					bind:value={email}
					class={inputCls + (emailErr && email != '' ? 'input-error' : 'input-primary')}
				/>

				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label class="label">
					<span class="label-text-alt text-red-600">{emailErr}</span>
				</label>
			</div>
			<div class="form-control max-w-lg">
				<label for="password" class="label"><span class="label-text"> password </span></label>
				<input
					type="password"
					name="password"
					id="password"
					autocomplete="new-password"
					bind:value={password}
					class={inputCls + (!PasswordOk ? 'input-error' : 'input-primary')}
					on:input={ValidatePassword}
				/>

				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label class="label">
					<span class="label-text-alt text-red-600">{passwordErr}</span>
				</label>
			</div>
			<div class="form-control max-w-lg">
				<label for="aboutMe" class="label"><span class="label-text"> About Me </span></label>
				<input
					type="text"
					name="aboutMe"
					id="aboutMe"
					autocapitalize="on"
					autocorrect="on"
					maxlength="150"
					class="input input-bordered input-primary"
				/>
			</div>
			<div class="form-control max-w-sm" style="direction:rtl;">
				<label class="cursor-pointer label">
					<span class="label-text"
						>i Read And Agree to the
						<a href="/tos">Terms and Conditaions</a>
					</span>
					<input type="checkbox" required class="checkbox checkbox-success" />
				</label>
			</div>

			<button type="button" on:click={Sumbit} class="btn  btn-primary btn-square w-2/3"
				>sign up</button
			>
		</div>
	</form>
</div>
