var submit = document.getElementById('asataTokenSubmit');
var token = document.getElementById('asanaToken');
var statusIndicator = document.getElementById('result');

submit.addEventListener('click', () => {

	let personalAccessToken = token.value;

	statusIndicator.innerText = '';

	fetch("https://app.asana.com/api/1.0/users/me", {
		headers: new Headers({
			'Authorization': 'Bearer ' + personalAccessToken
		})
	})
	.then((response) => {
		if(response.status === 200)
		{
			return response.json();
		}
		throw Error(response.statusText);
	})
	.then(json => {
		statusIndicator.innerText = 'Success';
		const task = json.data;
		chrome.storage.sync.set({
			'asanaToken': personalAccessToken
		})
	})
	.catch(error => {
		statusIndicator.innerText = 'Failed';
	});

});
