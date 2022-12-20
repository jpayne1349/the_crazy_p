// helps us render the layout title faster

import type { LayoutLoad } from './$types';

export const load = (({ url }) => {
	let pagePathList = url.pathname.split('/').slice(1);
	let titleIndex = pagePathList.length === 1 ? 0 : 1;
	let title = formatCapitalizedString(pagePathList[titleIndex]);

	let crumbs: { name: string; path: string }[] = [];
	pagePathList.forEach((pathname) => {
		crumbs = [
			...crumbs,
			{
				name: formatCapitalizedString(pathname),
				path: '/' + pathname
			}
		];
	});

	crumbs[crumbs.length - 1].path = url.pathname;

	return { title, crumbs };
}) as LayoutLoad;

function formatCapitalizedString(word: string): string {
	let lowercaseWords = word.split('-');
	let uppercaseWords = lowercaseWords.map((word) => {
		let capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1);
		return capitalizedWord;
	});

	return uppercaseWords.join(' ');
}
