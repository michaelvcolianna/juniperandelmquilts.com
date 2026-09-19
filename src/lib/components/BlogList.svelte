<script lang="ts">
	import { resolve } from '$app/paths';
	import StoryblokImage from '$lib/components/StoryblokImage.svelte';
	import { bestImage, excerpt, storyDate } from '$lib/story';
	import type { BlogListing } from '$lib/blog';

	let { listing }: { listing: BlogListing } = $props();

	// Page 1 lives at /blog, not /blog/page/1.
	const previousHref = $derived(
		listing.page <= 1
			? null
			: listing.page === 2
				? resolve('/blog')
				: resolve('/blog/page/[page]', { page: String(listing.page - 1) })
	);

	const nextHref = $derived(
		listing.page >= listing.totalPages
			? null
			: resolve('/blog/page/[page]', { page: String(listing.page + 1) })
	);
</script>

{#if listing.posts.length === 0}
	<p>There are no posts yet.</p>
{:else}
	<ul class="blog-list">
		{#each listing.posts as post (post.uuid)}
			{@const href = resolve('/blog/[slug]', { slug: post.slug })}
			{@const image = bestImage(post.content)}
			{@const summary = excerpt(post.content)}
			<li>
				<article>
					{#if image}
						<!--
							The thumbnail duplicates the heading link, so it is hidden from
							assistive tech and removed from the tab order rather than
							announced twice.
						-->
						<a {href} tabindex="-1" aria-hidden="true">
							<StoryblokImage
								{image}
								decorative
								aspectRatio={340 / 450}
								sizes="(min-width: 768px) 50vw, 100vw"
							/>
						</a>
					{/if}

					<h2><a {href}>{post.name}</a></h2>

					{#if post.first_published_at}
						<time datetime={post.first_published_at}>
							{storyDate(post.first_published_at)}
						</time>
					{/if}

					{#if summary}
						<p>{summary}</p>
					{/if}

					<a {href} class="blog-list__more">
						Read more<span class="sr-only"> of {post.name}</span>
					</a>
				</article>
			</li>
		{/each}
	</ul>
{/if}

{#if listing.totalPages > 1}
	<nav class="pagination" aria-label="Blog pages">
		{#if previousHref}
			<a href={previousHref} rel="prev">Previous</a>
		{:else}
			<span aria-hidden="true">Previous</span>
		{/if}

		<p>Page {listing.page} of {listing.totalPages}</p>

		{#if nextHref}
			<a href={nextHref} rel="next">Next</a>
		{:else}
			<span aria-hidden="true">Next</span>
		{/if}
	</nav>
{/if}

<style>
	.blog-list {
		display: grid;
		gap: clamp(2rem, 5vw, 3rem);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.blog-list article {
		display: grid;
		gap: 0.75rem;
	}

	.blog-list article :global(img) {
		width: 100%;
		border: 1px solid var(--seam);
	}

	.blog-list h2 {
		font-size: var(--text-h3);
		margin: 0;
	}

	.blog-list h2 a {
		color: var(--ink);
		text-decoration: none;
	}

	.blog-list h2 a:hover {
		color: var(--accent);
		text-decoration: underline;
	}

	.blog-list time {
		font-size: var(--text-sm);
		color: var(--muted);
		letter-spacing: 0.02em;
	}

	.blog-list__more {
		justify-self: start;
		font-weight: 500;
	}

	/*
	 * Pagination. The Nuxt version never rendered — its page count evaluated to
	 * NaN — so this is new rather than ported. Disabled directions stay in the
	 * flow as plain text so the control does not shift position between pages.
	 */
	.pagination {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-block-start: clamp(2.5rem, 6vw, 4rem);
		padding-block-start: 1.5rem;
		border-top: 1px solid var(--seam);
	}

	.pagination a,
	.pagination span {
		display: inline-flex;
		align-items: center;
		min-height: var(--tap-target);
		padding-inline: 0.25rem;
		font-weight: 500;
	}

	.pagination span {
		color: var(--muted);
	}

	.pagination p {
		font-size: var(--text-sm);
		color: var(--muted);
	}

	@media (min-width: 48em) {
		.blog-list {
			grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
		}
	}
</style>
