let personalAccessToken = undefined;


chrome.storage.sync.get('asanaToken', (result) => {
	if(result && result.asanaToken) {
		personalAccessToken = result.asanaToken;
	}
	else
	{
		console.log("Asana token not set — please enter a valid one into the extension");
	}
});

const isAlreadyLoaded = (text) => 
	['⏳', '⚠️', '[asana]'].some((str) =>
		text.includes(str)
	)

const fetchAsanaTask = (taskId, accessToken) =>
	new Promise((resolve, reject) => 
		chrome.runtime.sendMessage(
			{queryType: "asanaTask", taskId, accessToken},
			({task, error}) => {
				if (error) {
					reject(error);
				} else {
					resolve(task);
				}
			})
	)

function extractAsanaIdFromAppHref(asanaHref)
{
	asanaHref = asanaHref.trim().toLowerCase();
	if(asanaHref.indexOf('://'))
	{
		asanaHref = asanaHref.slice(asanaHref.indexOf('://') + 3);
	}
	if(asanaHref.indexOf(' ') > 0)
	{
		asanaHref = asanaHref.slice(0,asanaHref.indexOf(' '));
	}
	if(asanaHref.indexOf(':') > 0)
	{
		asanaHref = asanaHref.slice(0,asanaHref.indexOf(':'));
	}

	let parts = asanaHref.split('/');

	let asanaTaskId = parts[parts.length - 1];
	if(asanaTaskId === 'f')
	{
		asanaTaskId = parts[parts.length - 2];
	}
	return asanaTaskId
}

function updateLinksToAsanaReferences() {

	if(!personalAccessToken) {
		return;
	}

	let linkItems = document.querySelectorAll('a.link-gray-dark.no-underline.h4.js-navigation-open');
	for(var linkItem of linkItems) {
		let linkText = linkItem.innerText;
		if(isAlreadyLoaded(linkText)) {
			continue;
		}
		if(linkText.toLowerCase().indexOf('vr/') === 0)
		{
			linkText = linkText.slice(3);
		}

		if(linkText.indexOf('https') === 0 && linkText.indexOf('app.asana.com') > 1)
		{
			const asanaTaskId = extractAsanaIdFromAppHref(linkText);
			updateFullAsanaLink(linkItem, linkText, asanaTaskId, '');
			continue;
		}

		if(linkText.toLowerCase().indexOf('asana/') === 0)
		{
			let asanaTaskId = linkText.slice(6);
			if(asanaTaskId.indexOf(' ') > 0)
			{
				asanaTaskId = asanaTaskId.slice(0,asanaTaskId.indexOf(' '));
			}
			if(asanaTaskId.indexOf(':') > 0)
			{
				asanaTaskId = asanaTaskId.slice(0,asanaTaskId.indexOf(':'));
			}
			updateFullAsanaLink(linkItem, linkText, asanaTaskId, '');
			continue;
		}
	}
}

function fixBlameLinks() {
	let linkItems = document.querySelectorAll('.blame-commit a');
	for(var linkItem of linkItems) {
		let linkText = linkItem.innerText;

		if(linkText.indexOf('app.asana.com') > 1)
		{
			const commitLink = linkItem.parentElement.querySelector('a');
			commitLink.innerText = linkText;
			linkItem.parentElement.removeChild(linkItem);
			continue;
		}
	}
}

function updateCommitTextAsana()
{
	if(!personalAccessToken) {
		return;
	}

	const linkItems = document.querySelectorAll('.branch-name');
	for(var linkItem of linkItems) {
		let linkText = linkItem.innerText;
		if(isAlreadyLoaded(linkText)) {
			continue;
		}
		if(linkText.toLowerCase().indexOf('vr/') === 0)
		{
			linkText = linkText.slice(3);
		}

		let prefix = '';

		if(linkText.toLowerCase().indexOf('asana/staging') === 0)
		{
			prefix = 'STAGING';
			linkText = 'asana' + linkText.slice('asana/staging'.length)
		}

		if(linkText.toLowerCase().indexOf('asana/') === 0)
		{
			let asanaTaskId = linkText.slice(6);
			linkItem.classList.remove('css-truncate-target');
			if(asanaTaskId.indexOf(' ') > 0)
			{
				asanaTaskId = asanaTaskId.slice(0,asanaTaskId.indexOf(' '));
			}
			if(asanaTaskId.indexOf(':') > 0)
			{
				asanaTaskId = asanaTaskId.slice(0,asanaTaskId.indexOf(':'));
			}

			if(asanaTaskId.indexOf('-') > 0)
			{
				asanaTaskId = asanaTaskId.slice(0,asanaTaskId.indexOf('-'));
			}
			updateFullAsanaLink(linkItem, linkText, asanaTaskId, prefix);
			continue;
		}
	}
}

function updateFullAsanaLink(linkItem, linkText, asanaTaskId, prefix) {
	const thisRow = linkItem;

	if(prefix)
	{
		prefix = prefix + ' ';
	}

	thisRow.innerText = '⏳ ' + prefix + linkText;

	fetchAsanaTask(asanaTaskId, personalAccessToken)
		.then(task => {
			thisRow.innerText = (task.completed ? '✅' : '') + '[asana] ' + ' - ' + prefix  + task.name;
		})
		.catch(error => {
			thisRow.innerText = "⚠️ " + prefix + linkText;
		});
}

function makePrTitleUsable()
{
	if(!personalAccessToken) {
		return;
	}

	const titleElement = document.querySelector('.js-issue-title');
	if(!titleElement)
	{
		return;
	}

	if(titleElement.innerText.toLowerCase().indexOf('asana/') === 0)
	{
		let text = titleElement.innerText.slice('asana/'.length);

		if(text.indexOf(' ') > 0)
		{
			text = text.slice(0,text.indexOf(' '));
		}
		if(text.indexOf(':') > 0)
		{
			text = text.slice(0,text.indexOf(':'));
		}
		text = text.trim();
		const linkHref = 'https://app.asana.com/0/0/' + text + '/f';

		var newAnchor = document.createElement('a');
		newAnchor.setAttribute('href', linkHref);
		newAnchor.setAttribute('target', '_blank');
		newAnchor.innerText = linkHref;
		titleElement.innerText = '';
		titleElement.appendChild(newAnchor);

		const asanaId = extractAsanaIdFromAppHref(linkHref)
		updateFullAsanaLink(newAnchor, linkHref, asanaId, '');
	}
	if(titleElement.innerText.toLowerCase().indexOf('https://app.asana.com/') === 0)
	{
		const text = titleElement.innerText.trim();
		const asanaId = extractAsanaIdFromAppHref(text)

		const linkHref = 'https://app.asana.com/0/0/' + asanaId + '/f';

		var newAnchor = document.createElement('a');
		newAnchor.setAttribute('href', linkHref);
		newAnchor.setAttribute('target', '_blank');
		newAnchor.innerText = linkHref;
		titleElement.innerText = '';
		titleElement.appendChild(newAnchor);

		updateFullAsanaLink(newAnchor, linkHref, asanaId, '');
	}
}

function hookUpLinks() {

	setInterval(updateLinksToAsanaReferences, 2000);
	updateLinksToAsanaReferences();
	setInterval(makePrTitleUsable, 2000);
	makePrTitleUsable();
	setInterval(updateCommitTextAsana, 2000);
	updateCommitTextAsana();
	fixBlameLinks();
}

setTimeout(hookUpLinks, 500);
