import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { schema } from './schema';

/**
 * The schema and the renderer have to agree. A block defined in Storyblok with
 * no Svelte component renders nothing; a component with no schema entry can
 * never be added to a page. Both failures are silent at runtime, so they are
 * caught here instead.
 */

const blocks = Object.values(schema.blocks);
// Widened: `block.name` narrows to a literal union, which makes comparing it
// against names read from source a type error rather than a test.
const schemaNames: string[] = blocks.map((block) => block.name as string).sort();

/**
 * Read the registry keys from source rather than importing it — componentMap.ts
 * pulls in .svelte files, which the node-environment test project cannot load.
 */
function registryNames(): string[] {
	const source = readFileSync(new URL('./componentMap.ts', import.meta.url), 'utf8');
	const body = source.slice(source.indexOf('const registry'), source.indexOf('export function'));

	return [...body.matchAll(/^\t(?:'([^']+)'|([a-z][a-zA-Z]*)):\s*[A-Z]/gm)]
		.map((match) => match[1] ?? match[2])
		.sort();
}

describe('schema', () => {
	it('defines every block the space needs', () => {
		expect(schemaNames.length).toBeGreaterThan(0);
	});

	it('uses kebab-case names, matching Storyblok’s convention', () => {
		for (const name of schemaNames) {
			expect(name).toMatch(/^[a-z][a-z0-9-]*$/);
		}
	});

	it('has exactly one root block', () => {
		const roots = blocks.filter((block) => block.is_root);
		expect(roots.map((block) => block.name)).toEqual(['content']);
	});

	it('gives every block at least one field', () => {
		for (const block of blocks) {
			expect(block.fields.length, `${block.name} has no fields`).toBeGreaterThan(0);
		}
	});

	it('never repeats a field name within a block', () => {
		for (const block of blocks) {
			const names = block.fields.map((field) => field.name);
			expect(new Set(names).size, `${block.name} has duplicate fields`).toBe(names.length);
		}
	});
});

describe('schema and component registry agree', () => {
	it('reads the registry successfully', () => {
		// Without this, a broken parse would make the two tests below pass on
		// empty arrays and quietly stop guarding anything.
		expect(registryNames().length).toBe(schemaNames.length);
	});

	it('every schema block has a Svelte component', () => {
		const registry = registryNames();
		// The root `content` block is rendered by Content.svelte, which is registered.
		const missing = schemaNames.filter((name) => !registry.includes(name));
		expect(missing, `no component registered for: ${missing.join(', ')}`).toEqual([]);
	});

	it('every registered component has a schema block', () => {
		const orphans = registryNames().filter((name) => !schemaNames.includes(name));
		expect(orphans, `no schema block for: ${orphans.join(', ')}`).toEqual([]);
	});
});

describe('fields the frontend depends on', () => {
	const fieldNames = (blockName: string): string[] =>
		blocks.find((block) => (block.name as string) === blockName)?.fields.map((f) => f.name) ?? [];

	// Each of these is read by name somewhere in src/, so renaming one in the
	// schema without updating the component would break rendering silently.
	it.each([
		['content', ['body', 'card', 'description']],
		['mantel', ['image', 'headline', 'copy']],
		['featured-items', ['headline', 'copy', 'items', 'images']],
		['accent-image', ['image']],
		['aligned-image', ['title', 'alignment', 'image', 'content']],
		['image-gallery', ['images']],
		['cta', ['headline', 'copy']],
		['newsletter-signup', ['image', 'headline', 'copy']],
		['blog-post', ['body', 'excerpt', 'show_hero', 'hero']]
	])('%s exposes %j', (blockName, expected) => {
		expect(fieldNames(blockName)).toEqual(expect.arrayContaining(expected as string[]));
	});
});

describe('the generated model is what is loaded', () => {
	const blocks = Object.values(schema.blocks);
	// The field union is discriminated by `type`, so properties like
	// `description` only exist on some members. Widened for assertions.
	const field = (block: string, name: string): Record<string, unknown> | undefined =>
		blocks.find((b) => (b.name as string) === block)?.fields.find((f) => f.name === name) as
			Record<string, unknown> | undefined;

	it('mantel.copy is a textarea, which only the real space knows', () => {
		// My hand-written schema guessed `text`; schema:diff proved it wrong.
		expect(field('mantel', 'copy')?.type).toBe('textarea');
	});

	it('carries the editor descriptions written in Storyblok', () => {
		expect(field('mantel', 'headline')?.description).toBe('Large text displayed in the mantel.');
	});

	it('includes the folders the space defines', () => {
		expect(Object.keys(schema.folders ?? {})).toHaveLength(3);
	});
});
