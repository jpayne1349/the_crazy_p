<script lang="ts">
	import { page } from '$app/stores';
	import { alertStore, customOrdersStore, firebaseStore } from '../../../../customStores';
	import { onMount } from 'svelte';
	import type { CrazyCustomOrderForm } from '../../../../customTypes';
	import { doc, updateDoc, Timestamp } from 'firebase/firestore';

	let dataLoading = true;
	let order: CrazyCustomOrderForm;

	onMount(loadStore);

	function loadStore() {
		if (!$customOrdersStore) {
			setTimeout(loadStore, 200);
			return;
		}
		getOrderData();
	}

	function getOrderData() {
		for (let storedOrder of $customOrdersStore) {
			if (storedOrder.id == $page.params.order_id) {
				order = storedOrder;
				dataLoading = false;
				return;
			}
		}
	}

	function fullTimestampToDisplay(timestamp: Timestamp) {
		let date = timestamp.toDate();

		let stringDate = date.toLocaleString();

		return stringDate;
	}

	async function updateOrderStatus() {
		let newOrderStatus = !order.fulfilled;
		try {
			if (order.id) {
				let docRef = doc($firebaseStore.db, 'custom-order', order.id);
				if (newOrderStatus) {
					let update = await updateDoc(docRef, {
						fulfilled: newOrderStatus,
						sold: Timestamp.now()
					});
					order.sold = Timestamp.now();
				} else {
					let update = await updateDoc(docRef, {
						fulfilled: newOrderStatus
					});
				}
				order.fulfilled = newOrderStatus;

				alertStore.set({
					show: true,
					type: 'success',
					message: 'Success! Order status updated.'
				});
			}
		} catch (e) {
			console.log(e);
			alertStore.set({
				show: true,
				type: 'error',
				message: 'Error! Something went wrong.'
			});
		}
	}
</script>

<h2>ORDER DETAILS</h2>
<div class="separation-bar" />
<div class="order-container">
	{#if dataLoading}
		<div class="loading-container">
			<div class="loading-spinner" />
		</div>
	{:else}
		<div class="info-row">
			<p class="info-label">NAME:</p>
			<p class="info-data">{order.name}</p>
		</div>
		<div class="info-row">
			<p class="info-label">EMAIL:</p>
			<p class="info-data">{order.email}</p>
		</div>
		<div class="info-row">
			<p class="info-label">PHONE:</p>
			<p class="info-data">{order.phone}</p>
		</div>
		<div class="info-row">
			<p class="info-label">ADDRESS:</p>
			<p class="info-data">{order.address}</p>
		</div>
		<div class="info-row">
			<p class="info-label">CREATED:</p>
			<p class="info-data">
				{#if order.created}
					{fullTimestampToDisplay(order.created)}
				{/if}
			</p>
		</div>
		{#if order.fulfilled}
			<div class="info-row">
				<p class="info-label">SOLD:</p>
				<p class="info-data">
					{#if order.sold}
						{fullTimestampToDisplay(order.sold)}
					{/if}
				</p>
			</div>
		{/if}

		<div class="status-row">
			<p class="closed-label">Open</p>
			<input
				name="status"
				type="checkbox"
				class="toggle toggle-lg toggle-success"
				bind:checked={order.fulfilled}
				on:click={updateOrderStatus}
			/>
			<p class="open-label">Fulfilled</p>
		</div>

		<div class="separation-bar field" />
		<h3 class="fields-title">ORDER SELECTIONS</h3>
		{#each order.fields as field}
			<div class="field-header">
				<h4 class="field-name">{field.name}</h4>
			</div>
			<div class="options-container">
				{#each field.options as option (option.name)}
					<div class="option" class:selected={option.selected}>{option.name}</div>
				{/each}
			</div>

			{#if field.hasDetails}
				<div class="field-details">
					{#if field.details}
						{field.details}
					{:else}
						* OTHER Selected * No details were added
					{/if}
				</div>
			{/if}

			<div class="separation-bar field" />
		{/each}
	{/if}
</div>

<style>
	h2 {
		text-align: center;
		font-family: lato-light;
		font-size: 24px;
	}
	.separation-bar {
		width: 100%;
		height: 1px;
		background-color: hsl(var(--n));
		border-radius: 1px;
		margin-bottom: 15px;
	}
	h3 {
		text-align: center;
		font-family: lato-light;
		font-size: 20px;
		margin: 15px 0;
		text-decoration: underline;
	}
	.order-container {
		display: flex;
		flex-direction: column;
		width: 100%;
		margin-bottom: 50px;
	}
	.info-row {
		display: flex;
		margin-top: 10px;
		align-items: baseline;
	}

	.info-data {
		font-family: lato-regular;
		margin-left: 10px;
		font-size: 17px;
	}
	.field-header {
		display: flex;
		justify-content: space-between;
		margin-top: 10px;
	}
	.field-name,
	.info-label {
		font-family: lato-bold;
		font-size: 17px;
		color: rgb(99, 99, 99);
	}
	.options-container {
		display: flex;
		flex-wrap: wrap;
		margin-top: 10px;
		width: 96%;
		margin-left: 2%;
	}
	.field-details {
		margin-top: 15px;
		font-size: 18px;
		width: 96%;
		min-height: 90px;
		border: 1px solid lightgray;
		margin-left: 2%;
		padding: 2px 5px;
		background-color: hsl(var(--bg));
		resize: none;
		outline: none;
	}
	.option {
		padding: 3px 6px;
		margin-right: 8px;
		margin-bottom: 8px;
		border-radius: 3px;
		border: 1px solid hsl(var(--n));
		background-color: rgb(243, 243, 243);
		user-select: none;
		transition: all 0.2s;
		font-size: 18px;
	}
	.option.selected {
		color: white;
		background-color: hsl(var(--s));
	}
	.separation-bar.field {
		width: 100%;
		height: 1px;
		background-color: hsl(var(--n));
		border-radius: 1px;
		margin-top: 15px;
		margin-bottom: 0px;
	}
	.loading-container {
		min-height: 500px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.loading-spinner {
		content: '';
		border-radius: 50%;
		border-top: 2px solid hsl(var(--a));
		border-right: 2px solid transparent;
		width: 80px;
		height: 80px;
		animation-name: spinning;
		animation-duration: 1s;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
		opacity: 1;
		transition: all 0.2s;
		margin-left: 0px;
	}

	@keyframes spinning {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
	.status-row {
		display: flex;
		justify-content: center;

		font-size: 20px;
		margin: 20px 0;
	}
	.toggle {
		margin: 0 10px;
	}
	.open-label {
		color: hsl(var(--su));
	}
	.open-label,
	.closed-label {
		width: 100px;
	}
	.closed-label {
		text-align: right;
	}
</style>
