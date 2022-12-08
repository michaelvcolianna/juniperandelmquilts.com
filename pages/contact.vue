<script setup>
const form = reactive({
  isLoading: false,
  isSubmitted: false,
  isError: false,
  firstName: '',
  lastName: '',
  email: '',
  message: ''
})

async function handleSubmit(event) {
  const formData = new FormData(event.target)

  form.isLoading = true

  await useFetch('https://formeezy.com/api/v1/forms/63912003de1fcc00082d59be/submissions', {
    method: 'POST',
    body: formData
  })
    .then((response) => {
      form.isSubmitted = true
    })
    .catch((error) => {
      form.isError = true
    })
    .finally(() => {
      form.isLoading = false
    })
}
</script>

<template>
  <section>
    <div>
      <h1>Contact us.</h1>

      <p>contact@juniperandelmquilts.com</p>

      <SocialMedia />
    </div>

    <div v-if="form.isSubmitted" class="thank-you">
      Thank you for your message. If it was an inquiry, we'll get back to you within 1-3 business days.
    </div>

    <form @submit.prevent="handleSubmit" v-else>
      <div class="field dual">
        <div class="label">Name *</div>

        <div class="field">
          <label for="first-name">First Name</label>
          <input id="first-name" name="firstName" v-model="form.firstName" type="text" required autocomplete="given-name" autocorrect="off" spellcheck="false" />
        </div>

        <div class="field">
          <label for="last-name">Last Name</label>
          <input id="last-name" name="lastName" v-model="form.lastName" type="text" required autocomplete="family-name" autocorrect="off" spellcheck="false" />
        </div>
      </div>

      <div class="field">
        <label for="email">Email *</label>
        <input id="email" name="email" v-model="form.email" type="email" required autocomplete="email" autocapitalize="off" autocorrect="off" spellcheck="false" />
      </div>

      <div class="field">
        <label for="message">Message *</label>
        <textarea id="message" name="message" v-model="form.message" required></textarea>
      </div>

      <div class="submit">
        <button :disabled="form.isLoading" type="submit">Send</button>

        <div role="alert" v-if="form.isError">
          There was a problem submitting your form. If it persists, please try emailing us directly, instead.
        </div>
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

.thank-you {
  font-size: var(--font-size-h4);
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

.submit {
  display: flex;
  flex-wrap: var(--form-submit-wrap);
  gap: 1rem;
}

button {
  background-color: var(--color-grey-medium);
  border: 1px solid var(--color-grey-medium);
  color: var(--color-white);
  padding: 1.25rem 2rem;

  @include motion {
    transition: background-color var(--tx-duration) var(--tx-easing),
                color var(--tx-duration) var(--tx-easing);
  }

  &[disabled] {
    background-color: transparent;
    color: var(--color-grey-medium);
  }
}
</style>
