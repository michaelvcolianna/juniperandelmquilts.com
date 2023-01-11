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

const meta = {
  title: 'Contact | Juniper & Elm Quilts',
  description: 'Methods to contact us, as well as a form to submit a message.',
  url: metaUrl()
}

useHead({
  title: meta.title,
  link: [
    { hid: 'canonical', rel: 'canonical', href: meta.url },
  ],
  meta: [
    { hid: 'og:url', property: 'og:url', content: meta.url },
    { hid: 'twitter:url', property: 'twitter:url', content: meta.url },
    { hid: 'title', property: 'title', content: meta.title },
    { hid: 'og:title', property: 'og:title', content: meta.title },
    { hid: 'twitter:title', property: 'twitter:title', content: meta.title },
    { hid: 'description', property: 'description', content: meta.description },
    { hid: 'og:description', property: 'og:description', content: meta.description },
    { hid: 'twitter:description', property: 'twitter:description', content: meta.description }
  ]
})
</script>

<template>
  <section>
    <div class="flexy">
      <h1>Contact us.</h1>

      <p>info@juniperandelmquilts.com</p>

      <SocialMedia />
    </div>

    <form :disabled="form.isLoading" @submit.prevent="handleSubmit">
      <div v-if="form.isLoading" class="spinner">
        <span>Submitting...</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="1em" fill="currentColor"><circle class="bounce-1" cx="4" cy="12" r="3"/><circle class="bounce-1 bounce-2" cx="12" cy="12" r="3"/><circle class="bounce-1 bounce-3" cx="20" cy="12" r="3"/></svg>
      </div>

      <div v-else-if="form.isSubmitted" class="thank-you">
        Thank you for your message. If it was an inquiry, we'll get back to you within 1-3 business days.
      </div>

      <div class="flexy">
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
      </div>
    </form>
  </section>
</template>

<style scoped lang="scss">
section {
  color: var(--color-white);
  display: var(--display-contact);
  flex-flow: column;
  gap: 2rem;
  grid-template-columns: 1fr 1fr;
  margin: auto;
  max-width: 1200px;
  padding: 5rem 1rem;
}

.flexy {
  display: flex;
  flex-flow: column;
  gap: 2rem;
  position: relative;
}

.thank-you {
  background-color: var(--color-grey-dark);
  bottom: 0;
  font-size: var(--font-size-h4);
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1;
}

form {
  position: relative;

  &[disabled="true"] {
    .flexy {
      opacity: 0.5;
    }
  }
}

.spinner {
  align-items: flex-end;
  bottom: 0;
  display: flex;
  font-size: var(--spinner-font-size);
  justify-content: center;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;

  span {
    left: -999rem;
    padding-bottom: 1.25rem;
    position: var(--spinner-span-position);
  }

  svg {
    display: var(--spinner-svg-display);
  }
}

.bounce-1 {
  animation: bounce 1.05s infinite;
}

.bounce-2 {
  animation-delay: .1s;
}

.bounce-3 {
  animation-delay: .2s;
}

@keyframes bounce {
  0%, 57.14% {
    animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
    transform: translate(0);
  }

  28.57% {
    animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
    transform: translateY(-6px);
  }

  100% {
    transform: translate(0);
  }
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
  gap: var(--gap-contact);
  grid-template-columns: 1fr 1fr;

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
  background-color: var(--color-grey-light);
  border: 1px solid var(--color-grey-light);
  color: var(--color-black);
  padding: 1.25rem 2rem;
  transition: var(--button-tx);

  &[disabled] {
    background-color: transparent;
    color: var(--color-grey-light);
  }
}
</style>
