// helps us render the layout title faster

import type { LayoutLoad } from './$types';

export const load = (({ url }) => {
	let pagePathList = url.pathname.split('/').slice(1);
	let titleIndex = pagePathList.length === 1 ? 0 : 1;
	let title = formatCapitalizedString(pagePathList[titleIndex], true);

	let crumbs: { name: string; path: string }[] = [];
	pagePathList.forEach((pathname) => {
		crumbs = [
			...crumbs,
			{
				name: formatCapitalizedString(pathname, false),
				path: '/' + pathname
			}
		];
	});

	crumbs[crumbs.length - 1].path = url.pathname;

	return { title, crumbs };
}) as LayoutLoad;

function formatCapitalizedString(word: string, allUpperCase?: boolean): string {
	let lowercaseWords = word.split('-');

	if (lowercaseWords[0].includes('%')) {
		lowercaseWords = lowercaseWords[0].split('%20');
	}

	let uppercaseWords = lowercaseWords.map((word) => {
		// this is the normal path, to capitalize initial letter in each word
		let capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1);
		if (capitalizedWord === 'Faq') {
			capitalizedWord = 'FAQ';
		}

		if (allUpperCase) {
			capitalizedWord = word.toUpperCase();
		}

		return capitalizedWord;
	});

	return uppercaseWords.join(' ');
}
