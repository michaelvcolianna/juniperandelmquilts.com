<script setup>
import kwesforms from 'kwesforms'

onMounted(() => {
  setTimeout(() => {
    kwesforms.init()
  }, 195)
})
</script>

<template>
  <section>
    <div>
      <h1 class="h2">Contact us.</h1>

      <p>contact@juniperandelmquilts.com</p>

      <SocialMedia />
    </div>

    <form class="kwes-form" action="https://kwesforms.com/api/foreign/forms/R01Mg0yoWlERXfl3ItX5">
      <div class="field dual">
        <div class="label">Name *</div>

        <div class="field">
          <label for="first-name">First Name</label>
          <input id="first-name" name="first_name" type="text" rules="required" autocomplete="given-name" autocorrect="off" spellcheck="false" />
        </div>

        <div class="field">
          <label for="last-name">Last Name</label>
          <input id="last-name" name="last_name" type="text" rules="required" autocomplete="family-name" autocorrect="off" spellcheck="false" />
        </div>
      </div>

      <div class="field">
        <label for="email">Email *</label>
        <input id="email" name="email" type="email" rules="required|email" autocomplete="email" autocapitalize="off" autocorrect="off" spellcheck="false" />
      </div>

      <div class="field">
        <label for="message">Message *</label>
        <textarea id="message" name="message" rules="required|min:3"></textarea>
      </div>

      <div>
        <button type="submit">Send</button>
      </div>
    </form>
  </section>
</template>

<style scoped lang="scss">
section {
  color: var(--color-white);
  display: flex;
  flex-flow: column;
  gap: 2rem;
  padding: 5rem 1rem;

  @include bp(768px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  & > * {
    display: flex;
    flex-flow: column;
    gap: 2rem;
    position: relative;
  }
}

:deep(.kw-alert-error) {
  @include bp(768px) {
    position: absolute;
    top: -4rem;
  }
}

:deep(.kw-alert-warning) {
  display: none;
}

.field {
  display: flex;
  flex-flow: column;
  gap: 0.5rem;

  label {
    order: 1;
  }

  input,
  textarea {
    order: 2;
  }

  :deep(small) {
    order: 3;
  }
}

.dual {
  display: grid;
  gap: 0.5rem;
  grid-template-columns: 1fr 1fr;

  @include bp(768px) {
    gap: 0.5rem 1rem;
  }

  .label {
    grid-column: span 2;
  }

  .field {
    input {
      order: 1;
    }

    label {
      font-size: var(--font-size-dual);
      order: 2;
    }
  }
}

input,
textarea {
  background-color: var(--color-white);
  border: 1px solid var(--color-grey-light);
  border-radius: 2px;
  padding: 0.5rem;
  width: 100%;
}

textarea {
  min-height: 10rem;
  resize: vertical;
}

button {
  background-color: var(--color-grey-medium);
  border: 0;
  color: var(--color-white);
  padding: 1.25rem 2rem;;
}
</style>
