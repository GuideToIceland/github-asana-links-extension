const personalAccessToken = '<Please insert token here>';

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

	let linkItems = document.querySelectorAll('a.link-gray-dark.no-underline.h4.js-navigation-open');
	for(var linkItem of linkItems) {
		let linkText = linkItem.innerText;
		if(linkText.indexOf('(Loading...)') === 0)
		{
			continue;
		}
		if(linkText.indexOf('[Asana]') === 0)
		{
			continue;
		}
		if(linkText.indexOf('(BORKEN)') === 0)
		{
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

		console.log('Did not lookup' ,linkText);

	}
}

function updateCommitTextAsana()
{
	const linkItems = document.querySelectorAll('.branch-name');
	for(var linkItem of linkItems) {
		let linkText = linkItem.innerText;
		if(linkText.indexOf('(Loading...)') === 0)
		{
			continue;
		}
		if(linkText.indexOf('[Asana]') === 0)
		{
			continue;
		}
		if(linkText.indexOf('(BORKEN)') === 0)
		{
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

		console.log('Did not lookup' ,linkText);
	}
}

function updateFullAsanaLink(linkItem, linkText, asanaTaskId, prefix) {
	const thisRow = linkItem;

	if(prefix)
	{
		prefix = prefix + ' ';
	}

	thisRow.innerText = '(Loading...) ' + prefix + linkText;

	fetch("https://app.asana.com/api/1.0/tasks/" + asanaTaskId,{
		headers: new Headers({
			'Authorization': 'Bearer ' + personalAccessToken
		})
	}).then((response) => {
		if(response.status === 200)
		{
			return response.json();
		}
		throw Error(response.statusText);
	})
	  .then(json => {
	  	const task = json.data;
	  	thisRow.innerText = '[Asana] ' + '(' + (task.completed?'CLOSED':'OPEN') + ') --- ' + prefix  + task.name;
	  	//console.log(json.data);
	  })
	  .catch(error => {
	  	//console.log(error);
	  	thisRow.innerText = "(BORKEN) " + prefix + linkText;
	  });
}

function makePrTitleUsable()
{
	const titleElement = document.querySelector('.js-issue-title');
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
		//newAnchor.setAttribute('class', 'js-issue-title')
		newAnchor.setAttribute('href', linkHref);
		newAnchor.setAttribute('target', '_blank');
		newAnchor.innerText = linkHref;
		titleElement.innerText = '[Asana] ';
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
		//newAnchor.setAttribute('class', 'js-issue-title')
		newAnchor.setAttribute('href', linkHref);
		newAnchor.setAttribute('target', '_blank');
		newAnchor.innerText = linkHref;
		titleElement.innerText = '[Asana] ';
		titleElement.appendChild(newAnchor);

		updateFullAsanaLink(newAnchor, linkHref, asanaId, '');
	}
}

if(window.location.href.indexOf('GuideToIceland') > 0 && window.location.href.indexOf('/pulls') > 0)
{
	setInterval(updateLinksToAsanaReferences, 2000);
	updateLinksToAsanaReferences();
}
else if(window.location.href.indexOf('GuideToIceland') > 0 && window.location.href.indexOf('/pull') > 0)
{
	setInterval(makePrTitleUsable, 2000);
	makePrTitleUsable();
}


if(window.location.href.indexOf('GuideToIceland') > 0 && window.location.href.indexOf('/branches') > 0)
{
	setInterval(updateCommitTextAsana, 2000);
	updateCommitTextAsana();
}