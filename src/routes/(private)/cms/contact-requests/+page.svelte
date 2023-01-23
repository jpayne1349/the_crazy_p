<script lang="ts">
	import { onMount } from 'svelte';
	import { alertStore, firebaseStore } from '../../../customStores';
	import { getDocs, collection } from 'firebase/firestore';
	import type { Timestamp } from 'firebase/firestore';

	let emailDataLoading = true;
	let emailList: EmailObject[] = [];

	interface EmailObject {
		email: string;
		type: string;
		added: Timestamp;
	}

	onMount(async () => {
		await fetchContactForms();
		contactFormDataLoading = false;

		await fetchEmailList();
		emailDataLoading = false;
	});

	async function fetchEmailList() {
		// pull data down from firebase here instead of at root layout...
		// no need to slow down ux if only needed in CMS.
		try {
			const emailListSnapshot = await getDocs(collection($firebaseStore.db, 'email-list'));
			emailListSnapshot.forEach((doc) => {
				let emailObject = doc.data() as EmailObject;

				emailList.push(emailObject);
			});
			emailList.sort((a, b) => {
				return b.added.seconds - a.added.seconds;
			});
			emailDataLoading = false;
		} catch (e) {
			console.log(e);
			alertStore.set({
				show: true,
				type: 'error',
				message: 'Error! Something went wrong.'
			});
		}
	}

	let contactFormDataLoading = true;
	let contactFormList: ContactForm[] = [];

	interface ContactForm {
		name: string;
		phone: string;
		email: string;
		details: string;
		created: Timestamp;
		showDetails: boolean;
	}

	async function fetchContactForms() {
		// pull data down from firebase here instead of at root layout...
		// no need to slow down ux if only needed in CMS.
		try {
			const contactFormSnapshot = await getDocs(collection($firebaseStore.db, 'contact-form'));
			contactFormSnapshot.forEach((doc) => {
				let contactFormObject = doc.data() as ContactForm;
				contactFormObject.showDetails = false;
				contactFormList.push(contactFormObject);
			});
			contactFormList.sort((a, b) => {
				return b.created.seconds - a.created.seconds;
			});
			contactFormDataLoading = false;
		} catch (e) {
			console.log(e);
			alertStore.set({
				show: true,
				type: 'error',
				message: 'Error! Something went wrong.'
			});
		}
	}

	function timestampToDisplay(timestamp: Timestamp) {
		let date = new Date(timestamp.seconds * 1000);

		let stringDate = date.toDateString();
		// remove the day of the week
		stringDate = stringDate.slice(4, 10);

		return stringDate;
	}
</script>

<h2 class="table-title">EMAIL LIST</h2>
<div class="inventory-table">
	<div class="table-header">
		<p class="col-label">Email</p>
		<p class="col-label">Added</p>
		<p class="col-label">Type</p>
	</div>
	<div class="table-contents">
		{#if emailDataLoading}
			<div class="loading-container">
				<div class="loading-spinner" />
			</div>
		{:else}
			{#each emailList as emailObj}
				<div class="table-row">
					<p class="row-label">{emailObj.email}</p>
					<p class="row-label">{timestampToDisplay(emailObj.added)}</p>
					<p class="row-label">{emailObj.type}</p>
				</div>
			{/each}
		{/if}
	</div>
</div>
<h2 class="table-title">CONTACT FORMS | Click for details</h2>
<div class="inventory-table">
	<div class="table-header contact">
		<p class="col-label">Name</p>
		<p class="col-label">Phone</p>
		<p class="col-label">Created</p>
	</div>
	<div class="table-contents">
		{#if emailDataLoading}
			<div class="loading-container">
				<div class="loading-spinner" />
			</div>
		{:else}
			{#each contactFormList as formObj (formObj.created.seconds)}
				<button
					class="contact-row-button"
					on:click={() => (formObj.showDetails = !formObj.showDetails)}
				>
					<div class="table-row contact">
						<p class="row-label">{formObj.name}</p>
						<p class="row-label">{formObj.phone}</p>
						<p class="row-label">{timestampToDisplay(formObj.created)}</p>
					</div>
					{#if formObj.showDetails}
						<p class="contact-details-row">DETAILS: {formObj.details}</p>
					{/if}
				</button>
			{/each}
		{/if}
	</div>
</div>

<style>
	.loading-container {
		min-height: 200px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.loading-spinner {
		content: '';
		border-radius: 50%;
		border-top: 2px solid hsl(var(--a));
		border-right: 2px solid transparent;
		width: 40px;
		height: 40px;
		animation-name: spinning;
		animation-duration: 1s;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
		opacity: 1;
		transition: all 0.2s;
		margin-left: 0px;
	}
	.inventory-table {
		width: 100%;
		display: flex;
		flex-direction: column;
		margin-bottom: 50px;
		min-height: 200px;
	}
	.table-title {
		font-size: 20px;
		margin-bottom: 15px;
	}
	.table-contents {
		max-height: 60vh;
		overflow-y: scroll;
	}
	.table-header,
	.table-row {
		display: grid;
		border-bottom: 1px solid hsl(var(--nf));
		grid-template-columns: 2fr repeat(2, 1.2fr);
		margin-bottom: 0px;
	}
	.table-header.contact,
	.table-row.contact {
		grid-template-columns: repeat(2, 1.5fr) 100px;
		border-bottom: none;
		text-align: left;
	}
	.contact-row-button {
		width: 100%;
		border-bottom: 1px solid hsl(var(--nf));
	}
	.contact-details-row {
		padding: 10px 0;
		text-align: left;
	}

	.table-row {
		border-bottom: 1px solid hsl(var(--n));
		padding: 10px 0;
	}

	@keyframes spinning {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
