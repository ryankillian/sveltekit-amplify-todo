<script>
	import { quintOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	import { API, graphqlOperation } from 'aws-amplify';
	import { Amplify } from 'aws-amplify';
	import config from '$src/aws-exports.js';
	Amplify.configure(config);

	import { onMount } from 'svelte';
	import { listTodos } from '$graphql/queries';
	import { createTodo, updateTodo, deleteTodo } from '$graphql/mutations';
	import { onCreateTodo } from '$graphql/subscriptions';

	const [send, receive] = crossfade({
		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 600,
				easing: quintOut,
				css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
			};
		}
	});

	let todos = [];

	onMount(async () => {
		const result = await API.graphql(graphqlOperation(listTodos));
		todos = result.data.listTodos.items;

		const createTodoSubscription = await API.graphql(graphqlOperation(onCreateTodo)).subscribe({
			next: (result) => {
				const todo = result.value.data.onCreateTodo;
				todos = [...todos, todo];
			}
		});
	});

	// can make API call listTodos after add/remove/update
	async function add(input) {
		const todo = { description: input.value, done: false };
		const result = await API.graphql(graphqlOperation(createTodo, { input: todo }));
		input.value = '';
	}

	async function remove(input) {
		const todo = { id: input.id };
		const result = await API.graphql(graphqlOperation(deleteTodo, { input: todo }));
		todos = todos.filter((todo) => todo.id !== result.data.deleteTodo.id);
	}

	async function update(input) {
		const todo = { id: input.id, done: !input.done };
		const result = await API.graphql(graphqlOperation(updateTodo, { input: todo }));
	}
</script>

<div class="board">
	<input
		class="new-todo"
		placeholder="what needs to be done?"
		on:keydown={(event) => event.key === 'Enter' && add(event.target)}
	/>

	<div class="left">
		<h2>todo</h2>
		{#each todos.filter((t) => !t.done) as todo (todo.id)}
			<label in:receive={{ key: todo.id }} out:send={{ key: todo.id }} animate:flip>
				<input type="checkbox" on:click={() => update(todo)} bind:checked={todo.done} />
				{todo.description}
				<button on:click={() => remove(todo)}>x</button>
			</label>
		{/each}
	</div>

	<div class="right">
		<h2>done</h2>
		{#each todos.filter((t) => t.done) as todo (todo.id)}
			<label in:receive={{ key: todo.id }} out:send={{ key: todo.id }} animate:flip>
				<input type="checkbox" on:click={() => update(todo)} bind:checked={todo.done} />
				{todo.description}
				<button on:click={() => remove(todo)}>x</button>
			</label>
		{/each}
	</div>
</div>

<style>
	.new-todo {
		font-size: 1.4em;
		width: 100%;
		margin: 2em 0 1em 0;
	}

	.board {
		max-width: 36em;
		margin: 0 auto;
	}

	.left,
	.right {
		float: left;
		width: 50%;
		padding: 0 1em 0 0;
		box-sizing: border-box;
	}

	h2 {
		font-size: 2em;
		font-weight: 200;
		user-select: none;
	}

	label {
		top: 0;
		left: 0;
		display: block;
		font-size: 1em;
		line-height: 1;
		padding: 0.5em;
		margin: 0 auto 0.5em auto;
		border-radius: 2px;
		background-color: #eee;
		user-select: none;
	}

	input {
		margin: 0;
	}

	.right label {
		background-color: rgb(180, 240, 100);
	}

	button {
		float: right;
		height: 1em;
		box-sizing: border-box;
		padding: 0 0.5em;
		line-height: 1;
		background-color: transparent;
		border: none;
		color: rgb(170, 30, 30);
		opacity: 0;
		transition: opacity 0.2s;
	}

	label:hover button {
		opacity: 1;
	}
</style>
