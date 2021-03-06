export default class ShareDialogPlugin {
	constructor (guestForm) {
		this.guestForm = guestForm;
	}

	attach (obj) {
		const originalAutocompleteHandler = obj.autocompleteHandler;
		let lastSearch = '';

		obj.autocompleteHandler = (search, response) => {
			originalAutocompleteHandler(search, function (suggestions) {

				const searchTerm = search.term.trim();
				if (lastSearch !== searchTerm) {
					lastSearch = searchTerm;
					suggestions.push({
						label: t('core', 'Create guest account for {searchTerm}', {searchTerm}),
						value: {
							shareType: OC.Share.SHARE_TYPE_GUEST,
							shareWith: searchTerm
						}
					});
				}

				response(suggestions);
			});

		};

		const originalOnSelectRecipient = obj._onSelectRecipient;

		obj._onSelectRecipient = (e, s) => {
			if (s.item.value.shareType === OC.Share.SHARE_TYPE_GUEST) {
				e.preventDefault();
				e.stopImmediatePropagation();
				this.guestForm.populate(obj.model, s.item.value.shareWith);
				this.guestForm.openModal();
			} else {
				originalOnSelectRecipient(e, s);
			}
		};
	}
}
