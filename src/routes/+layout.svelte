<script>
	import '../app.postcss';
	async function logOut() {
		const response = await fetch('/logout', { method: 'POST' });
		console.log(response);
		location.reload();
	}
</script>

<div class="navbar bg-slate-700">
	<div class="flex-1">
		<a class="btn btn-ghost normal-case text-xl text-white" href="/">your Brand</a>
	</div>
	<div class="flex-none">
		<ul class="menu menu-horizontal px-1">
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<li tabindex="0">
				<button class="btn btn-ghost btn-primary text-white" on:click={logOut}>Logout</button>

				<a href="/signup" class="btn btn-ghost btn-primary text-white">signup</a>
				<a href="/login" class="btn btn-ghost btn-primary text-white">login</a>
				<a href="/protected/ShowUserData" class="btn btn-ghost btn-primary text-white">Protected</a>
			</li>
		</ul>
	</div>
</div>
<slot />
