import { describe, it, expect } from 'vitest';
import { encodeFormData } from './forms';

describe('encodeFormData', () => {
	it('encodes fields as url-encoded pairs', () => {
		const data = new FormData();
		data.append('firstName', 'Lani');
		data.append('email', 'lani@example.com');

		expect(encodeFormData(data)).toBe('firstName=Lani&email=lani%40example.com');
	});

	it('escapes characters that would break the encoding', () => {
		const data = new FormData();
		data.append('message', 'Hello & goodbye = fine? yes+no');

		expect(encodeFormData(data)).toBe('message=Hello+%26+goodbye+%3D+fine%3F+yes%2Bno');
	});

	it('preserves the hidden form-name Netlify requires', () => {
		const data = new FormData();
		data.append('form-name', 'contact');

		expect(encodeFormData(data)).toContain('form-name=contact');
	});

	it('keeps repeated keys', () => {
		const data = new FormData();
		data.append('tag', 'a');
		data.append('tag', 'b');

		expect(encodeFormData(data)).toBe('tag=a&tag=b');
	});

	it('skips File entries rather than writing "[object File]"', () => {
		const data = new FormData();
		data.append('email', 'lani@example.com');
		data.append('upload', new File(['x'], 'quilt.jpg', { type: 'image/jpeg' }));

		const encoded = encodeFormData(data);
		expect(encoded).toBe('email=lani%40example.com');
		expect(encoded).not.toContain('object');
	});

	it('handles an empty form', () => {
		expect(encodeFormData(new FormData())).toBe('');
	});

	it('keeps empty values, so an untouched honeypot still submits', () => {
		const data = new FormData();
		data.append('bot-field', '');
		expect(encodeFormData(data)).toBe('bot-field=');
	});
});
