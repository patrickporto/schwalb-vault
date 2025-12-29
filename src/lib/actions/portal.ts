/**
 * A Svelte action to teleport an element to the body of the document.
 * @param node The element to teleport
 */
export function portal(node: HTMLElement) {
	let moved = false;
	if (document.body) {
		document.body.appendChild(node);
		moved = true;
	}

	return {
		destroy() {
			if (moved && node.parentNode) {
				node.parentNode.removeChild(node);
			}
		}
	};
}
