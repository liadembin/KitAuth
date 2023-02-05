<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<div class=" w-full h-full ">
	<form method="POST" class=" w-full" id="form" use:enhance>
		<div class="w-1/2" style="position:absolute;left:50%;transform:translateX(-50%)">
			<div class="form-control max-w-lg">
				<label for="username" class="label"><span class="label-text"> username / email</span></label
				>
				<input
					type="text"
					name="username"
					id="username"
					class="input input-primary"
					autocomplete="username"
				/>
			</div>
			<div class="form-control max-w-lg mb-14">
				<label for="password" class="label"><span class="label-text"> password </span></label>
				<input
					type="password"
					name="password"
					id="password"
					autocomplete="new-password"
					class="input input-primary"
				/>
			</div>

			<button type="submit" class="btn  btn-primary btn-square w-2/3">log in</button>

			{#if form}
				<br />
				<h2 class="text-red-600 font-serif text-xl mt-3">Username Or Password is invalid</h2>
			{/if}
		</div>
	</form>
</div>
