/**
 * Encode form data the way Netlify Forms expects it.
 *
 * Netlify's form handler accepts `application/x-www-form-urlencoded`, not JSON
 * and not multipart. `new URLSearchParams(formData)` happens to work at runtime
 * because FormData is iterable, but it is not type-correct and it stringifies
 * any File entry to "[object File]". Walking the entries makes both explicit.
 */
export function encodeFormData(data: FormData): string {
	const params = new URLSearchParams();

	for (const [key, value] of data) {
		// Netlify handles file uploads through a separate mechanism; a File here
		// would silently serialise as "[object File]".
		if (typeof value === 'string') {
			params.append(key, value);
		}
	}

	return params.toString();
}
