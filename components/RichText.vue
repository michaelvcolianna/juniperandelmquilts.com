<script setup>
const props = defineProps({ content: Object })

const nodes = []

Object.entries(props.content.content).forEach(([key, node]) => {
  if(node.type === 'blok') {
    const blok = {
      content: node.attrs?.body?.[0]
    }

    nodes.push({
      key,
      type: 'blok',
      content: {
        blok
      }
    })
  }
  else {
    nodes.push({
      key,
      type: 'html',
      content: renderRichText(({
        type: 'doc',
        content: [node]
      }))
    })
  }
})
</script>

<template>
  <template v-for="node in nodes" :key="node.key">
    <component
      v-if="node.type === 'blok'"
      :is="node.content.blok.content.component"
      :blok="node.content.blok.content"
    />

    <div
      v-else
      v-html="node.content"
      class="rich-text"
      :id="`rich-text-${node.key}`"
    ></div>
  </template>
</template>

<style scoped lang="scss">
:deep(hr) {
  background-color: var(--color-grey-medium);
  border: 0;
  height: 1px;
}
</style>
