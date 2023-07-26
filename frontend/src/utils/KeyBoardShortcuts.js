import parser from 'ua-parser-js';

export const createShortcut = ({
	key,
	callback,
	event,
	options,
}) => {
	if (!key) throw new Error('Key is required');
	const {
		preventDefault = false,
		stopPropagation = false,
		altKey = false,
		ctrlKey = false,
		shiftKey = false,
		metaKey = false,
	} = options || {};
	const isMac = getDeviceInfo().os.name === 'Mac OS';
	if (event.key === key) {
		if (altKey && !event.altKey) return;
		if (isMac && ctrlKey && !event.metaKey) return;
		if (!isMac && ctrlKey && !event.ctrlKey) return;
		if (isMac && metaKey && !event.ctrlKey) return;
		if (!isMac && metaKey && !event.metaKey) return;
		if (shiftKey && !event.shiftKey) return;

		if (preventDefault) event.preventDefault();
		if (stopPropagation) event.stopPropagation();
		callback(event);
	}
};

export const getDeviceInfo = () => {
	const ua = navigator.userAgent;
	return parser(ua);
};