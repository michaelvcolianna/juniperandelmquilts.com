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
